using AccountErp.Dtos.BankAccount;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.ChartofAccount
{
    public class AccountDetailsWithMasterDto
    {
        public int Id { get; set; }
        public String text { get; set; }
        public List<BankAccountDetailDto> children { get; set; }
    }
}
