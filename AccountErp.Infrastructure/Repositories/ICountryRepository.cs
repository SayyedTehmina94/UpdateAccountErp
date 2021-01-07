using AccountErp.Dtos;
using AccountErp.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Repositories
{
    public interface ICountryRepository
    {
        Task<bool> HasItemsAsync();

        Task AddAsync(Country entity);

        Task<IEnumerable<SelectListItemDto>> GetSelectItemsAsync();
    }
}
