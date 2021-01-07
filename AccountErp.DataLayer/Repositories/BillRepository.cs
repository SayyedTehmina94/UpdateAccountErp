using AccountErp.Dtos;
using AccountErp.Dtos.Bill;
using AccountErp.Dtos.Vendor;
using AccountErp.Entities;
using AccountErp.Infrastructure.Repositories;
using AccountErp.Models.Bill;
using AccountErp.Utilities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;

namespace AccountErp.DataLayer.Repositories
{
    public class BillRepository : IBillRepository
    {
        private readonly DataContext _dataContext;

        public BillRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task AddAsync(Bill entity)
        {
            await _dataContext.Bills.AddAsync(entity);
        }

        public void Edit(Bill entity)
        {
            _dataContext.Bills.Update(entity);
        }

        public async Task<Bill> GetAsync(int id)
        {
            return await _dataContext.Bills
                .Include(x => x.Items)
                .Include(x => x.Attachments)
                .SingleAsync(x => x.Id == id);
        }

        public async Task<JqDataTableResponse<BillListItemDto>> GetPagedResultAsync(BillJqDataTableRequestModel model)
        {
            if (model.Length == 0)
            {
                model.Length = Constants.DefaultPageSize;
            }
            var filterKey = model.Search.Value;

            var linqstmt = (from b in _dataContext.Bills
                            join v in _dataContext.Vendors
                            on b.VendorId equals v.Id
                            where 
                             (model.VendorId == null || b.VendorId == model.VendorId.Value)
                            && (model.FilterKey == null
                            || EF.Functions.Like(b.Id.ToString(), "%" + model.FilterKey + "%")
                                || EF.Functions.Like(v.Name, "%" + model.FilterKey + "%")
                                || EF.Functions.Like(b.BillNumber, "%" + model.FilterKey + "%")) 
                                && b.Status != Constants.BillStatus.Deleted
                            select new BillListItemDto
                            {
                                Id = b.Id,
                                VendorId = b.VendorId,
                                VendorName = v.Name,
                                Description = b.Remark,
                                Amount = b.Items.Sum(x => x.Rate),
                                Discount = b.Discount,
                                Tax = b.Tax,
                                TotalAmount = b.TotalAmount,
                                Status = b.Status,
                                CreatedOn = b.CreatedOn,
                                BillDate = b.BillDate,
                                DueDate = b.DueDate.Value,
                                StrBillDate = b.StrBillDate,
                                StrDueDate = b.StrDueDate,
                                Notes = b.Notes,
                                BillNumber = b.BillNumber,
                                SubTotal = b.SubTotal,
                                RefrenceNumber = b.RefrenceNumber

                            })
                            .AsNoTracking();

            var sortExpression = model.GetSortExpression();

            var pagedResult = new JqDataTableResponse<BillListItemDto>
            {
                RecordsTotal = await _dataContext.Bills.CountAsync(x => x.Status != Constants.BillStatus.Deleted),
                RecordsFiltered = await linqstmt.CountAsync(),
                Data = await linqstmt.OrderBy(sortExpression).Skip(model.Start).Take(model.Length).ToListAsync()
            };

            return pagedResult;
        }
        
 public async Task<JqDataTableResponse<BillListItemDto>> getTopFiveBillsAsync(BillJqDataTableRequestModel model)
        {
            if (model.Length == 0)
            {
                model.Length = Constants.DefaultPageSize;
            }
            var filterKey = model.Search.Value;
            model.Order[0].Dir = "desc";
            model.Order[0].Column = 4;

            var linqstmt = (from b in _dataContext.Bills
                            join v in _dataContext.Vendors
                            on b.VendorId equals v.Id
                            where b.Status != Constants.BillStatus.Deleted
                            && (model.VendorId == null || b.VendorId == model.VendorId.Value)
                            && (model.FilterKey == null
                                || EF.Functions.Like(b.Id.ToString(), "%" + model.FilterKey + "%")
                                || EF.Functions.Like(v.Name, "%" + model.FilterKey + "%")
                                || EF.Functions.Like(b.BillNumber, "%" + model.FilterKey + "%"))
                            select new BillListItemDto
                            {
                                Id = b.Id,
                                VendorId = b.VendorId,
                                VendorName = v.Name,
                                Description = b.Remark,
                                Amount = b.Items.Sum(x => x.Rate),
                                Discount = b.Discount,
                                Tax = b.Tax,
                                TotalAmount = b.TotalAmount,
                                Status = b.Status,
                                CreatedOn = b.CreatedOn,
                                BillDate = b.BillDate,
                                DueDate = b.DueDate.Value,
                                StrBillDate = b.StrBillDate,
                                StrDueDate = b.StrDueDate,
                                Notes = b.Notes,
                                BillNumber = b.BillNumber,
                                SubTotal = b.SubTotal,
                                RefrenceNumber = b.RefrenceNumber

                            })
                            .AsNoTracking().Take(5);

            var sortExpression = model.GetSortExpression();

            var pagedResult = new JqDataTableResponse<BillListItemDto>
            {
                RecordsTotal = await _dataContext.Bills.CountAsync(x => (model.VendorId == null || x.VendorId == model.VendorId.Value)
                    && x.Status != Constants.BillStatus.Deleted),
                RecordsFiltered = await linqstmt.CountAsync(),
                Data = await linqstmt.OrderBy(sortExpression).Skip(model.Start).Take(model.Length).ToListAsync()
            };

            return pagedResult;
        }

