using AccountErp.Dtos;
using AccountErp.Dtos.CreditCard;
using AccountErp.Models.CreditCard;
using AccountErp.Utilities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Managers
{
    public interface ICreditCardManager
    {
        Task AddAsync(CreditCardAddModel model);
        Task EditAsync(CreditCardEditModel model);

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
