using AccountErp.Dtos.RecurringInvoice;
using AccountErp.Models.RecurringInvoice;
using AccountErp.Utilities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Managers
{
    public interface IRecurringInvoiceManager
    {
        Task AddAsync(RecInvoiceAddModel model);

        Task EditAsync(RecInvoiceEditModel model);

        Task<RecInvoiceDetailDto> GetDetailAsync(int id);

        Task<RecInvoiceDetailForEditDto> GetForEditAsync(int id);

        Task<JqDataTableResponse<RecInvoiceListitemDto>> GetPagedResultAsync(RecInvoiceJqDataTableRequestModel model);

        Task<List<RecInvoiceListitemDto>> GetRecentAsync();

        Task<RecInvoiceSummaryDto> GetSummaryAsunc(int id);

        Task DeleteAsync(int id);
        Task<int> GetRecInvoiceNumber();
        Task<RecInvoiceCountDto> GetTopTenRecurringInvoicesAsync();
    }
}
