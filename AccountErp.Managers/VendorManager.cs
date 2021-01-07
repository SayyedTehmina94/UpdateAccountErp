using AccountErp.Dtos;
using AccountErp.Dtos.Vendor;
using AccountErp.Factories;
using AccountErp.Infrastructure.DataLayer;
using AccountErp.Infrastructure.Managers;
using AccountErp.Infrastructure.Repositories;
using AccountErp.Models.Vendor;
using AccountErp.Utilities;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AccountErp.Managers
{
    public class VendorManager : IVendorManager
    {
        private readonly IVendorRepository _vendorRepository;
        private readonly IUnitOfWork _unitOfWork;

        private readonly string _userId;

        public VendorManager(IHttpContextAccessor contextAccessor,
            IVendorRepository vendorRepository,
            IUnitOfWork unitOfWork)
        {
            _userId = contextAccessor.HttpContext.User.GetUserId();
            _vendorRepository = vendorRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<int> AddAsync(VendorAddModel model)
        {
            var vendor = VendorFactory.Create(model, _userId);

            await _vendorRepository.AddAsync(vendor);

            await _unitOfWork.SaveChangesAsync();

            return vendor.Id;
        }

        public async Task EditAsync(VendorEditModel model)
        {
            var vendor = await _vendorRepository.GetAsync(model.Id);

            VendorFactory.Create(model, vendor, _userId);

            _vendorRepository.Edit(vendor);

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task<VendorDetailDto> GetDetailAsync(int id)
        {
            return await _vendorRepository.GetDetailAsync(id);
        }

        public async Task<VendorDetailDto> GetForEditAsync(int id)
        {
            return await _vendorRepository.GetForEditAsync(id);
        }

        public async Task<VendorPersonallnfoDto> GetPersonalInfoAsync(int id)
        {
            return await _vendorRepository.GetPersonalInfoAsync(id);
        }

        public async Task<VendorPaymentInfoDto> GetPaymentInfoAsync(int id)
        {
            return await _vendorRepository.GetPaymentInfoAsync(id);
        }

        public async Task<JqDataTableResponse<VendorListItemDto>> GetPagedResultAsync(VendorJqDataTableRequestModel model)
        {
            return await _vendorRepository.GetPagedResultAsync(model);
        }

        public async Task<bool> IsEmailExistsAsync(string email)
        {
            return await _vendorRepository.IsEmailExistsAsync(email);
        }

        public async Task<bool> IsEmailExistsAsync(int id, string email)
        {
            return await _vendorRepository.IsEmailExistsAsync(id, email);
        }

        public async Task<bool> IsAccountNumberExistsAsync(string accountNumber)
        {
            return await _vendorRepository.IsAccountNumberExistsAsync(accountNumber);
        }
        public async Task<bool> IsAccountNumberExistsForEditAsync(int id, string accountNumber)
        {
            return await _vendorRepository.IsAccountNumberExistsForEditAsync(id, accountNumber);
        }

        public async Task<IEnumerable<SelectListItemDto>> GetSelectItemsAsync()
        {
            return await _vendorRepository.GetSelectItemsAsync();
        }

        public async Task ToggleStatusAsync(int id)
        {
            await _vendorRepository.ToggleStatusAsync(id);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            await _vendorRepository.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
