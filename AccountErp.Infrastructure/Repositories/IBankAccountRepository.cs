using AccountErp.Dtos;
using AccountErp.Dtos.BankAccount;
using AccountErp.Entities;
using AccountErp.Utilities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure
{
    public interface IBankAccountRepository
    {
        Task AddAsync(BankAccount model);
        void Edit(BankAccount model);

        Task<BankAccount> GetAsync(int id);
        Task<BankAccountDetailDto> GetDetailAsync(int id);
        Task<BankAccountDetailDto> GetForEditAsync(int id);

        Task<JqDataTableResponse<BankAccountListItemDto>> GetPagedResultAsync(JqDataTableRequest model);

        Task<bool> IsAccountNumberExistsAsync(string accountNumber);
        Task<bool> IsAccountNumberExistsForEditAsync(int id, string accountNumber);

        Task<IEnumerable<SelectListItemDto>> GetSelectItemsAsync();

        Task ToggleStatusAsync(int id);
        Task DeleteAsync(int id);
        Task<IEnumerable<SelectListItemDto>> GetDetailByLedgerTypeAsync(int typeId);
        Task<SelectListItemDto> getAccountTypeByCode();

    }
}
