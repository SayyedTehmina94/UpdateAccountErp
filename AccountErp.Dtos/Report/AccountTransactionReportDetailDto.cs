using AccountErp.Utilities;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Report
{
    public class AccountTransactionReportDetailDto
    {
        public int Id { get; set; }
        public decimal CreditAmount { get; set; }
        public decimal DebitAmount { get; set; }
        public decimal Balance { get; set; }
        public DateTime TransactionDate { get; set; }
        public Constants.TransactionType TransactionType { get; set; }

    }
}
