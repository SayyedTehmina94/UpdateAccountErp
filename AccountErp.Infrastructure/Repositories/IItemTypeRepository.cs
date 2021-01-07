using AccountErp.Dtos;
using AccountErp.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Repositories
{
    public interface IItemTypeRepository
    {
        Task<bool> HasItemsAsync();

        Task AddAsync(ItemType entity);

        Task<IEnumerable<SelectListItemDto>> GetSelectItemsAsync();
    }
}
