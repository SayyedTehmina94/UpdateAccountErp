using AccountErp.Utilities;
using System;

namespace AccountErp.Entities
{
    public class BillPayment
    {
        public int Id { get; set; }
        public int BillId { get; set; }
        public Constants.BillPaymentMode PaymentMode { get; set; }
        public DateTime? PaymentDate { get; set; }
        public int? BankAccountId { get; set; }
        public int? CreditCardId { get; set; }
        public string DepositTo { get; set; }
        public string ChequeNumber { get; set; }
        public decimal Amount { get; set; }
        
        public string Description { get; set; }
        public Constants.RecordStatus Status { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }

        public Bill Bill { get; set; }
        public BankAccount BankAccount { get; set; }
    }
}
