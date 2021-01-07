using AccountErp.Dtos.BankAccount;
using AccountErp.Dtos.Bill;
using AccountErp.Dtos.ChartofAccount;
using AccountErp.Dtos.Customer;
using AccountErp.Dtos.Report;
using AccountErp.Dtos.Transaction;
using AccountErp.Models.Report;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Repositories
{
    public interface IReportRepository
    {
        Task<List<VendorReportsDto>> GetVendorReportAsync(VendorReportModel model);

        Task<List<CustomerReportsDto>> GetCustomerReportAsync(CustomerReportModel model);

        Task<List<SalesTaxReportDto>> GetSalesTaxReportAsync(SalesReportModel model);

        Task<List<AgedPayablesReportDto>> GetAgedPayablesReportAsync(AgedPayablesModel model);
        Task<List<AgedReceivablesReportDto>> GetAgedReceivablesReportAsync(AgedReceivablesModel model);
        Task<List<COADetailDto>> GetCOADetailAsyncForTrialReport();
        Task<List<COADetailDto>> GetAccountBalanceReportAsync();
        Task<List<COADetailDto>> GetProfitAndLossDetailsReportAsync();
        Task<List<COADetailDto>> GetBalanceSheetReportAsync();
        Task<List<COADetailDto>> GetCOADetailAsyncForAccountTransactionReport();
        Task<List<COADetailDto>> GetCashFlowReportAsync();
        Task<List<TransactionDetailDto>> GetProfitAndLossDetailsForAmount();

    }
}
