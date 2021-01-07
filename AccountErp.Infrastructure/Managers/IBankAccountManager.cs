using AccountErp.Dtos;
using AccountErp.Dtos.BankAccount;
using AccountErp.Models.BankAccount;
using AccountErp.Utilities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Managers
{
    public interface IBankAccountManager
    {
        Task AddAsync(BankAccountAddModel model);

        Task EditAsync(BankAccountEditModel model);

        Task<BankAccountDetailDto> GetDetailAsync(int id);

        Task<BankAccountDetailDto> GetForEditAsync(int id);

        Task<JqDataTableResponse<BankAccountListItemDto>> GetPagedResultAsync(JqDataTableRequest model);

        Task<bool> IsAccountNumberExistsAsync(string accountNumber);

        Task<bool> IsAccountNumberExistsForEditAsync(int id, string accountNumber);

        Task<IEnumerable<SelectListItemDto>> GetSelectItemsAsync();

        Task ToggleStatusAsync(int id);

        Task DeleteAsync(int id);
        Task<IEnumerable<SelectListItemDto>> GetDetailByLedgerTypeAsync(int typeId);
    }
}
