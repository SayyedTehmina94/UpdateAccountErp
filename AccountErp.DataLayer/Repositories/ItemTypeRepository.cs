using AccountErp.Dtos;
using AccountErp.Entities;
using AccountErp.Infrastructure.Repositories;
using AccountErp.Utilities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccountErp.DataLayer.Repositories
{
    public class ItemTypeRepository : IItemTypeRepository
    {
        private readonly DataContext _dataContext;

        public ItemTypeRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<bool> HasItemsAsync()
        {
         return   await _dataContext.ItemTypes.AnyAsync(x => x.Status != Constants.RecordStatus.Deleted);
        }

        public async Task AddAsync(ItemType entity)
        {
            await _dataContext.ItemTypes.AddAsync(entity);
        }

        public async Task<IEnumerable<SelectListItemDto>> GetSelectItemsAsync()
        {
            return await _dataContext.ItemTypes
                .AsNoTracking()
                .Where(x => x.Status != Constants.RecordStatus.Deleted)
                .OrderBy(x => x.Name)
                .Select(x => new SelectListItemDto
                {
                    KeyInt = x.Id,
                    Value = x.Name
                }).ToListAsync();
        }
    }
}
