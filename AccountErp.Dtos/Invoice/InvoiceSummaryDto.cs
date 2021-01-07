using AccountErp.Utilities;
using System;

namespace AccountErp.Dtos.Invoice
{
    public class InvoiceSummaryDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public decimal Amount { get; set; }
        public decimal? Discount { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal? Tax { get; set; }
        public string InvoiceNumber { get; set; }
        public DateTime InvoiceDate { get; set; }
        public DateTime DueDate { get; set; }
        public decimal? PoSoNumber { get; set; }
        public string StrInvoiceDate { get; set; }
        public string StrDueDate { get; set; }
        public string Description { get; set; }
        public decimal? SubTotal { get; set; }
        public Constants.InvoiceStatus Status { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
