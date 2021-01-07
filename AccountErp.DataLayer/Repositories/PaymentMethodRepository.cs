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
    public class PaymentMethodRepository : IPaymentMethodRepository
    {
        private readonly DataContext _dataContext;

        public PaymentMethodRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task AddAsync(PaymentMethod entity)
        {
            await _dataContext.PaymentMethods.AddAsync(entity);
        }

        public async Task<bool> IsExistsAsync(string name)
        {
            return await _dataContext.PaymentMethods.AnyAsync(
                x => x.Name.Equals(name) && x.Status != Constants.RecordStatus.Deleted);
        }

        public async Task<bool> HasItemsAsync()
        {
            return await _dataContext.PaymentMethods.AnyAsync();
        }

        public async Task<IEnumerable<SelectListItemDto>> GetSelectListItemsAsync()
        {
            return await _dataContext.PaymentMethods
                .Where(x => x.Status != Constants.RecordStatus.Deleted)
                .Select(x => new SelectListItemDto
                {
                    KeyInt = x.Id,
                    Value = x.Name
                })
                .ToListAsync();
        }
    }
}
