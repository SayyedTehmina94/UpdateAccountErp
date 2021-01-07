using System;
using System.Collections.Generic;
using AccountErp.Utilities;

namespace AccountErp.Entities
{
    public class SalesTax
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public decimal TaxPercentage { get; set; }
        public Constants.RecordStatus Status { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public int? BankAccountId { get; set; }
        public string UpdatedBy { get; set; }
    }
}
