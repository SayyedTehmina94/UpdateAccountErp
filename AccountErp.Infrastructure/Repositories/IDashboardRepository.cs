using AccountErp.Dtos.Transaction;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Repositories
{
    public interface IDashboardRepository
    {
        Task<List<TransactionDetailDto>> GetSalesAmountForDashboard();
        Task<List<TransactionDetailDto>> GetExpenseAmountForDashboard();
    }
}
