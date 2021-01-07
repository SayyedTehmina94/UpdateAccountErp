using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using System.Linq.Dynamic.Core;
using AccountErp.Utilities;
using Microsoft.EntityFrameworkCore;
using AccountErp.Infrastructure.Repositories;

namespace AccountErp.DataLayer.Repositories
{
    public class RecuringJobRepository : IRecurringJobRepository
    {
        private readonly DataContext _dataContext;

        public RecuringJobRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task SetOverdueStatus()
        {
            DateTime startDateTime = DateTime.Today;
            var linqstmt = await (from i in _dataContext.Invoices
                                  where i.Status == Constants.InvoiceStatus.Pending && i.DueDate <= startDateTime
                                  select i
                            ).AsNoTracking()
                            .ToListAsync();

            foreach (var item in linqstmt)
            {
                item.Status = Constants.InvoiceStatus.Overdue;
                _dataContext.Invoices.Update(item);
            }
            //  _dataContext.Invoices.Update(linqstmt);

            //  return await linqstmt.ToListAsync();


        }

        public async Task SetOverdueStatusBill()
        {
            DateTime startDateTime = DateTime.Today;
            var linqstmt = await (from b in _dataContext.Bills
                                  where b.Status == Constants.BillStatus.Pending && b.DueDate <= startDateTime
                                  select b
                            ).AsNoTracking()
                            .ToListAsync();

            foreach (var item in linqstmt)
            {
                item.Status = Constants.BillStatus.Overdue;
                _dataContext.Bills.Update(item);
            }
          
        }
    }
}