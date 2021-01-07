using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Report
{
    public class AccountBalanceAccountDetailDto
    {
        public int Id { get; set; }
        public string AccountName { get; set; }
        public decimal StartingBalance { get; set; }
        public decimal CreditAmount { get; set; }
        public decimal DebitAmount { get; set; }
        public decimal NetMovement { get; set; }
        public decimal EndingBalance { get; set; }

    }
}