        public async Task<List<BillListItemDto>> GetRecentAsync()
        {
            var linqstmt = (from e in _dataContext.Bills
                            join v in _dataContext.Vendors
                            on e.VendorId equals v.Id
                            where e.Status == Constants.BillStatus.Pending
                            select new BillListItemDto
                            {
                                Id = e.Id,
                                VendorId = e.VendorId,
                                VendorName = v.Name,
                                Tax = e.Tax ?? 0,
                                TotalAmount = e.TotalAmount,
                                Status = e.Status,
                                BillDate = e.BillDate,
                                DueDate = e.DueDate.Value,
                                StrBillDate = e.StrBillDate,
                                StrDueDate = e.StrDueDate,
                                Notes = e.Notes,
                                BillNumber = e.BillNumber,
                                PoSoNumber = e.PoSoNumber,
                                SubTotal = e.SubTotal,
                                RefrenceNumber = e.RefrenceNumber
                            })
                            .AsNoTracking();

            return await linqstmt.OrderByDescending(x => x.Id).Take(5).ToListAsync();
        }

        public async Task<BillDetailDto> GetDetailAsync(int id)
        {
            return await (from b in _dataContext.Bills
                          join v in _dataContext.Vendors
                          on b.VendorId equals v.Id
                          where b.Id == id
                          select new BillDetailDto
                          {
                              Id = b.Id,
                              Name = b.Vendor.Name,
                              Phone = b.Vendor.Phone,
                              Email = b.Vendor.Email,
                              Tax = b.Tax,
                              TotalAmount = b.TotalAmount,
                              Remark = b.Remark,
                              Discount = b.Discount,
                              Status = b.Status,
                              CreatedOn = b.CreatedOn,
                              BillDate = b.BillDate,
                              DueDate = b.DueDate.Value,
                              StrBillDate = b.StrBillDate,
                              StrDueDate = b.StrDueDate,
                              Notes = b.Notes,
                              BillNumber = b.BillNumber,
                              PoSoNumber = b.PoSoNumber,
                              SubTotal = b.SubTotal,
                              RefrenceNumber = b.RefrenceNumber,
                              Vendor = new VendorPersonallnfoDto
                              {
                                  Name = v.Name,
                                  HSTNumber = v.HSTNumber,
                                  Email = v.Email,
                                  Phone = v.Phone,
                                  Discount = v.Discount
                              },
                              Items = b.Items.Select(x => new BillServiceDto
                              {
                                  Id = x.ItemId,
                                  Type = x.Item.Name,
                                  Rate = x.Rate,
                                  Name = x.Item.Name,
                                  Description = x.Item.Description,
                                  Price = x.Price,
                                  TaxId = x.TaxId,
                                  TaxPercentage = x.TaxPercentage,
                                  Quantity = x.Quantity,
                                  TaxPrice = x.TaxPrice,
                                  LineAmount = x.LineAmount,
                                  BankAccountId = x.Item.BankAccountId,
                                  TaxBankAccountId = x.Taxes.BankAccountId
                                  

                              }),
                              Attachments = b.Attachments.Select(x => new BillAttachmentDto
                              {
                                  Id = x.Id,
                                  Title = x.Title,
                                  FileName = x.FileName,
                                  OriginalFileName = x.OriginalFileName
                              })
                          })
                         .AsNoTracking()
                         .SingleOrDefaultAsync();
        }

