using AccountErp.Utilities;
using System;
using System.Collections.Generic;

namespace AccountErp.Entities
{
    public class BankAccount
    {
        public int Id { get; set; }
        public string AccountNumber { get; set; }
        public int? COA_AccountTypeId { get; set; }
        public string AccountHolderName { get; set; }
        public string BankName { get; set; }
        public string BranchName { get; set; }
        public string Ifsc { get; set; }
        public Constants.RecordStatus Status { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public string AccountCode { get; set; }
        public string Description { get; set; }
        public int? LedgerType { get; set; }
        public string AccountName { get; set; }
        public string AccountId { get; set; }
        public bool IsForEdit { get; set; }
        public ICollection<Transaction> Transaction { get; set; }
    }
}
