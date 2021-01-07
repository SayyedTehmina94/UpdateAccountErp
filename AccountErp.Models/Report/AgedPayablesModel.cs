using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Report
{
    public class AgedPayablesModel
    {
        public int VendorId { get; set; }
        public DateTime AsOfDate { get; set; }
        public int ReportType { get; set; }
    }
}
