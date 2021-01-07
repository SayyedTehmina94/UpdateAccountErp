using AccountErp.Dtos.Customer;
using AccountErp.Utilities;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Quotation
{
    public class QuotationDetailDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public decimal? Tax { get; set; }
        public string QuotationNumber { get; set; }
        public decimal? Discount { get; set; }
        public decimal TotalAmount { get; set; }
        public string Remark { get; set; }
        public Constants.InvoiceStatus Status { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime QuotationDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public decimal? PoSoNumber { get; set; }
        public string StrQuotationDate { get; set; }
        public string StrExpiryDate { get; set; }
        public string Memo { get; set; }
        public decimal? SubTotal { get; set; }
        public CustomerDetailDto Customer { get; set; }

        public IEnumerable<QuotationServiceDto> Items { get; set; }
        public IEnumerable<QuotationAttachmentDto> Attachments { get; set; }
    }
}