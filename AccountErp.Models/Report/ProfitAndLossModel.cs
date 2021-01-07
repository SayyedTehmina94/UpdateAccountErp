using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Models.Report
{
    public class ProfitAndLossModel
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int ReportType { get; set; }
        public int TabId { get; set; }

    }
}
