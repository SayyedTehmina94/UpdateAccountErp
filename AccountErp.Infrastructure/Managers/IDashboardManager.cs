using AccountErp.Dtos.Dashboard;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Managers
{
    public interface IDashboardManager
    {
        Task<SalesAndExpenseAmountDto> GetSalesAndExpenceAmountAsync();
    }
}
