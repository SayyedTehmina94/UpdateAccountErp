using AccountErp.Utilities;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Quotation
{
    public class QuotationListItemDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public decimal? Discount { get; set; }
        public decimal? Tax { get; set; }
        public DateTime QuotationDate { get; set; }
        public string QuotationNumber { get; set; }
        public DateTime ExpiryDate { get; set; }
        public decimal? PoSoNumber { get; set; }
        public string StrQuotationDate { get; set; }
        public string StrExpiryDate { get; set; }
        public string Memo { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime CreatedOn { get; set; }
        public decimal? SubTotal { get; set; }
        public Constants.InvoiceStatus Status { get; set; }
    }
}
