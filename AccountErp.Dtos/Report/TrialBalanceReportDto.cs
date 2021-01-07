using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Report
{
    public class TrialBalanceReportDto
    {
        public int Id { get; set; }
        public String AccountMasterName { get; set; }
        public List<TrialBalanceAccountDetailDto> BankAccount { get; set; }
    }
}
