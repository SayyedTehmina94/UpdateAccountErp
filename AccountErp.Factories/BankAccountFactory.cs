using AccountErp.Entities;
using AccountErp.Models.BankAccount;
using AccountErp.Utilities;

namespace AccountErp.Factories
{
    public class BankAccountFactory
    {
        public static BankAccount Create(BankAccountAddModel model,string userId)
        {
            BankAccount bankAccount =  new BankAccount
            {
                AccountNumber = model.AccountNumber,
                AccountHolderName = model.AccountHolderName,
                BankName = model.BankName,
                BranchName = model.BranchName,
                Ifsc = model.Ifsc,
                Status = Constants.RecordStatus.Active,
                CreatedBy = userId ?? "0",
                CreatedOn = Utility.GetDateTime(),
                AccountCode = model.AccountCode,
                COA_AccountTypeId = model.COA_AccountTypeId,
                Description = model.Description,
                LedgerType = model.LedgerType,
                AccountName = model.AccountName,
                AccountId = model.AccountId,
                IsForEdit = true
            };
            return bankAccount;
        }
        public static void Create(BankAccountEditModel model,BankAccount entity,string userId)
        {
            entity.AccountNumber = model.AccountNumber;
            entity.AccountHolderName = model.AccountHolderName;
            entity.BankName = model.BankName;
            entity.BranchName = model.BranchName;
            entity.Ifsc = model.Ifsc;
            entity.UpdatedBy = userId ?? "0";
            entity.UpdatedOn = Utility.GetDateTime();
            entity.AccountCode = model.AccountCode;
            entity.Description = model.Description;
            entity.COA_AccountTypeId = model.COA_AccountTypeId;
            entity.LedgerType = model.LedgerType;
            entity.AccountId = model.AccountId;
            entity.AccountName = model.AccountName;
        }
    }
}
