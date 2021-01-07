using AccountErp.Utilities;
using System;
using System.Collections.Generic;

namespace AccountErp.Entities
{
    public class Invoice
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string InvoiceNumber { get; set; }
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

        public string StrInvoiceDate { get; set; }
        public DateTime InvoiceDate { get; set; }
        public string StrDueDate { get; set; }
        public DateTime DueDate { get; set; }
        public decimal? PoSoNumber { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? LineAmountSubTotal { get; set; }
        public ICollection<InvoiceService> Services { get; set; }
        public ICollection<InvoiceAttachment> Attachments { get; set; }
    }
}
