using AccountErp.Utilities;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.RecurringInvoice
{
    public class RecInvoiceSummaryDto
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
        public DateTime RecInvoiceDate { get; set; }
        public DateTime RecDueDate { get; set; }
        public decimal? PoSoNumber { get; set; }
        public string StrRecInvoiceDate { get; set; }
        public string StrRecDueDate { get; set; }
        public string Description { get; set; }
        public string RecInvoiceNumber { get; set; }
        public decimal? SubTotal { get; set; }
        public Constants.InvoiceStatus Status { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
