using AccountErp.Dtos.Invoice;
using AccountErp.Models.Invoice;
using AccountErp.Utilities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Managers
{
    public interface IInvoiceManager
    {
        Task AddAsync(InvoiceAddModel model);

        Task EditAsync(InvoiceEditModel model);

        Task<InvoiceDetailDto> GetDetailAsync(int id);

        Task<InvoiceDetailForEditDto> GetForEditAsync(int id);

        Task<JqDataTableResponse<InvoiceListItemDto>> GetPagedResultAsync(InvoiceJqDataTableRequestModel model);


        Task<JqDataTableResponse<InvoiceListItemDto>> GetTopFiveInvoicesAsync(InvoiceJqDataTableRequestModel model);
        

        Task<List<InvoiceListItemDto>> GetRecentAsync();

        Task<InvoiceSummaryDto> GetSummaryAsunc(int id);

        Task DeleteAsync(int id);

        Task<int> GetInvoiceNumber();
        Task<List<InvoiceListItemDto>> GetAllUnpaidInvoiceAsync();
        Task<InvoiceCountDto> GetTopTenInvoicesAsync();
    }
}
