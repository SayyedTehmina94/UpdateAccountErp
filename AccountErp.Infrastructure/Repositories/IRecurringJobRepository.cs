using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Repositories
{
   public interface IRecurringJobRepository
    {
        Task SetOverdueStatus();
        Task SetOverdueStatusBill(); 
    }
}
