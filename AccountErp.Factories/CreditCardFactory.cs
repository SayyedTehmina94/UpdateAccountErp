using AccountErp.Entities;
using AccountErp.Models.CreditCard;
using AccountErp.Utilities;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Factories
{
    public class CreditCardFactory
    {
        public static CreditCard Create(CreditCardAddModel model,string userId)
        {
            CreditCard creditCard = new CreditCard()
            {
                Number = model.CreditCardNumber,
                BankName = model.BankName,
                CardHolderName = model.CardHolderName,
                Status = Constants.RecordStatus.Active,
                CreatedBy = userId,
                CreatedOn = Utility.GetDateTime()
            };
            return creditCard;
        }
        public static void Create(CreditCardEditModel model,CreditCard entity,string userId)
        {
            entity.Number = model.CreditCardNumber;
            entity.BankName = model.BankName;
            entity.CardHolderName = model.CardHolderName;
            entity.UpdatedBy = userId;
            entity.UpdatedOn = Utility.GetDateTime();
        }
    }
}
