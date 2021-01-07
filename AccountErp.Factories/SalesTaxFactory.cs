using AccountErp.Entities;
using AccountErp.Models.SalesTax;
using AccountErp.Models.VendorSalesTax;
using AccountErp.Utilities;

namespace AccountErp.Factories
{
    public class SalesTaxFactory
    {
        public static SalesTax Create(SalesTaxAddModel addModel,string userId, int accId)
        {
            var salesTax = new SalesTax
            {
                Code = addModel.Code,
                Description = addModel.Description,
                TaxPercentage = addModel.TaxPercentage,
                CreatedBy = userId,
                CreatedOn = Utilities.Utility.GetDateTime(),
                Status = Utilities.Constants.RecordStatus.Active,
                BankAccountId = accId
            };
            return salesTax;
        }

        public static BankAccount AccountCreate(SalesTaxAddModel model, string userId, int typeId)
        {
            BankAccount bankAccount = new BankAccount
            {
                AccountHolderName = model.Code,
                Status = Constants.RecordStatus.Active,
                CreatedBy = userId ?? "0",
                CreatedOn = Utility.GetDateTime(),
                AccountCode = model.Code,
                COA_AccountTypeId = typeId,
                Description = model.Code,
                LedgerType = 3,
                AccountName = model.Code,
                AccountId = model.Code
            };
            return bankAccount;
        }

        public static void Create(SalesTaxEditModel salesTaxEditModel,SalesTax salesTax,string userId)
        {
            salesTax.Code = salesTaxEditModel.Code;
            salesTax.Description = salesTaxEditModel.Description;
            salesTax.TaxPercentage = salesTaxEditModel.TaxPercentage;
            salesTax.UpdatedBy = userId;
            salesTax.UpdatedOn = Utilities.Utility.GetDateTime();
        }
    }
}
