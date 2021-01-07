using AccountErp.Dtos;
using AccountErp.Dtos.Vendor;
using AccountErp.Entities;
using AccountErp.Models.Vendor;
using AccountErp.Utilities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Repositories
{
    public interface IVendorRepository
    {
        Task AddAsync(Vendor model);

        void Edit(Vendor model);

        Task<Vendor> GetAsync(int id);

        Task<bool> IsEmailExistsAsync(int id, string email);

        Task<VendorDetailDto> GetDetailAsync(int id);

        Task<VendorDetailDto> GetForEditAsync(int id);

        Task<VendorPersonallnfoDto> GetPersonalInfoAsync(int id);

        Task<VendorPaymentInfoDto> GetPaymentInfoAsync(int id);

        Task<JqDataTableResponse<VendorListItemDto>> GetPagedResultAsync(VendorJqDataTableRequestModel model);

        Task<bool> IsEmailExistsAsync(string email);

        Task<bool> IsAccountNumberExistsAsync(string accountNumber);

        Task<bool> IsAccountNumberExistsForEditAsync(int id, string accountNumber);

        Task<IEnumerable<SelectListItemDto>> GetSelectItemsAsync();

        Task ToggleStatusAsync(int id);

        Task DeleteAsync(int id);

        Task<int> GetCountAsync();

        Task<int> GetCountAsync(DateTime createdOn);
    }
}
