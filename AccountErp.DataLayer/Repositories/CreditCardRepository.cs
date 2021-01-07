using AccountErp.Dtos;
using AccountErp.Dtos.CreditCard;
using AccountErp.Entities;
using AccountErp.Infrastructure.Repositories;
using AccountErp.Models.CreditCard;
using AccountErp.Utilities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;

namespace AccountErp.DataLayer.Repositories
{
    public class CreditCardRepository : ICreditCardRepository
    {
        private readonly DataContext _dataContext;

        public CreditCardRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task AddAsync(CreditCard entity)
        {
            await _dataContext.CreditCards.AddAsync(entity);
        }

        public void Edit(CreditCard entity)
        {
            _dataContext.CreditCards.Update(entity);
        }

        public async Task<CreditCard> GetAsync(int id)
        {
            return await _dataContext.CreditCards.FindAsync(id);
        }

        public async Task<CreditCardDetailDto> GetDetailAsync(int id)
        {
            return await (from cc in _dataContext.CreditCards
                          where cc.Id == id
                          select new CreditCardDetailDto
                          {
                              Id = cc.Id,
                              CreditCardNumber = cc.Number,
                              BankName = cc.BankName,
                              CardHolderName = cc.CardHolderName
                          })
                         .AsNoTracking()
                         .SingleOrDefaultAsync();
        }

        public async Task<CreditCardDetailDto> GetForEditAsync(int id)
        {
            return await (from cc in _dataContext.CreditCards
                          where cc.Id == id && Constants.RecordStatus.Deleted != cc.Status
                          select new CreditCardDetailDto
                          {
                              Id = cc.Id,
                              CreditCardNumber = cc.Number,
                              BankName = cc.BankName,
                              CardHolderName = cc.CardHolderName
                          })
                         .AsNoTracking()
                         .SingleOrDefaultAsync();
        }

        public async Task<JqDataTableResponse<CreditCardListItemDto>> GetPagedResultAsync(CreditCardJqDataTableRequestModel model)
        {
            if (model.Length == 0)
            {
                model.Length = Constants.DefaultPageSize;
            }
            var filterKey = model.Search.Value;
            var linqstmt = (from cc in _dataContext.CreditCards
                            where cc.Status != Constants.RecordStatus.Deleted && (model.FilterKey == null || EF.Functions.Like(cc.Number, "%" + model.FilterKey + "%") || EF.Functions.Like(cc.CardHolderName, "%" + model.FilterKey + "%")
                            || EF.Functions.Like(cc.BankName, "%" + model.FilterKey + "%"))
                            select new CreditCardListItemDto
                            {
                                Id = cc.Id,
                                CreditCardNumber = cc.Number,
                                BankName = cc.BankName,
                                CardHolderName = cc.CardHolderName,
                                Status = cc.Status
                            })
                            .AsNoTracking();

            var sortExpression = model.GetSortExpression();
            var pagedResult = new JqDataTableResponse<CreditCardListItemDto>
            {
                RecordsTotal = await _dataContext.CreditCards.CountAsync(x => x.Status != Constants.RecordStatus.Deleted),
                RecordsFiltered = await linqstmt.CountAsync(),
                Data = await linqstmt.OrderBy(sortExpression)
                .Skip(model.Start)
                .Take(model.Length)
                .ToListAsync()
            };
            return pagedResult;

        }

        public async Task<bool> IsCreditCardNumberExistsAsync(string creditCardNumber)
        {
            return await _dataContext.CreditCards.AnyAsync(x => x.Number == creditCardNumber && x.Status != Constants.RecordStatus.Deleted);
        }

        public async Task<bool> IsCreditCardNumberExistsForEditAsync(int id, string creditCardNumber)
        {
            return await _dataContext.CreditCards.AnyAsync(x => x.Number == creditCardNumber && x.Id != id && x.Status != Constants.RecordStatus.Deleted);
        }

        public async Task ToggleStatusAsync(int id)
        {
            var creditCard = await _dataContext.CreditCards.FindAsync(id);

            if (creditCard.Status == Constants.RecordStatus.Active)
            {
                creditCard.Status = Constants.RecordStatus.Inactive;
            }
            else if (creditCard.Status == Constants.RecordStatus.Inactive)
            {
                creditCard.Status = Constants.RecordStatus.Active;
            }

            _dataContext.CreditCards.Update(creditCard);
        }

        public async Task<IEnumerable<SelectListItemDto>> GetSelectItemsAsync()
        {
            return await _dataContext.CreditCards
                .AsNoTracking()
                .Where(x => x.Status == Constants.RecordStatus.Active)
                .OrderBy(x => x.CardHolderName)
                .Select(x => new SelectListItemDto
                {
                    KeyInt = x.Id,
                    Value = x.Number
                }).ToListAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var creditCard = await _dataContext.CreditCards.FindAsync(id);
            creditCard.Status = Constants.RecordStatus.Deleted;
            _dataContext.CreditCards.Update(creditCard);
        }
    }
}
