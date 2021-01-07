using AccountErp.Dtos;
using AccountErp.Dtos.SalesTax;
using AccountErp.Factories;
using AccountErp.Infrastructure;
using AccountErp.Infrastructure.DataLayer;
using AccountErp.Infrastructure.Managers;
using AccountErp.Infrastructure.Repositories;
using AccountErp.Models.SalesTax;
using AccountErp.Models.VendorSalesTax;
using AccountErp.Utilities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AccountErp.Managers
{
    public class SalesTaxManager : ISalesTaxManager
    {
        private readonly ISalesTaxRepository _repository;
        private readonly IBankAccountRepository _bankAccountRepository;
        private readonly IUnitOfWork _unitOfWork;

        private readonly string _userId;

        public SalesTaxManager(IHttpContextAccessor contextAccessor, ISalesTaxRepository repository, IBankAccountRepository bankAccountRepository, IUnitOfWork unitOfWork)
        {
            _userId = contextAccessor.HttpContext.User.GetUserId();
            _repository = repository;
            _bankAccountRepository = bankAccountRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task AddAsync(SalesTaxAddModel model)
        {
            var result = await _bankAccountRepository.getAccountTypeByCode();
            var bankAcc = SalesTaxFactory.AccountCreate(model, _userId, result.KeyInt);
            await _bankAccountRepository.AddAsync(bankAcc);
            await _unitOfWork.SaveChangesAsync();
            await _repository.AddAsync(SalesTaxFactory.Create(model, _userId, bankAcc.Id));

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task EditAsync(SalesTaxEditModel model)
        {
            var salesTax = await _repository.GetAsync(model.Id);
            SalesTaxFactory.Create(model, salesTax, _userId);
            _repository.Edit(salesTax);
            await _unitOfWork.SaveChangesAsync();
        }


        public async Task<SalesTaxDetailDto> GetForEditAsync(int id)
        {
            return await _repository.GetForEditAsync(id);
        }

        public async Task<IEnumerable<SalesTaxDetailDto>> GetSelectListItemsAsync()
        {
            return await _repository.GetSelectListItemsAsync();
        }

        public async Task<JqDataTableResponse<SalesTaxListItemDto>> GetPagedResultAsync(SalexTaxJqDataTableRequestModel model)
        {
            return await _repository.GetPagedResultAsync(model);
        }

        public async Task<bool> IsCodeExistsAsync(string code)
        {
            return await _repository.IsCodeExistsAsync(code);
        }
        public async Task<bool> IsCodeExistsAsync(string code, int id)
        {
            return await _repository.IsCodeExistsAsync(code, id);
        }

        public async Task ToggleStatusAsync(int id)
        {
            await _repository.ToggleStatusAsync(id);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task<IEnumerable<SalesTaxDetailDto>> GetActiveOnlyAsync()
        {
            return await _repository.GetActiveOnlyAsync();
        }
    }

}
