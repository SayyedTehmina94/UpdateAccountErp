using AccountErp.Dtos;
using AccountErp.Dtos.BankAccount;
using AccountErp.Entities;
using AccountErp.Infrastructure;
using AccountErp.Utilities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;

namespace AccountErp.DataLayer.Repositories
{
    public class BankAccountRepository : IBankAccountRepository
    {
        private readonly DataContext _dataContext;
        public BankAccountRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        public async Task AddAsync(BankAccount entity)
        {
            await _dataContext.BankAccounts.AddAsync(entity);
        }

        public void Edit(BankAccount entity)
        {
            _dataContext.BankAccounts.Update(entity);
        }

        public async Task<BankAccount> GetAsync(int id)
        {
            return await _dataContext.BankAccounts.FindAsync(id);
        }
        public async Task<IEnumerable<SelectListItemDto>> GetDetailByLedgerTypeAsync(int typeId)
        {
            return await (from ba in _dataContext.BankAccounts
                          where ba.LedgerType == typeId
                          select new SelectListItemDto
                          {
                              KeyInt = ba.Id,
                              Value = ba.AccountName
                          })
                         .AsNoTracking()
                         .ToListAsync();
        }
        public async Task<BankAccountDetailDto> GetDetailAsync(int id)
        {
            return await (from ba in _dataContext.BankAccounts
                          where ba.Id == id
                          select new BankAccountDetailDto
                          {
                              Id = ba.Id,
                              AccountHolderName = ba.AccountHolderName,
                              AccountNumber = ba.AccountNumber,
                              BankName = ba.BankName,
                              BranchName = ba.BranchName,
                              Ifsc = ba.Ifsc,
                              AccountCode = ba.AccountCode,
                              Description = ba.Description,
                              COA_AccountTypeId = ba.COA_AccountTypeId,
                              LedgerType = ba.LedgerType,
                              AccountName = ba.AccountName,
                              AccountId = ba.AccountId
                          })
                         .AsNoTracking()
                         .SingleOrDefaultAsync();
        }

        public async Task<BankAccountDetailDto> GetForEditAsync(int id)
        {
            return await (from ba in _dataContext.BankAccounts
                          where ba.Id == id
                          select new BankAccountDetailDto
                          {
                              Id = ba.Id,
                              AccountHolderName = ba.AccountHolderName,
                              AccountNumber = ba.AccountNumber,
                              BankName = ba.BankName,
                              BranchName = ba.BranchName,
                              Ifsc = ba.Ifsc,
                              AccountCode = ba.AccountCode,
                              Description = ba.Description,
                              COA_AccountTypeId = ba.COA_AccountTypeId,
                              LedgerType = ba.LedgerType,
                              AccountName = ba.AccountName,
                              AccountId = ba.AccountId
                          })
                         .AsNoTracking()
                         .SingleOrDefaultAsync();
        }

        public async Task<JqDataTableResponse<BankAccountListItemDto>> GetPagedResultAsync(JqDataTableRequest model)
        {
            if (model.Length == 0)
            {
                model.Length = Constants.DefaultPageSize;
            }

            var filterKey = model.Search.Value;

            var linqStmt = (from ba in _dataContext.BankAccounts
                            where ba.Status != Constants.RecordStatus.Deleted && (filterKey == null || EF.Functions.Like(ba.AccountHolderName, "%" + filterKey + "%") ||
                            EF.Functions.Like(ba.AccountNumber, "%" + filterKey + "%") ||
                            EF.Functions.Like(ba.BranchName, "%" + filterKey + "%"))
                            select new BankAccountListItemDto
                            {
                                Id = ba.Id,
                                AccountHolderName = ba.AccountHolderName,
                                AccountNumber = ba.AccountNumber,
                                BankName = ba.BankName,
                                BranchName = ba.BranchName,
                                Ifsc = ba.Ifsc,
                                Status = ba.Status,
                                LedgerType = ba.LedgerType,
                                AccountName = ba.AccountName,
                                AccountId = ba.AccountId,
                                AccountCode = ba.AccountCode,
                                COA_AccountTypeId = ba.COA_AccountTypeId
                            })
                            .AsNoTracking();

            var sortExpression = model.GetSortExpression();

            var pagedResult = new JqDataTableResponse<BankAccountListItemDto>
            {
                RecordsTotal = await _dataContext.BankAccounts.CountAsync(x => x.Status != Constants.RecordStatus.Deleted),
                RecordsFiltered = await linqStmt.CountAsync(),
                Data = await linqStmt.OrderBy(sortExpression).Skip(model.Start)
                .Take(model.Length)
                .ToListAsync()
            };
            return pagedResult;
        }

        public async Task<bool> IsAccountNumberExistsAsync(string accountNumber)
        {
            return await _dataContext.BankAccounts.AnyAsync(x => x.AccountNumber == accountNumber && x.Status != Constants.RecordStatus.Deleted);
        }

        public async Task<bool> IsAccountNumberExistsForEditAsync(int id, string accountNumber)
        {
            return await _dataContext.BankAccounts.AnyAsync(x => x.AccountNumber == accountNumber && x.Id != id && x.Status != Constants.RecordStatus.Deleted);
        }

        public async Task<SelectListItemDto> getAccountTypeByCode()
        {
            //var data =  await _dataContext.COA_AccountType.FirstOrDefaultAsync(x => x.AccountTypeCode == "SalesTax");
            //return data;
            return await (from ba in _dataContext.COA_AccountType
                          where ba.AccountTypeCode == "SalesTaxes"
                          select new SelectListItemDto
                          {
                              KeyInt = ba.Id,
                              Value = ba.AccountTypeCode
                          })
                       .AsNoTracking()
                       .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<SelectListItemDto>> GetSelectItemsAsync()
        {
            return await _dataContext.BankAccounts
                .AsNoTracking()
                .Where(x => x.Status == Constants.RecordStatus.Active)
                .OrderBy(x => x.AccountHolderName)
                .Select(x => new SelectListItemDto
                {
                    KeyInt = x.Id,
                    Value = x.AccountName
                }).ToListAsync();
        }

        public async Task ToggleStatusAsync(int id)
        {
            var bankAccount = await _dataContext.BankAccounts.FindAsync(id);

            if (bankAccount.Status == Constants.RecordStatus.Active)
            {
                bankAccount.Status = Constants.RecordStatus.Inactive;
            }
            else if (bankAccount.Status == Constants.RecordStatus.Inactive)
            {
                bankAccount.Status = Constants.RecordStatus.Active;
            }

            _dataContext.BankAccounts.Update(bankAccount);
        }

        public async Task DeleteAsync(int id)
        {
            var bankAccount = await _dataContext.BankAccounts.FindAsync(id);
            bankAccount.Status = Constants.RecordStatus.Deleted;
            _dataContext.BankAccounts.Update(bankAccount);
        }
    }
}
