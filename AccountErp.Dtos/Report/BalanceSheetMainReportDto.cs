
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Report
{
    public class BalanceSheetMainReportDto
    {
        public Decimal CashAndBank { get; set; }
        public Decimal ToBeReceived { get; set; }
        public Decimal ToBePaidOut { get; set; }
        public Decimal TotalAmount { get; set; }
        public List<BalanceSheetReportDto> BalanceSheetReportDtos { get; set; }
    }
}
