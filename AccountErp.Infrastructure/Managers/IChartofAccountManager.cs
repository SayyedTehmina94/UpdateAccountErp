using AccountErp.Dtos.ChartofAccount;
using AccountErp.Models.ChartOfAccount;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Managers
{
    public interface IChartofAccountManager
    {
        Task<int> AddAsync(COA_AccountAddModel model);

        Task EditAsync(COA_AccountEditModel model);

        Task<AccountDeatilDto> GetDetailAsync(int id);

        Task<AccountDeatilDto> GetForEditAsync(int id);
        Task<List<COADetailDto>> GetCOADetailAsync();
        Task<List<AccountDeatilDto>> getAccountByTypeId(int id);
        Task<List<AccountTypeDetailDto>> GetDetailByMarterIdAsync(int id);
        Task<List<AccountDetailsWithMasterDto>> GetDetailForAccountAsync();
        //new
        Task<List<AccountWithMasterDetailsDto>> GetCOAAccountDetailsaAsync();
    }
}
