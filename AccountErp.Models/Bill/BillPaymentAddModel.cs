using AccountErp.Utilities;
using System;
using System.ComponentModel.DataAnnotations;

namespace AccountErp.Models.Bill
{
    public class BillPaymentAddModel
    {
        [Required]
        public int BillId { get; set; }
        [Required]
        public Constants.BillPaymentMode PaymentMode { get; set; }
        public int? BankAccountId { get; set; }
        public int? CreditCardId { get; set; }
        public string DepositTo { get; set; }
        public string ChequeNumber { get; set; }
        public DateTime PaymentDate { get; set; }
        public string Description { get; set; }
        public int VendorId { get; set; }
        public Constants.TransactionType PaymentType { get; set; }
        public decimal Amount { get; set; }
        public int? DebitBankAccountId { get; set; }
    }
}
