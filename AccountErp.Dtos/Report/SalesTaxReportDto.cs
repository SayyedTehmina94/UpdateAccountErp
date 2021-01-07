using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Report
{
    public class SalesTaxReportDto
    {
        public int SalesId { get; set; }
        public string Tax { get; set; }
        public Decimal? SalesSubjectToTax { get; set; }
        public Decimal? TaxAmountOnSales { get; set; }
        public Decimal PurchaseSubjectToTax { get; set; }
        public Decimal? TaxAmountOnPurchases { get; set; }
        public Decimal? StartingBalance { get; set; }
        public Decimal? LessPaymentsToGovernment { get; set; }
        public Decimal? EndingBalance { get; set; }
        public Decimal? NetTaxOwing { get; set; }
        public int? BankAccountId { get; set; }
    }
}
