using AccountErp.Dtos.BankAccount;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.ChartofAccount
{
   public class AccountWithMasterDetailsDto
    {
        public String Id { get; set; }
        public String text { get; set; }
        public List<BankAccountDto> children { get; set; }
    }
}
