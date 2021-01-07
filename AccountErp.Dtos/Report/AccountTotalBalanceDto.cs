using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Report
{
    public class AccountTotalBalanceDto
    {

        public decimal TotalCreditAmount { get; set; }
        public decimal TotalDebitAmount { get; set; }
        public List<AccountBalanceReportDto> accountBalanceReportDtoList { get; set; }
    }
}
