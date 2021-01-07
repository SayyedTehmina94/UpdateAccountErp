using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Report
{
    public class AccountBalanceReportDto
    {
        public int Id { get; set; }
        public String AccountMasterName { get; set; }
        public List<AccountBalanceAccountDetailDto> BankAccount { get; set; }
    }
}
