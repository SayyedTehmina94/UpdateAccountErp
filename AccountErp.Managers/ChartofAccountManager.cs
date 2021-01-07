using AccountErp.Dtos.BankAccount;
using AccountErp.Dtos.ChartofAccount;
using AccountErp.Factories;
using AccountErp.Infrastructure.DataLayer;
using AccountErp.Infrastructure.Managers;
using AccountErp.Infrastructure.Repositories;
using AccountErp.Models.Account;
using AccountErp.Models.ChartOfAccount;
using AccountErp.Utilities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace AccountErp.Managers
{
    public class ChartofAccountManager : IChartofAccountManager
    {
        private readonly IChartOfAccountRepository _repository;
        private readonly IUnitOfWork _unitOfWork;

        private readonly string _userId;

        public ChartofAccountManager(IHttpContextAccessor contextAccessor,
            IChartOfAccountRepository Repository,
            IUnitOfWork unitOfWork)
        {
            _userId = contextAccessor.HttpContext.User.GetUserId();
            _repository = Repository;
            _unitOfWork = unitOfWork;
        }

        public async Task<int> AddAsync(COA_AccountAddModel model)
        {
            var account = ChartofaccountFactory.Create(model, _userId);
            await _repository.AddAsync(account);
            await _unitOfWork.SaveChangesAsync();
            return account.Id;
        }

        public async Task EditAsync(COA_AccountEditModel model)
        {
            var account = await _repository.GetAsync(model.Id);
            ChartofaccountFactory.Update(model, account, _userId);
            _repository.Edit(account);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task<AccountDeatilDto> GetDetailAsync(int id)
        {
            return await _repository.GetDetailAsync(id);
        }
        public async Task<AccountDeatilDto> GetForEditAsync(int id)
        {
            return await _repository.GetForEditAsync(id);
        }
        public async Task<List<COADetailDto>> GetCOADetailAsync()
        {
            return await _repository.GetCOADetailAsync();
        }

        public async Task<List<AccountTypeDetailDto>> GetDetailByMarterIdAsync(int id)
        {
            return await _repository.GetDetailByMarterIdAsync(id);
        }

        public async Task<List<AccountDeatilDto>> getAccountByTypeId(int id)
        {
            return await _repository.getAccountByTypeId(id);
        }

        public async Task<List<AccountDetailsWithMasterDto>> GetDetailForAccountAsync()
        {
            var data = await _repository.GetCOADetailAsync();
            List<AccountDetailsWithMasterDto> accountDetailDto = new List<AccountDetailsWithMasterDto>();
            foreach (var item in data)
            {
                AccountDetailsWithMasterDto accountMasterDto = new AccountDetailsWithMasterDto();
                accountMasterDto.Id = item.Id;
                accountMasterDto.text = item.AccountMasterName;
                accountMasterDto.children = new List<BankAccountDetailDto>();
                foreach (var accType in item.AccountTypes)
                {
                    foreach (var acc in accType.BankAccount)
                    {
                        accountMasterDto.children.Add(acc);
                    }
                }
                accountDetailDto.Add(accountMasterDto);
            }
            return accountDetailDto;
        }
        public async Task<List<AccountWithMasterDetailsDto>> GetCOAAccountDetailsaAsync()
        {
            var data = await _repository.GetCOADetailAsync();
            List<AccountWithMasterDetailsDto> accountDetailDto = new List<AccountWithMasterDetailsDto>();
            foreach (var item in data)
            {
                AccountWithMasterDetailsDto accountMasterDto = new AccountWithMasterDetailsDto();
                accountMasterDto.Id = item.Id.ToString();
                accountMasterDto.text = item.AccountMasterName;
                accountMasterDto.children = new List<BankAccountDto>();
                foreach (var accType in item.AccountTypes)
                {
                    foreach (var acc in accType.BankAccount)
                    {
                        BankAccountDto bankAccountDto = new BankAccountDto();
                        bankAccountDto.Id = acc.Id.ToString();
                        bankAccountDto.text = acc.AccountName.ToString();
                        accountMasterDto.children.Add(bankAccountDto);
                    }
                }
                accountDetailDto.Add(accountMasterDto);
            }
            return accountDetailDto;
        }
    }
}
