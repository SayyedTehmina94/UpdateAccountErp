using AccountErp.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Repositories
{
    public interface IRoleRepository
    {
        Task<IEnumerable<SelectListItemDto>> GetSelectItemsAsync();
    }
}
