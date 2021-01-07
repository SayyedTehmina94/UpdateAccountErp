using AccountErp.Dtos;
using AccountErp.Dtos.Item;
using AccountErp.Entities;
using AccountErp.Infrastructure.Repositories;
using AccountErp.Models.Item;
using AccountErp.Utilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;

namespace AccountErp.DataLayer.Repositories
{
    public class ItemRepository : IItemRepository
    {
        private readonly DataContext _dataContext;

        public ItemRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task AddAsync(Item entity)
        {
            await _dataContext.AddAsync(entity);
        }

        public void Edit(Item entity)
        {
            _dataContext.Update(entity);
        }

        public async Task<Item> GetAsync(int id)
        {
            return await _dataContext.Items.FindAsync(id);
        }

        public async Task<IEnumerable<Item>> GetAsync(List<int> itemIds)
        {
            return await _dataContext.Items.Include(x => x.SalesTax).Where(x => itemIds.Contains(x.Id)).ToListAsync();
        }

        public async Task<ItemDetailDto> GetDetailAsync(int id)
        {
            return await (from s in _dataContext.Items
                          where s.Id == id
                          select new ItemDetailDto
                          {
                              Id = s.Id,
                              Name = s.Name,
                              Rate = s.Rate,
                              Description = s.Description,
                              IsTaxable = s.IsTaxable,
                              TaxCode = s.SalesTax.Code,
                              Status = s.Status,
                              isForSell = s.isForSell,
                              BankAccountId = s.BankAccountId
                          })
                          .AsNoTracking()
                          .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<ItemDetailDto>> GetAllAsync(Constants.RecordStatus? status = null)
        {
            return await (from s in _dataContext.Items
                          join c in _dataContext.SalesTaxes
                          on s.SalesTaxId equals c.Id
                         into groupjoin_Sales
                          from c in groupjoin_Sales.DefaultIfEmpty()
                          where status == null
                            ? s.Status != Constants.RecordStatus.Deleted
                            : s.Status == status.Value
                          orderby s.Name
                          select new ItemDetailDto
                          {
                              Id = s.Id,
                              Name = s.Name,
                              Rate = s.Rate,
                              Description = s.Description,
                              IsTaxable = s.IsTaxable,
                              TaxCode = s.SalesTax.Code,
                              TaxPercentage = s.SalesTax.TaxPercentage,
                              Status = s.Status,
                              SalesTaxId = s.SalesTaxId,
                              isForSell = s.isForSell,
                              BankAccountId = s.BankAccountId,
                              TaxBankAccountId = c.BankAccountId
                          })
                          .AsNoTracking()
                            .ToListAsync();
        }

        public async Task<ItemDetailForEditDto> GetForEditAsync(int id)
        {
            return await (from s in _dataContext.Items
                          where s.Id == id
                          select new ItemDetailForEditDto
                          {
                              Id = s.Id,
                              Name = s.Name,
                              Rate = s.Rate,
                              Description = s.Description,
                              IsTaxable = s.IsTaxable ? "1" : "0",
                              SalesTaxId = s.SalesTaxId,
                              isForSell = (bool)s.isForSell ? "1" : "0",
                              BankAccountId = s.BankAccountId
                          })
                         .AsNoTracking()
                         .SingleOrDefaultAsync();
        }

        public async Task<JqDataTableResponse<ItemListItemDto>> GetPagedResultAsync(ItemJqDataTableRequestModel model)
        {
            if (model.Length == 0)
            {
                model.Length = Constants.DefaultPageSize;
            }

            var filterKey = model.Search.Value;

            var linqStmt = (from s in _dataContext.Items
                            where s.Status != Constants.RecordStatus.Deleted
                                && (model.FilterKey == null
                                || EF.Functions.Like(s.Name, "%" + model.FilterKey + "%")
                                || EF.Functions.Like(s.Description, "%" + model.FilterKey + "%"))
                            select new ItemListItemDto
                            {
                                Id = s.Id,
                                Name = s.Name,
                                Rate = s.Rate,
                                Description = s.Description ?? "",
                                Status = s.Status,
                                TaxCode = s.SalesTax.Code,
                                TaxPercentage = s.SalesTax.TaxPercentage,
                                BankAccountId = s.BankAccountId
                            })
                            .AsNoTracking();

            var sortExpresstion = model.GetSortExpression();

            var pagedResult = new JqDataTableResponse<ItemListItemDto>
            {
                RecordsTotal = await _dataContext.Items.CountAsync(x => x.Status != Constants.RecordStatus.Deleted),
                RecordsFiltered = await linqStmt.CountAsync(),
                Data = await linqStmt.OrderBy(sortExpresstion).Skip(model.Start).Take(model.Length).ToListAsync()
            };
            return pagedResult;
        }

        public async Task<IEnumerable<SelectListItemDto>> GetSelectItemsAsync()
        {
            return await _dataContext.Items
                .AsNoTracking()
                .Where(x => x.Status == Constants.RecordStatus.Active)
                .OrderBy(x => x.Name)
                .Select(x => new SelectListItemDto
                {
                    KeyInt = x.Id,
                    Value = x.Name
                }).ToListAsync();
        }

        public async Task ToggleStatusAsync(int id)
        {
            var vendor = await _dataContext.Items.FindAsync(id);

            if (vendor.Status == Constants.RecordStatus.Active)
            {
                vendor.Status = Constants.RecordStatus.Inactive;
            }
            else if (vendor.Status == Constants.RecordStatus.Inactive)
            {
                vendor.Status = Constants.RecordStatus.Active;
            }

            _dataContext.Items.Update(vendor);
        }

        public bool checkItemAvailable(int id)
        {
            var invoice_ids = _dataContext.InvoiceServices.Where(x => x.ServiceId == id).Select(x => x.InvoiceId).ToList();
            var bill_ids = _dataContext.BillItems.Where(x => x.ItemId == id).Select(x => x.BillId).ToList();
            var quot_ids = _dataContext.QuotationServices.Where(x => x.ServiceId == id).Select(x => x.QuotationId).ToList();

            string msg = string.Empty;
            bool isvalid = true;

            foreach (int invoiceid in invoice_ids)
            {
                var invoice = _dataContext.Invoices.Where(x => x.Id == invoiceid && x.Status != Constants.InvoiceStatus.Deleted).FirstOrDefault();
                if (invoice != null)
                {
                    isvalid = false;
                 
                }
            }

            foreach (int billid in bill_ids)
            {
                var invoice = _dataContext.Bills.Where(x => x.Id == billid && x.Status != Constants.BillStatus.Deleted).FirstOrDefault();
                if (invoice != null)
                {
                    isvalid = false;

                }
            }
            foreach (int quot_id in quot_ids)
            {
                var invoice = _dataContext.Quotations.Where(x => x.Id == quot_id && x.Status != Constants.InvoiceStatus.Deleted).FirstOrDefault();
                if (invoice != null)
                {
                    isvalid = false;

                }
            }
            return isvalid;
        }

        public async Task DeleteAsync(int id)
        {
            var item = await _dataContext.Items.FindAsync(id);
            item.Status = Constants.RecordStatus.Deleted;
            _dataContext.Items.Update(item);

        }

        public async Task<IEnumerable<ItemDetailDto>> GetAllForSalesAsync(Constants.RecordStatus? status = null)
        {
            return await (from s in _dataContext.Items
                          join c in _dataContext.SalesTaxes
                          on s.SalesTaxId equals c.Id
                         into groupjoin_Sales
                          from c in groupjoin_Sales.DefaultIfEmpty()
                          where status == null
                            ? s.Status != Constants.RecordStatus.Deleted
                            : s.Status == status.Value && s.isForSell == true
                          orderby s.Name
                          select new ItemDetailDto
                          {
                              Id = s.Id,
                              Name = s.Name,
                              Rate = s.Rate,
                              Description = s.Description,
                              IsTaxable = s.IsTaxable,
                              TaxCode = s.SalesTax.Code,
                              TaxPercentage = s.SalesTax.TaxPercentage,
                              Status = s.Status,
                              SalesTaxId = s.SalesTaxId,
                              isForSell = s.isForSell,
                              BankAccountId = s.BankAccountId,
                              TaxBankAccountId = c.BankAccountId
                          })
                        .AsNoTracking()
                          .ToListAsync();
        }



        public async Task<IEnumerable<ItemDetailDto>> GetAllForExpenseAsync(Constants.RecordStatus? status = null)
        {
            return await (from s in _dataContext.Items
                          join c in _dataContext.SalesTaxes
                          on s.SalesTaxId equals c.Id
                         into groupjoin_Sales
                          from c in groupjoin_Sales.DefaultIfEmpty()
                          where status == null
                            ? s.Status != Constants.RecordStatus.Deleted
                            : s.Status == status.Value && s.isForSell == false
                          orderby s.Name
                          select new ItemDetailDto
                          {
                              Id = s.Id,
                              Name = s.Name,
                              Rate = s.Rate,
                              Description = s.Description,
                              IsTaxable = s.IsTaxable,
                              TaxCode = s.SalesTax.Code,
                              TaxPercentage = s.SalesTax.TaxPercentage,
                              Status = s.Status,
                              SalesTaxId = s.SalesTaxId,
                              isForSell = s.isForSell,
                              BankAccountId = s.BankAccountId,
                              TaxBankAccountId = c.BankAccountId
                          })
                        .AsNoTracking()
                          .ToListAsync();
        }


    }
}
