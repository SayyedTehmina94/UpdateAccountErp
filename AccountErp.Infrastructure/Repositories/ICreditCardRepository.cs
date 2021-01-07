using AccountErp.Dtos;
using AccountErp.Dtos.CreditCard;
using AccountErp.Entities;
using AccountErp.Models.CreditCard;
using AccountErp.Utilities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Repositories
{
    public interface ICreditCardRepository
    {
        Task AddAsync(CreditCard entity);

        void Edit(CreditCard entity);

        Task<CreditCard> GetAsync(int id);

        Task<CreditCardDetailDto> GetDetailAsync(int id);

        Task<CreditCardDetailDto> GetForEditAsync(int id);

        Task<JqDataTableResponse<CreditCardListItemDto>> GetPagedResultAsync(CreditCardJqDataTableRequestModel model);

        Task<bool> IsCreditCardNumberExistsAsync(string creditCardNumber);

        Task<bool> IsCreditCardNumberExistsForEditAsync(int id, string creditCardNumber);

        Task<IEnumerable<SelectListItemDto>> GetSelectItemsAsync();

        Task ToggleStatusAsync(int id);

        Task DeleteAsync(int id);
    }
}
