using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using AccountErp.Infrastructure.Managers;
using AccountErp.Dtos.Bill;
using AccountErp.Dtos.Report;
using AccountErp.Dtos.Customer;
using AccountErp.Models.Report;

namespace AccountErp.Api.Controllers.Report
{
    [Route("api/[controller]")]
    [Produces("application/json")]
    //[Authorize]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IReportManager _reportManager;
        public ReportController(IReportManager reportManager)
        {
            _reportManager = reportManager;
        }

        [HttpPost]
        [Route("vendor_report_details")]
        public async Task<VendorDetailsReportDto> GetVendorReportAsync(VendorReportModel model)
        {
            var pagedResult = await _reportManager.GetVendorReportAsync(model);
            return pagedResult;
        }

        [HttpPost]
        [Route("customer_report_details")]
        public async Task<CustomerDetailsReportDto> GetCustomerReportAsync(CustomerReportModel model)
        {
            var pageResult = await _reportManager.GetCustomerReportAsync(model);
            return pageResult;
        }

        [HttpPost]
        [Route("sales_tax_report_details")]
        public async Task<SalesTaxDetailsReportDto> GetSalesTaxReportAsync(SalesReportModel model)
        {
            var pageResult = await _reportManager.GetSalesTaxReportAsync(model);
            return pageResult;
        }

        [HttpPost]
        [Route("aged_payables_report_details")]
        public async Task<AgedPayablesDetailsReportDto> GetAgedPayablesReportAsync(AgedPayablesModel model)
        {
            var pageResult = await _reportManager.GetAgedPayablesReportAsync(model);
            return pageResult;
        }

        [HttpPost]
        [Route("aged_receivables_report_details")]
        public async Task<AgedPayablesDetailsReportDto> GetAgedReceivablesReportAsync(AgedReceivablesModel model)
        {
            var PageResult = await _reportManager.GetAgedReceivablesReportAsync(model);
            return PageResult;
        }

        [HttpPost]
        [Route("Trial_Balance_Report")]
        public async Task<List<TrialBalanceReportDto>> GetTrialBalanceReportAsync(TrialBalanaceReportModel model)
        {
            
            var pageResult = await _reportManager.GetTrialBalance(model);
            return pageResult;
        }

        [HttpPost]
        [Route("account_balances_report")]
        public async Task<AccountTotalBalanceDto> GetAccountBalanceReportAsync(AccountBalanceModel model)
        {
            var pageResult = await _reportManager.GetAccountBalanceReportAsync(model);
            return pageResult;
        }

        [HttpPost]
        [Route("profit_and_loss_details_report")]
        public async Task<ProfitAndLossMainDto> GetProfitAndLossDetailsReportAsync(ProfitAndLossModel model)
        {
            var pageResult = await _reportManager.GetProfitAndLossDetailsReportAsync(model);
            return pageResult;
        }

        [HttpPost]
        [Route("Balance_Sheet_Report")]
        public async Task<BalanceSheetMainReportDto> GetBalanceSheetReportAsync(BalanceSheetModel model)
        {
            var pageResult = await _reportManager.GetBalanceSheetReportAsync(model);
            return pageResult;
        }

        [HttpPost]
        [Route("Account_Transaction")]
        public async Task<AccountTransactionReportMasterDto> GetAccpuuntTransactionReportAsync(AccountTransactionReportModel model)
        {
            var pageResult = await _reportManager.GetAccountTransaction(model);
            return pageResult;
        }

        [HttpPost]
        [Route("cash_fLow_report_Summary")]
        public async Task<CashFlowReportDto> GetCashFlowReportAsync(CashFlowModel model)
        {
            var pageResult = await _reportManager.GetCashFlowReportForSummaryAsync(model);
            return pageResult;
        }
        [HttpPost]
        [Route("cash_fLow_report_Detail")]
        public async Task<CashFlowMasterDetailDto> GetCashFlowDetailReportAsync(CashFlowModel model)
        {
            var pageResult = await _reportManager.GetCashFlowReportForDetailAsync(model);
            return pageResult;
        }

    }
}
