using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Models.Report
{
    public class SalesReportModel
    {
        public int SalesId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int ReportType { get; set; }
    }
}
