
using AccountErp.Dtos.Transaction;
using AccountErp.Models.Transaction;
using AccountErp.Utilities;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace AccountErp.Infrastructure.Managers
{
    public interface ITransactionManager
    {
        Task<JqDataTableResponse<TransactionListItemDto>> GetPagedResultAsync(TransactionJqDataTableRequestModel model);

    }
}
