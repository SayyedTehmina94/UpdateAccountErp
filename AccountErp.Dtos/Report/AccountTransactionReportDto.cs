using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Report
{
    public class AccountTransactionReportDto
    {

        public int Id { get; set; }
        public string AccountMasterName { get; set; }
        public string AccountTypeName { get; set; }
        public string AccountName { get; set; }
        public decimal StartingBalance { get; set; }
        public decimal TotalAndEndingBalanceCreditAmount { get; set; }
        public decimal TotalAndEndingBalanceDebitAmount { get; set; }
        public decimal TotalAndEndingBalance { get; set; }
        public decimal BalanceChange { get; set; }
        public List<AccountTransactionReportDetailDto> Transactions { get; set; }
    }
}
