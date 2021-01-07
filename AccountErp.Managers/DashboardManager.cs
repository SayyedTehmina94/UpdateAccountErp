using AccountErp.Dtos.Dashboard;
using AccountErp.Dtos.Transaction;
using AccountErp.Infrastructure.DataLayer;
using AccountErp.Infrastructure.Managers;
using AccountErp.Infrastructure.Repositories;
using AccountErp.Utilities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccountErp.Managers
{
    public class DashboardManager : IDashboardManager
    {
        private readonly IDashboardRepository _repository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly string _userId;

        public DashboardManager(IHttpContextAccessor contextAccessor,
            IDashboardRepository dashboardRepository,
            IUnitOfWork unitOfWork)
        {
            _userId = contextAccessor.HttpContext.User.GetUserId();
            _repository = dashboardRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<SalesAndExpenseAmountDto> GetSalesAndExpenceAmountAsync()
        {
            SalesAndExpenseAmountDto salesexpenseDataDto = new SalesAndExpenseAmountDto();
            List<TransactionDetailDto> dataForSales = await _repository.GetSalesAmountForDashboard();
            List<TransactionDetailDto> dataForExpense = await _repository.GetExpenseAmountForDashboard();

            salesexpenseDataDto.SalesData = new decimal[12];
            salesexpenseDataDto.ExpenseData = new decimal[12];

            int year = DateTime.Now.Year;
            DateTime firstDay = new DateTime(year, 1, 1);
            DateTime lastDay = DateTime.Now;

            dataForSales = dataForSales.Where(p => (p.TransactionDate >= firstDay && p.TransactionDate <= lastDay)).ToList();
            dataForExpense = dataForExpense.Where(p => (p.TransactionDate >= firstDay && p.TransactionDate <= lastDay)).ToList();

            var salesList = (dataForSales.GroupBy(l => l.TransactionDate.Month, l => new { l.CreditAmount, l.DebitAmount })
      .Select(g => new { GroupId = g.Key, Values = g.ToList() })).ToList();

            var expenseList = (dataForExpense.GroupBy(l => l.TransactionDate.Month, l => new { l.CreditAmount, l.DebitAmount })
      .Select(g => new { GroupId = g.Key, Values = g.ToList() })).ToList();

            for (int i = 0; i < 12; i++)
            {
                foreach (var item in salesList)
                {
                    if (item.GroupId == i)
                    {
                        salesexpenseDataDto.SalesData[i] = item.Values.Sum(x => x.DebitAmount);
                    }
                }

                if (salesexpenseDataDto.SalesData[i] == 0)
                {
                    salesexpenseDataDto.SalesData[i] = 0;
                }

                foreach (var item in expenseList)
                {
                    if (item.GroupId == i)
                    {
                        salesexpenseDataDto.ExpenseData[i] = item.Values.Sum(x => x.CreditAmount);
                    }
                }

                if (salesexpenseDataDto.ExpenseData[i] == 0)
                {
                    salesexpenseDataDto.ExpenseData[i] = 0;
                }

            }
            return salesexpenseDataDto;
        }

    }
}
