using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Entities
{
    public class RecurringInvoiceService
    {
        public Guid Id { get; set; }
        public int RecInvoiceId { get; set; }
        public int ServiceId { get; set; }
        public decimal Rate { get; set; }
        public decimal Price { get; set; }
        public int? TaxId { get; set; }
        public int? TaxPercentage { get; set; }
        public int Quantity { get; set; }
        public Item Service { get; set; }
        public decimal? TaxPrice { get; set; }
        public decimal LineAmount { get; set; }
        public SalesTax Taxes { get; set; }
    }
}
