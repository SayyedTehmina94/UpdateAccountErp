using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Models.Report
{
    public class VendorReportModel
    {
        public int VendorId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
