using AccountErp.Dtos.Invoice;
using AccountErp.Entities;
using AccountErp.Models.Invoice;
using AccountErp.Utilities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Repositories
{
    public interface IInvoiceRepository
    {
        Task AddAsync(Invoice entity);

        void Edit(Invoice entity);

        Task<Invoice> GetAsync(int id);

        Task<InvoiceDetailDto> GetDetailAsync(int id);

        Task<InvoiceDetailForEditDto> GetForEditAsync(int id);

        Task<JqDataTableResponse<InvoiceListItemDto>> GetPagedResultAsync(InvoiceJqDataTableRequestModel model);

        Task<JqDataTableResponse<InvoiceListItemDto>> GetTopFiveInvoicesAsync(InvoiceJqDataTableRequestModel model);

        

        Task<List<InvoiceListItemDto>> GetRecentAsync();

        Task<InvoiceSummaryDto> GetSummaryAsunc(int id);

        Task UpdateStatusAsync(int id, Constants.InvoiceStatus status);

        Task DeleteAsync(int id);

        Task<int> getCount();
        Task<List<InvoiceListItemDto>> GetAllUnpaidInvoiceAsync();
        Task<List<InvoiceListTopTenDto>> GetTopTenInvoicesAsync();
    }
}
