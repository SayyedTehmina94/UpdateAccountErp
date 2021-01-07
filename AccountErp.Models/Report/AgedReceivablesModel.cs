using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Models.Report
{
    public class AgedReceivablesModel
    {
        public int CustomerId { get; set; }
        public DateTime AsOfDate { get; set; }
        public int ReportType { get; set; }
    }
}
