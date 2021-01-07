using AccountErp.Dtos;
using AccountErp.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Repositories
{
    public interface IPaymentMethodRepository
    {
        Task AddAsync(PaymentMethod entity);

        Task<bool> IsExistsAsync(string name);

        Task<bool> HasItemsAsync();

        Task<IEnumerable<SelectListItemDto>> GetSelectListItemsAsync();
    }
}
