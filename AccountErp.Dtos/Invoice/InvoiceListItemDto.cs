using AccountErp.Utilities;
using System;

namespace AccountErp.Dtos.Invoice
{
    public class InvoiceListItemDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string InvoiceNumber { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public decimal? Discount { get; set; }
        public decimal? Tax { get; set; }
        public DateTime InvoiceDate { get; set; }
        public DateTime DueDate { get; set; }
        public decimal? PoSoNumber { get; set; }
        public string StrInvoiceDate { get; set; }
        public string StrDueDate { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime CreatedOn { get; set; }
        public Constants.InvoiceStatus Status { get; set; }
    }
}
