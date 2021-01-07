using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Managers
{
    public interface IRecurringJobManager
    {
        Task SetOverdueStatus();
    }
}
