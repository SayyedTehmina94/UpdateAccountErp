using AccountErp.Utilities;
using System;

namespace AccountErp.Entities
{
    public class InvoicePayment
    {
        public int Id { get; set; }
        public int InvoiceId { get; set; }
        public Constants.PaymentMode PaymentMode { get; set; }
        public DateTime? PaymentDate { get; set; }
        public string DepositFrom { get; set; }
        public int? BankAccountId { get; set; }
        public string ChequeNumber { get; set; }
        public decimal Amount { get; set; }

        public string Description { get; set; }
        public Constants.RecordStatus Status { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }

        public Invoice Invoice { get; set; }
        public BankAccount BankAccount { get; set; }
    }
}
