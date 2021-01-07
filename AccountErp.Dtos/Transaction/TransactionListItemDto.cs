using AccountErp.Utilities;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Transaction
{
    public class TransactionListItemDto
    {
        public int Id { get; set; }
        public int? TransactionId { get; set; }
        public int? BankAccountId { get; set; }
        public string BankAccountName { get; set; }

        public string Description { get; set; }

        public decimal DebitAmount { get; set; }
        public decimal CreditAmount { get; set; }
        public DateTime TransactionDate { get; set; }
        public DateTime ModifyDate { get; set; }
        public Constants.TransactionStatus Status { get; set; }
        public Constants.TransactionType TransactionType { get; set; }
        public Constants.ContactType ContactType { get; set; }
        public int ContactId { get; set; }

        public string ContactName { get; set; }

        public string TransactionName { get; set; }
        public bool? isForTransEntry { get; set; }

        public decimal amount { get; set; }


        

    }
}
