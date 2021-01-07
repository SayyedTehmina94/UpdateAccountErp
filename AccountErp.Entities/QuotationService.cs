using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Entities
{
   public class QuotationService
    {
        public Guid Id { get; set; }
        public int QuotationId { get; set; }
        public int ServiceId { get; set; }
        public decimal Rate { get; set; }
        public decimal Price { get; set; }
        public int? TaxId { get; set; }
        public decimal TaxPrice { get; set; }
        public decimal? TaxPercentage { get; set; }
        public int Quantity { get; set; }
        public decimal LineAmount { get; set; }
        public Item Service { get; set; }
        public SalesTax Taxes { get; set; }
    }
}
