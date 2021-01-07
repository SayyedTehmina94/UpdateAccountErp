using AccountErp.Dtos;
using AccountErp.Dtos.Item;
using AccountErp.Models.Item;
using AccountErp.Utilities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Managers
{
    public interface IItemManager
    {
        Task AddAsync(ItemAddModel model);

        Task EditAsync(ItemEditModel model);

        Task<ItemDetailDto> GetDetailAsync(int id);

        Task<ItemDetailForEditDto> GetForEditAsync(int id);

        Task<JqDataTableResponse<ItemListItemDto>> GetPagedResultAsync(ItemJqDataTableRequestModel model);

        Task<IEnumerable<ItemDetailDto>> GetAllAsync(Constants.RecordStatus? status = null);

        Task<IEnumerable<ItemDetailDto>> GetAllForSalesAsync(Constants.RecordStatus? status = null);


        Task<IEnumerable<ItemDetailDto>> GetAllForExpenseAsync(Constants.RecordStatus? status = null);


   

        Task<IEnumerable<SelectListItemDto>> GetSelectItemsAsync();

        Task ToggleStatusAsync(int id);

        Task DeleteAsync(int id);

        bool checkItemAvailable(int id);
    }
}
