using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Models.Report
{
    public class BalanceSheetModel
    {
        public DateTime AsOfDate { get; set; }
        public int ReportType { get; set; }
        public int Tab { get; set; }
    }
}
