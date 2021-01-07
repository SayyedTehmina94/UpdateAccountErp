using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Report
{
    public class VendorDetailsReportDto
    {
        public Decimal TotalPurchaseAmount { get; set; }
        public Decimal TotalPaidAmount { get; set; }
        public List<VendorReportsDto> vendorReportsList { get; set; }
    }
}
