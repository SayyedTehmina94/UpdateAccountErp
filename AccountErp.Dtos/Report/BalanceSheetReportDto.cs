using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Report
{
    public class BalanceSheetReportDto
    {
        public int Id { get; set; }
        public String AccountMasterName { get; set; }
        public List<BalanceSheetDetailsReportDto> BankAccount { get; set; }
    }
}
