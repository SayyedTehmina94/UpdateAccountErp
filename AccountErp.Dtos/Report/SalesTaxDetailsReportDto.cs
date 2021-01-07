using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Report
{
    public class SalesTaxDetailsReportDto
    {
        public Decimal? TotalTaxAmountOnSales { get; set; }
        public Decimal? TotalTaxAmountOnPurchase { get; set; }
        public Decimal? TotalNetTaxOwing { get; set; }
        public Decimal? TotalStartingBalance { get; set; }
        public Decimal? TotalLessPaymentsToGovernment { get; set; }
        public Decimal? TotalEndingBalance { get; set; }
        public List<SalesTaxReportDto> SalesTaxReportDtosList { get; set; }
    }
}
