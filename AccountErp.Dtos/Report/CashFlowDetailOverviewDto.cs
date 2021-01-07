using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Report
{
    public class CashFlowDetailOverviewDto
    {
        public List<CashFlowSummaryReportDto> StartingBalance { get; set; }
        public List<CashFlowSummaryReportDto> EndingBalance { get; set; }
        public List<CashFlowSummaryReportDto> GrossDetail { get; set; }
    }
}
