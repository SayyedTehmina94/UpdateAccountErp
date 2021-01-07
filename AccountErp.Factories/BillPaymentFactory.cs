using AccountErp.Entities;
using AccountErp.Models.Bill;
using AccountErp.Utilities;

namespace AccountErp.Factories
{
    public class BillPaymentFactory
    {
        public static BillPayment Create(BillPaymentAddModel model, string depositTo, decimal amount, string userId)
        {
            return new BillPayment
            {
                BillId = model.BillId,
                PaymentMode = model.PaymentMode,
                BankAccountId = model.BankAccountId,
                CreditCardId = model.CreditCardId,
                ChequeNumber = model.ChequeNumber,
                DepositTo = depositTo,
                Amount = amount,
                PaymentDate = model.PaymentDate,
                Description = model.Description,
                Status = Constants.RecordStatus.Active,
                CreatedBy = userId ?? "0",
                CreatedOn = Utility.GetDateTime()
            };
        }
    }
}
