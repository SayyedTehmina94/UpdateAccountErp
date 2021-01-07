using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace AccountErp.Models.BankAccount
{
    public class BankAccountAddModel
    {
       
        public string AccountNumber { get; set; }
        
     
        public string AccountHolderName { get; set; }
     
        public string BankName { get; set; }
    
        public string BranchName { get; set; }
      
        public string Ifsc { get; set; }
       
        public int COA_AccountTypeId { get; set; }
        public string AccountCode { get; set; }
        public string Description { get; set; }
        public int? LedgerType { get; set; }
        public string AccountName { get; set; }
        public string AccountId { get; set; }
    }
}
