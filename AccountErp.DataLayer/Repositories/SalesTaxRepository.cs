using AccountErp.Dtos;
using AccountErp.Dtos.SalesTax;
using AccountErp.Entities;
using AccountErp.Infrastructure.Repositories;
using AccountErp.Models.SalesTax;
using AccountErp.Utilities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;

namespace AccountErp.DataLayer.Repositories
{
    public class SalesTaxRepository : ISalesTaxRepository
    {
        private readonly DataContext _dataContext;

        public SalesTaxRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<IEnumerable<SalesTaxDetailDto>> GetSelectListItemsAsync()
        {
            return await _dataContext.SalesTaxes
                .AsNoTracking()
                .Where(x=>x.Status != Constants.RecordStatus.Deleted)
                .OrderBy(x => x.Code)
                .Select(x => new SalesTaxDetailDto
                {
                    Id = x.Id,
                    Code = x.Code,
                    Description = x.Description,
                    TaxPercentage = x.TaxPercentage,
                    BankAccountId = x.BankAccountId
                }).ToListAsync();
        }

        public async Task<JqDataTableResponse<SalesTaxListItemDto>> GetPagedResultAsync(SalexTaxJqDataTableRequestModel model)
        {
            if (model.Length == 0)
            {
                model.Length = Constants.DefaultPageSize;
            }
            var filterKey = model.Search.Value;
            var linqstmt = (from st in _dataContext.SalesTaxes
                            where st.Status != Constants.RecordStatus.Deleted
                            && (model.FilterKey == null
                                || EF.Functions.Like(st.Code, "%" + model.FilterKey + "%")
                                || EF.Functions.Like(st.Description, "%" + model.FilterKey + "%"))
                            select new SalesTaxListItemDto
                            {
                                Id = st.Id,
                                Code = st.Code,
                                Description = st.Description ?? "",
                                TaxPercentage = st.TaxPercentage,
                                Status = st.Status,
                                BankAccountId = st.BankAccountId
                            })
                .AsNoTracking();

            var sortExpression = model.GetSortExpression();

            var pagedResult = new JqDataTableResponse<SalesTaxListItemDto>
            {
                RecordsTotal = await _dataContext.SalesTaxes.CountAsync(x=> x.Status != Constants.RecordStatus.Deleted),
                RecordsFiltered = await linqstmt.CountAsync(),
                Data = await linqstmt.OrderBy(sortExpression).Skip(model.Start).Take(model.Length).ToListAsync()
            };

            return pagedResult;
        }

        public async Task AddAsync(SalesTax entity)
        {
            await _dataContext.SalesTaxes.AddAsync(entity);
        }

        public void Edit(SalesTax entity)
        {
            _dataContext.SalesTaxes.Update(entity);
        }

        public async Task<bool> IsCodeExistsAsync(string code)
        {
            return await _dataContext.SalesTaxes.AnyAsync(x => x.Code.Equals(code) && x.Status != Constants.RecordStatus.Deleted );
        }

        public async Task<bool> IsCodeExistsAsync(string code, int id)
        {
            return await _dataContext.SalesTaxes.AnyAsync(x=> x.Code.Equals(code) && x.Id != id);
        }

        public async Task<SalesTaxDetailDto> GetForEditAsync(int id)
        {
            return await (from st in _dataContext.SalesTaxes
                          where st.Id == id
                          select new SalesTaxDetailDto
                          {
                              Id = st.Id,
                              Code = st.Code,
                              Description = st.Description,
                              TaxPercentage = st.TaxPercentage,
                              BankAccountId = st.BankAccountId
                          })
                         .AsNoTracking()
                         .SingleOrDefaultAsync();
        }

        public async Task ToggleStatusAsync(int id)
        {
            var salesTax = await _dataContext.SalesTaxes.FindAsync(id);

            if (salesTax.Status == Constants.RecordStatus.Active)
            {
                salesTax.Status = Constants.RecordStatus.Inactive;
            }
            else if (salesTax.Status == Constants.RecordStatus.Inactive)
            {
                salesTax.Status = Constants.RecordStatus.Active;
            }

            _dataContext.SalesTaxes.Update(salesTax);
        }

        public async Task DeleteAsync(int id)
        {
            var salesTax = await _dataContext.SalesTaxes.FindAsync(id);
            salesTax.Status = Constants.RecordStatus.Deleted;
            _dataContext.SalesTaxes.Update(salesTax);
        }

        public async Task<SalesTax> GetAsync(int id)
        {
            return await _dataContext.SalesTaxes.FindAsync(id);
        }

        public async Task<IEnumerable<SalesTaxDetailDto>> GetActiveOnlyAsync()
        {
            return await _dataContext.SalesTaxes
                .AsNoTracking()
                .Where(x => x.Status == Constants.RecordStatus.Active)
                .OrderBy(x => x.Code)
                .Select(x => new SalesTaxDetailDto
                {
                    Id = x.Id,
                    Code = x.Code,
                    Description = x.Description,
                    TaxPercentage = x.TaxPercentage,
                    BankAccountId = x.BankAccountId
                }).ToListAsync();
        }

    }
}
