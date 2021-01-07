using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Report
{
    public class CashFlowDetailsReportDto
    {
        public List<CashFlowSummaryReportDto> Sales { get; set; }
        public List<CashFlowSummaryReportDto> Purchase { get; set; }
        public List<CashFlowSummaryReportDto> SalesTax { get; set; }
    }
}
