using AccountErp.Dtos.RecurringInvoice;
using AccountErp.Entities;
using AccountErp.Models.RecurringInvoice;
using AccountErp.Utilities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Repositories
{
    public interface IRecurringInvoiceRepository
    {
        Task AddAsync(RecurringInvoice entity);

        void Edit(RecurringInvoice entity);

        Task<RecurringInvoice> GetAsync(int id);

        Task<RecInvoiceDetailDto> GetDetailAsync(int id);

        Task<RecInvoiceDetailForEditDto> GetForEditAsync(int id);

        Task<JqDataTableResponse<RecInvoiceListitemDto>> GetPagedResultAsync(RecInvoiceJqDataTableRequestModel model);

        Task<List<RecInvoiceListitemDto>> GetRecentAsync();

        Task<RecInvoiceSummaryDto> GetSummaryAsunc(int id);

        Task UpdateStatusAsync(int id, Constants.InvoiceStatus status);

        Task DeleteAsync(int id);
        Task<int> getCount();
        Task<List<RecListTopTenDto>> GetTopTenRecurringInvoicesAsync();
    }
}
