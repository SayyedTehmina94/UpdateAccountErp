using AccountErp.Dtos.Invoice;
using AccountErp.Entities;
using AccountErp.Models.Invoice;
using AccountErp.Utilities;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Repositories
{
    public interface IInvoicePaymentRepository
    {
        Task AddAsync(InvoicePayment entity);

        Task<JqDataTableResponse<InvoicePaymentListItemDto>> GetPagedResultAsync(InvoiceJqDataTableRequestModel model);
    }
}
