using AccountErp.Dtos.Bill;
using AccountErp.Entities;
using AccountErp.Models.Expense;
using AccountErp.Utilities;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Repositories
{
    public interface IBillPaymentRepository
    {
        Task AddAsync(BillPayment model);

        Task<JqDataTableResponse<BillPaymentListItemDto>> GetPagedResultAsync(ExpensePaymentJqDataTableRequestModel model);
    }
}
