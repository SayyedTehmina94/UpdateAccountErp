using AccountErp.Utilities;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Models
{
    public class TransactionsAddModel
    {
        public int? TransactionId { get; set; }
        public int? CompanyId { get; set; }
        public int? BankAccountId { get; set; }
        public int ContactId { get; set; }
        public Constants.TransactionType TransactionTypeId { get; set; }
        public string TransactionNumber { get; set; }
        public string Description { get; set; }
        public DateTime TransactionDate { get; set; }
        public decimal DebitAmount { get; set; }
        public decimal CreditAmount { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ModifyDate { get; set; }
        public Constants.ContactType ContactType { get; set; }
        public Constants.TransactionStatus Status { get; set; }
    }
}
