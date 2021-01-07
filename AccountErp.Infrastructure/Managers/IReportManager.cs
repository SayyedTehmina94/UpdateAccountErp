using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using AccountErp.Dtos.Report;
using AccountErp.Models.Report;

namespace AccountErp.Infrastructure.Managers
{
    public interface IReportManager
    {
        Task<VendorDetailsReportDto> GetVendorReportAsync(VendorReportModel model);
        Task<CustomerDetailsReportDto> GetCustomerReportAsync(CustomerReportModel model);
        Task<SalesTaxDetailsReportDto> GetSalesTaxReportAsync(SalesReportModel model);
        Task<AgedPayablesDetailsReportDto> GetAgedPayablesReportAsync(AgedPayablesModel model);
        Task<AgedPayablesDetailsReportDto> GetAgedReceivablesReportAsync(AgedReceivablesModel model);
        Task<List<TrialBalanceReportDto>> GetTrialBalance(TrialBalanaceReportModel model);
        Task<AccountTotalBalanceDto> GetAccountBalanceReportAsync(AccountBalanceModel model);
        Task<ProfitAndLossMainDto> GetProfitAndLossDetailsReportAsync(ProfitAndLossModel model);
        Task<BalanceSheetMainReportDto> GetBalanceSheetReportAsync(BalanceSheetModel model);
        Task<AccountTransactionReportMasterDto> GetAccountTransaction(AccountTransactionReportModel model);
        Task<CashFlowReportDto> GetCashFlowReportForSummaryAsync(CashFlowModel model);
        Task<CashFlowMasterDetailDto> GetCashFlowReportForDetailAsync(CashFlowModel model);
        //Task<CashFlowReportDto> GetCashFlowReportAsync(CashFlowModel model);

    }
}
