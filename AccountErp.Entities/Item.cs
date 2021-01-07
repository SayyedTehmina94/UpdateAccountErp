using AccountErp.Utilities;
using System;

namespace AccountErp.Entities
{
    public class Item
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Rate { get; set; }
        public string Description { get; set; }
        public bool IsTaxable { get; set; }
        public int? SalesTaxId { get; set; }
        public Constants.RecordStatus Status { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }

        public bool? isForSell { get; set; }
        public int? BankAccountId { get; set; }

        public SalesTax SalesTax { get; set; }
    }
}
