using AccountErp.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Managers
{
    public interface IRoleManager
    {
        Task<IEnumerable<SelectListItemDto>> GetSelectItemsAsync();
    }
}
