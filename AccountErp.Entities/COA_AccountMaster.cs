using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Entities
{
    public class COA_AccountMaster
    {
        public int Id { get; set; }
        public String AccountMasterName { get; set; }
        public ICollection<COA_AccountType> AccountTypes { get; set; }
    }
}
