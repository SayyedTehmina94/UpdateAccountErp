using AccountErp.Entities;
using AccountErp.Models.Account;
using AccountErp.Models.ChartOfAccount;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Factories
{
    public class ChartofaccountFactory
    {
        public static COA_Account Create(COA_AccountAddModel model, string userId)
        {
            var account = new COA_Account
            {
                AccountName = model.AccountName,
                AccountCode = model.AccountCode,
                Description = model.Description,
                COA_AccountTypeId = model.COA_AccountTypeId

            };

            return account;
        }

        public static void Update(COA_AccountEditModel model, COA_Account entity, string userId)
        {
            entity.AccountName = model.AccountName;
            entity.AccountCode = model.AccountCode;
            entity.Description = model.Description;
            entity.COA_AccountTypeId = model.COA_AccountTypeId;

        }
    }
}
