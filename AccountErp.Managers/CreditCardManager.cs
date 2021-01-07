using AccountErp.Dtos;
using AccountErp.Dtos.CreditCard;
using AccountErp.Factories;
using AccountErp.Infrastructure.DataLayer;
using AccountErp.Infrastructure.Managers;
using AccountErp.Infrastructure.Repositories;
using AccountErp.Models.CreditCard;
using AccountErp.Utilities;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AccountErp.Managers
{
    public class CreditCardManager : ICreditCardManager
    {
        private readonly ICreditCardRepository _creditCardRepository;
        private readonly IUnitOfWork _unitOfWork;

        private readonly string _userId;

        public CreditCardManager(IHttpContextAccessor contextAccessor, 
            ICreditCardRepository creditCardRepository,
            IUnitOfWork unitOfWork)
        {
            _userId = contextAccessor.HttpContext.User.GetUserId();
            _creditCardRepository = creditCardRepository;
            _unitOfWork = unitOfWork;
        }


        public async Task AddAsync(CreditCardAddModel model)
        {
            await _creditCardRepository.AddAsync(CreditCardFactory.Create(model,_userId));
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task EditAsync(CreditCardEditModel model)
        {
            var creditCard = await _creditCardRepository.GetAsync(model.Id);
            CreditCardFactory.Create(model, creditCard,_userId);
            _creditCardRepository.Edit(creditCard);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task<CreditCardDetailDto> GetDetailAsync(int id)
        {
            return await _creditCardRepository.GetDetailAsync(id);
        }
        public async Task<CreditCardDetailDto> GetForEditAsync(int id)
        {
            return await _creditCardRepository.GetForEditAsync(id);
        }

        public async Task<JqDataTableResponse<CreditCardListItemDto>> GetPagedResultAsync(CreditCardJqDataTableRequestModel model)
        {
            return await _creditCardRepository.GetPagedResultAsync(model);
        }

        public async Task<bool> IsCreditCardNumberExistsAsync(string creditCardNumber)
        {
            return await _creditCardRepository.IsCreditCardNumberExistsAsync(creditCardNumber);
        }

        public async Task<bool> IsCreditCardNumberExistsForEditAsync(int id, string creditCardNumber)
        {
            return await _creditCardRepository.IsCreditCardNumberExistsForEditAsync(id, creditCardNumber);
        }


        public async Task<IEnumerable<SelectListItemDto>> GetSelectItemsAsync()
        {
            return await _creditCardRepository.GetSelectItemsAsync();
        }

        public async Task ToggleStatusAsync(int id)
        {
            await _creditCardRepository.ToggleStatusAsync(id);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            await _creditCardRepository.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
