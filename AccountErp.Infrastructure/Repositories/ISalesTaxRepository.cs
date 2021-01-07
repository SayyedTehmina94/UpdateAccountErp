using AccountErp.Dtos;
using AccountErp.Dtos.SalesTax;
using AccountErp.Entities;
using AccountErp.Models.SalesTax;
using AccountErp.Utilities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Repositories
{
    public interface ISalesTaxRepository
    {
        Task AddAsync(SalesTax entity);
        void Edit(SalesTax entity);

        Task<SalesTax> GetAsync(int id);

        Task<SalesTaxDetailDto> GetForEditAsync(int id);

        Task<bool> IsCodeExistsAsync(string code);
        Task<bool> IsCodeExistsAsync(string code, int id);

        Task<IEnumerable<SalesTaxDetailDto>> GetSelectListItemsAsync();

        Task<JqDataTableResponse<SalesTaxListItemDto>> GetPagedResultAsync(SalexTaxJqDataTableRequestModel model);

        Task ToggleStatusAsync(int id);

        Task DeleteAsync(int id);
        Task<IEnumerable<SalesTaxDetailDto>> GetActiveOnlyAsync();
    }
}
