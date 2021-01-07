using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Models.RecurringInvoice
{
    public class RecInvoiceServiceModel
    {
        public int ServiceId { get; set; }
        public decimal Rate { get; set; }
        public decimal Price { get; set; }
        public int? TaxId { get; set; }
        public int? TaxPercentage { get; set; }
        public int Quantity { get; set; }
        public decimal? TaxPrice { get; set; }
        public decimal LineAmount { get; set; }
    }
}
