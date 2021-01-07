using AccountErp.Dtos;
using AccountErp.Entities;
using AccountErp.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;

namespace AccountErp.DataLayer.Repositories
{
    public class AddressRepository:IAddressRepository
    {
        private readonly DataContext _dataContext;
        public AddressRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<int> AddAsync(Address entity)
        {
            await _dataContext.Addresses.AddAsync(entity);
            await _dataContext.SaveChangesAsync();
            return entity.Id;
        }
        public async Task<Address> GetAsync(int id)
        {
            return await _dataContext.Addresses.FindAsync(id);
        }

        public void Edit(Address entity)
        {
            _dataContext.Addresses.Update(entity);
        }

        public async Task<IEnumerable<SelectListItemDto>> GetSelectItemsAsync()
        {
            return await _dataContext.Countries
                .AsNoTracking()
                .OrderBy(x => x.Name)
                .Select(x => new SelectListItemDto
                {
                    KeyInt = x.Id,
                    Value = x.Name
                }).ToListAsync();
        }

    }
}
