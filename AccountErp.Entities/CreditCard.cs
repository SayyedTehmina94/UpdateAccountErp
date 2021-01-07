using AccountErp.Utilities;
using System;

namespace AccountErp.Entities
{
    public class CreditCard
    {
        public int Id { get; set; }
        public string Number { get; set; }
        public string CardHolderName { get; set; }
        public string BankName { get; set; }
        public Constants.RecordStatus Status { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }
    }
}
