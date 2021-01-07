using AccountErp.Dtos.ChartofAccount;
using AccountErp.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Repositories
{
    public interface IChartOfAccountRepository
    {
        Task AddAsync(COA_Account model);

        void Edit(COA_Account entity);

        Task<AccountDeatilDto> GetDetailAsync(int id);

        Task<AccountDeatilDto> GetForEditAsync(int id);

        Task<List<COADetailDto>> GetCOADetailAsync();
        Task<COA_Account> GetAsync(int id);
        Task<List<AccountDeatilDto>> getAccountByTypeId(int id);
        Task<List<AccountTypeDetailDto>> GetDetailByMarterIdAsync(int id);
       
    }
}
