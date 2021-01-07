using AccountErp.Dtos.Customer;
using AccountErp.Utilities;
using System;
using System.Collections.Generic;

namespace AccountErp.Dtos.Invoice
{
    public class InvoiceDetailDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public decimal? Tax { get; set; }
        public string InvoiceNumber { get; set; }
        public decimal? Discount { get; set; }
        public decimal TotalAmount { get; set; }
        public string Remark { get; set; }
        public Constants.InvoiceStatus Status { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime InvoiceDate { get; set; }
        public DateTime DueDate { get; set; }
        public decimal? PoSoNumber { get; set; }
        public string StrInvoiceDate { get; set; }
        public string StrDueDate { get; set; }
        public decimal? SubTotal { get; set; }

        public CustomerDetailDto Customer { get; set; }

        public IEnumerable<InvoiceServiceDto> Items { get; set; }
        public IEnumerable<InvoiceAttachmentDto> Attachments { get; set; }
        public InvoiceServiceDto InvoiceServiceDto { get; set; }
    }
}
