using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Report
{
    public class CashFlowReportDto
    {
        public List<CashFlowSummaryReportDto> OperatingActivities { get; set; }
        public List<CashFlowSummaryReportDto> Overview { get; set; }
    }
}
