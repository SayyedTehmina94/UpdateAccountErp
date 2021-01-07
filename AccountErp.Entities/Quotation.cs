using AccountErp.Utilities;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Entities
{
    public class Quotation
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string QuotationNumber { get; set; }
        public decimal? Tax { get; set; }
        public decimal? Discount { get; set; }
        public decimal TotalAmount { get; set; }
        public string Remark { get; set; }
        public Constants.InvoiceStatus Status { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }

        public Customer Customer { get; set; }

        public string StrQuotationDate { get; set; }
        public DateTime QuotationDate { get; set; }
        public string StrExpireDate { get; set; }
        public DateTime ExpireDate { get; set; }
        public decimal? PoSoNumber { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? LineAmountSubTotal { get; set; }
        public string Memo { get; set; }
        public ICollection<QuotationService> Services { get; set; }
        public ICollection<QuotationAttachment> Attachments { get; set; }
    }
}
