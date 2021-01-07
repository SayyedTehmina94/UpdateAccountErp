using AccountErp.Dtos.BankAccount;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.ChartofAccount
{
    public class AccountTypeDetailDto
    {
        public int Id { get; set; }
        public int COA_AccountMasterId { get; set; }
        public String AccountTypeName { get; set; }
        public IEnumerable<BankAccountDetailDto> BankAccount { get; set; }
    }
}
