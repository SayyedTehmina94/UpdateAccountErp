using AccountErp.Dtos.ChartofAccount;
using AccountErp.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using System.Linq.Dynamic.Core;
using AccountErp.Infrastructure.Repositories;
using AccountErp.Dtos.BankAccount;
using AccountErp.Dtos.Transaction;

namespace AccountErp.DataLayer.Repositories
{
    public class ChartOfAccountRepository : IChartOfAccountRepository
    {
        private readonly DataContext _dataContext;

        public ChartOfAccountRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task AddAsync(COA_Account entity)
        {
            await _dataContext.COA_Account.AddAsync(entity);
        }

        public void Edit(COA_Account entity)
        {
            _dataContext.COA_Account.Update(entity);
        }

        public async Task<AccountDeatilDto> GetDetailAsync(int id)
        {
            return await (from c in _dataContext.COA_Account
                          where c.Id == id
                          select new AccountDeatilDto
                          {
                              Id = c.Id,
                              AccountCode = c.AccountCode,
                              AccountName = c.AccountName,
                              Description = c.Description,
                              COA_AccountTypeId = c.COA_AccountTypeId
                          })
                      .AsNoTracking()
                     .SingleOrDefaultAsync();
        }

        public async Task<AccountDeatilDto> GetForEditAsync(int id)
        {
            var account = await (from c in _dataContext.COA_Account
                                 where c.Id == id
                                 select new AccountDeatilDto
                                 {
                                     Id = c.Id,
                                     AccountCode = c.AccountCode,
                                     AccountName = c.AccountName,
                                     Description = c.Description,
                                     COA_AccountTypeId = c.COA_AccountTypeId
                                 })
                         .AsNoTracking()
                         .SingleOrDefaultAsync();

            return account;
        }

        public async Task<List<COADetailDto>> GetCOADetailAsync()
        {
            return await (from i in _dataContext.COA_AccountMaster
                          select new COADetailDto
                          {
                              Id = i.Id,
                              AccountMasterName = i.AccountMasterName,
                              AccountTypes = i.AccountTypes.Select(x => new AccountTypeDetailDto
                              {
                                  Id = x.Id,
                                  AccountTypeName = x.AccountTypeName,
                                  COA_AccountMasterId = x.COA_AccountMasterId,
                                  BankAccount = x.BanKAccount.Select(y => new BankAccountDetailDto
                                  {
                                      Id = y.Id,
                                      AccountName = y.AccountName,
                                      AccountCode = y.AccountCode,
                                      Description = y.Description,
                                      AccountNumber = y.AccountNumber,
                                      COA_AccountTypeId = y.COA_AccountTypeId,
                                      AccountHolderName = y.AccountHolderName
                                  })
                              }),

                          })
                           .AsNoTracking()
                           .ToListAsync();
        }

        public async Task<List<AccountTypeDetailDto>> GetDetailByMarterIdAsync(int id)
        {
            return await (from i in _dataContext.COA_AccountType
                          where i.COA_AccountMasterId == id
                          select new AccountTypeDetailDto
                          {
                              Id = i.Id,
                              AccountTypeName = i.AccountTypeName,
                              COA_AccountMasterId = i.COA_AccountMasterId,
                              BankAccount = i.BanKAccount.Select(y => new BankAccountDetailDto
                              {
                                  Id = y.Id,
                                  AccountName = y.AccountName,
                                  AccountCode = y.AccountCode,
                                  Description = y.Description,
                                  AccountNumber = y.AccountNumber,
                                  COA_AccountTypeId = y.COA_AccountTypeId,
                                  AccountHolderName = y.AccountHolderName
                              })
                          })
                           .AsNoTracking()
                           .ToListAsync();
        }

        public async Task<COA_Account> GetAsync(int id)
        {
            return await _dataContext.COA_Account.SingleAsync(x => x.Id == id);

        }

        public async Task<List<AccountDeatilDto>> getAccountByTypeId(int id)
        {
            var account = await (from c in _dataContext.BankAccounts
                                 where c.COA_AccountTypeId == id
                                 select new AccountDeatilDto
                                 {
                                     Id = c.Id,
                                     AccountCode = c.AccountCode,
                                     AccountName = c.AccountName,
                                     Description = c.Description,
                                     COA_AccountTypeId = c.COA_AccountTypeId
                                 })
                       .AsNoTracking()
                       .ToListAsync();

            return account;
        }
    }
}
