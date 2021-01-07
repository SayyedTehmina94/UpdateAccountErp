using AccountErp.Dtos.Invoice;
using AccountErp.Models.Invoice;
using AccountErp.Utilities;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Managers
{
    public interface IInvoicePaymentManager
    {
        Task AddAsync(InvoicePaymentAddModel model);
        Task<JqDataTableResponse<InvoicePaymentListItemDto>> GetPagedResultAsync(InvoiceJqDataTableRequestModel model);
    }
}
