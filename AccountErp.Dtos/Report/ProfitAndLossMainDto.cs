using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Report
{
    public class ProfitAndLossMainDto
    {
        public Decimal GrossProfit { get; set; }
        public Decimal NetProfit { get; set; }
        public Decimal Income { get; set; }
        public Decimal OperatingExpenses { get; set; }
        public List<ProfitAndLossDetailsReportDto> IncomeAccount { get; set; }
        public List<ProfitAndLossDetailsReportDto> ExpenseAccount { get; set; }
    }
}
