using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Report
{
    public class ProfitAndLossDetailsDto
    {
        public List<ProfitAndLossDetailsReportDto> IncomeAccount { get; set; }
        public List<ProfitAndLossDetailsReportDto> ExpenseAccount { get; set; }
        public decimal Netprofit { get; set; }
    }
}
