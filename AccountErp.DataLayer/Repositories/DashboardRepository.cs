using AccountErp.Dtos.Transaction;
using AccountErp.Infrastructure.Repositories;
using System;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using Microsoft.EntityFrameworkCore;
using AccountErp.Utilities;

namespace AccountErp.DataLayer.Repositories
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly DataContext _dataContext;

        public DashboardRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<List<TransactionDetailDto>> GetSalesAmountForDashboard()
        {
            return await (from t in _dataContext.Transaction
                          where (t.TransactionTypeId == Constants.TransactionType.InvoicePayment ||
                          t.TransactionTypeId == Constants.TransactionType.CustomerAdvancePayment ||
                          t.TransactionTypeId == Constants.TransactionType.AccountIncome) && t.isForTransEntry == true
                          select new TransactionDetailDto
                          {
                              TransactionId = t.TransactionId,
                              BankAccountId = t.BankAccountId,
                              Id = t.Id,
                              DebitAmount = t.DebitAmount,
                              CreditAmount = t.CreditAmount,
                              TransactionDate = t.TransactionDate,
                              Status = t.Status,
                              ModifyDate = t.ModifyDate ?? DateTime.Now
                          })
                           .AsNoTracking()
                           .ToListAsync();
        }

        public async Task<List<TransactionDetailDto>> GetExpenseAmountForDashboard()
        {
            return await (from t in _dataContext.Transaction
                          where (t.TransactionTypeId == Constants.TransactionType.BillPayment ||
                          t.TransactionTypeId == Constants.TransactionType.VendorAdvancePayment ||
                          t.TransactionTypeId == Constants.TransactionType.AccountExpence) && t.isForTransEntry == true
                          select new TransactionDetailDto
                          {
                              TransactionId = t.TransactionId,
                              BankAccountId = t.BankAccountId,
                              Id = t.Id,
                              DebitAmount = t.DebitAmount,
                              CreditAmount = t.CreditAmount,
                              TransactionDate = t.TransactionDate,
                              Status = t.Status,
                              ModifyDate = t.ModifyDate ?? DateTime.Now
                          })
                           .AsNoTracking()
                           .ToListAsync();
        }
    }
}
