using AccountErp.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Managers
{
    public interface IMasterDataManager
    {
        Task<IEnumerable<SelectListItemDto>> GetItemTypeSelectItemsAsync();
        Task<IEnumerable<SelectListItemDto>> GetCountrySelectItemsAsync();
    }
}
