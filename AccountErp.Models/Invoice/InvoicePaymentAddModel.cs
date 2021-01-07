using AccountErp.Utilities;
using System;
using System.ComponentModel.DataAnnotations;

namespace AccountErp.Models.Invoice
{
    public class InvoicePaymentAddModel
    {
        [Required]
        public int InvoiceId { get; set; }
        [Required]
        public Constants.PaymentMode PaymentMode { get; set; }
        public int? BankAccountId { get; set; }
        public string DepositFrom { get; set; }
        public string ChequeNumber { get; set; }
        public DateTime PaymentDate { get; set; }
        public string Description { get; set; }
        public int CustomerId { get; set; }
        public Constants.TransactionType PaymentType { get; set; }
        public decimal Amount { get; set; }
        public int? CreditBankAccountId { get; set; }
    }
}