        public async Task<BillDetailForEditDto> GetDetailForEditAsync(int id)
        {
            return await (from e in _dataContext.Bills
                          join v in _dataContext.Vendors
                          on e.VendorId equals v.Id

                          where e.Id == id
                          select new BillDetailForEditDto
                          {
                              Id = e.Id,
                              VendorId = e.VendorId,
                              Phone = e.Vendor.Phone,
                              Email = e.Vendor.Email,
                              Tax = e.Tax,
                              TotalAmount = e.TotalAmount,
                              Remark = e.Remark,
                              Discount = e.Discount,
                              BillDate = e.BillDate,
                              DueDate = e.DueDate.Value,
                              StrBillDate = e.StrBillDate,
                              StrDueDate = e.StrDueDate,
                              Notes = e.Notes,
                              BillNumber = e.BillNumber,
                              PoSoNumber = e.PoSoNumber,
                              SubTotal = e.SubTotal,
                              RefrenceNumber = e.RefrenceNumber,
                              Items = e.Items.Select(x => new BillServiceDto
                              {
                                  Id = x.ItemId,
                                  Type = x.Item.Name,
                                  Rate = x.Rate,
                                  Name = x.Item.Name,
                                  Description = x.Item.Description,
                                  Quantity = x.Quantity,
                                  Price = x.Price,
                                  TaxId = x.TaxId,
                                  TaxPercentage = x.TaxPercentage,
                                  TaxPrice = x.TaxPrice,
                                  LineAmount = x.LineAmount,
                                  BankAccountId = x.Item.BankAccountId,
                                  TaxBankAccountId = x.Taxes.BankAccountId

                              }),
                              Attachments = e.Attachments.Select(x => new BillAttachmentDto
                              {
                                  Id = x.Id,
                                  Title = x.Title,
                                  FileName = x.FileName,
                                  OriginalFileName = x.OriginalFileName
                              })
                          })
                .AsNoTracking()
                .SingleOrDefaultAsync();
        }

        public async Task<BillSummaryDto> GetSummaryAsunc(int id)
        {
            return await (from e in _dataContext.Bills
                          join v in _dataContext.Vendors
                              on e.VendorId equals v.Id
                          where e.Id == id
                          select new BillSummaryDto
                          {
                              Id = e.Id,
                              VendorId = v.Id,
                              VendorName = v.Name,
                              Tax = e.Tax,
                              Discount = e.Discount,
                              TotalAmount = e.TotalAmount,
                              Description = e.Remark,
                              BillDate = e.BillDate,
                              StrBillDate = e.StrBillDate,
                              DueDate = e.DueDate.Value,
                              StrDueDate = e.StrDueDate,
                              PoSoNumber = e.PoSoNumber,
                              Notes = e.Notes,
                              BillNumber = e.BillNumber,
                              SubTotal = e.SubTotal,
                              RefrenceNumber = e.RefrenceNumber

                          })
                .AsNoTracking()
                .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<SelectListItemDto>> GetSelectItemsAsync()
        {
            return await _dataContext.Bills
                .AsNoTracking()
                .Where(x => x.Status != Constants.BillStatus.Deleted)
                .OrderBy(x => x.RefrenceNumber)
                .Select(x => new SelectListItemDto
                {
                    KeyInt = x.Id,
                    Value = x.RefrenceNumber
                }).ToListAsync();
        }

        public async Task UpdateStatusAsync(int id, Constants.BillStatus status)
        {
            var bill = await _dataContext.Bills.FindAsync(id);
            bill.Status = status;
            _dataContext.Bills.Update(bill);
        }

        public async Task DeleteAsync(int id)
        {
            var bill = await _dataContext.Bills.FindAsync(id);
            bill.Status = Constants.BillStatus.Deleted;
            _dataContext.Bills.Update(bill);
        }
        public async Task<int> getCount()
        {
            int count = await _dataContext.Bills.CountAsync();
            return count;
        }

        public async Task<List<BillListItemDto>> GetAllUnpaidAsync()
        {
            var linqstmt = await  (from e in _dataContext.Bills
                            join v in _dataContext.Vendors
                            on e.VendorId equals v.Id
                            where e.Status != Constants.BillStatus.Deleted && e.Status != Constants.BillStatus.Paid
                                   select new BillListItemDto
                            {
                                Id = e.Id,
                                VendorId = e.VendorId,
                                VendorName = v.Name,
                                Tax = e.Tax ?? 0,
                                TotalAmount = e.TotalAmount,
                                Status = e.Status,
                                BillDate = e.BillDate,
                                DueDate = e.DueDate.Value,
                                StrBillDate = e.StrBillDate,
                                StrDueDate = e.StrDueDate,
                                Notes = e.Notes,
                                BillNumber = e.BillNumber,
                                PoSoNumber = e.PoSoNumber,
                                SubTotal = e.SubTotal,
                                RefrenceNumber = e.RefrenceNumber
                                   })
                            .AsNoTracking()
                            .ToListAsync();

            return linqstmt;
        }
    }
}
