using AccountErp.Dtos.Transaction;
using AccountErp.Entities;
using AccountErp.Models.Transaction;
using AccountErp.Utilities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Repositories
{
    public interface ITransactionRepository
    {
        Task AddAsync(Transaction entity);
        Task SetTransactionAccountIdForInvoice(int invoiceId, int? AccId, DateTime date, string desc);
        Task SetTransactionAccountIdForBill(int billId, int? AccId, DateTime date, string desc);
        Task DeleteTransaction(int id);

        Task<JqDataTableResponse<TransactionListItemDto>> GetPagedResultAsync(TransactionJqDataTableRequestModel model);
    }
}
