using AccountErp.Dtos.Bill;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Report
{
    public class VendorReportsDto
    { 
        public int VendorId;
        public string VendorName;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public Decimal TotalPaidAmount { get; set; }
        public Decimal TotalAmount { get; set; }
        public string Status { get; set; }
    }
}


