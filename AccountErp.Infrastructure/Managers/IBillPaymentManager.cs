using AccountErp.Dtos.Bill;
using AccountErp.Models.Bill;
using AccountErp.Models.Expense;
using AccountErp.Utilities;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Managers
{
    public interface IBillPaymentManager
    {
        Task AddAsync(BillPaymentAddModel model);

        Task<JqDataTableResponse<BillPaymentListItemDto>> GetPagedResultAsync(ExpensePaymentJqDataTableRequestModel model);
    }
}
