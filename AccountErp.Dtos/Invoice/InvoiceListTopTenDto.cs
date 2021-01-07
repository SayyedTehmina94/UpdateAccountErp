using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Invoice
{
    public class InvoiceListTopTenDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string InvoiceNumber { get; set; }
        public decimal Amount { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime InvoiceDate { get; set; }


    }
}
