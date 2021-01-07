using AccountErp.Dtos.Customer;
using AccountErp.Utilities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace AccountErp.Dtos.RecurringInvoice
{
    public class RecInvoiceDetailDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public decimal? Tax { get; set; }
        public decimal? Discount { get; set; }
        public decimal TotalAmount { get; set; }
        public string Remark { get; set; }
        public Constants.InvoiceStatus Status { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime RecInvoiceDate { get; set; }
        public DateTime RecDueDate { get; set; }
        public decimal? PoSoNumber { get; set; }
        public string RecInvoiceNumber { get; set; }
        public string StrRecInvoiceDate { get; set; }
        public string StrRecDueDate { get; set; }
        public decimal? SubTotal { get; set; }
        public CustomerDetailDto Customer { get; set; }

        public IEnumerable<RecInvoiceServiceDto> Items { get; set; }
        public IEnumerable<RecInvoiceAttachmentDto> Attachments { get; set; }
    }
}
