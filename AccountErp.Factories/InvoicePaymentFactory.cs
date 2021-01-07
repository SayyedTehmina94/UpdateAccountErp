using AccountErp.Entities;
using AccountErp.Models.Invoice;
using AccountErp.Utilities;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Factories
{
    public class InvoicePaymentFactory
    {
        public static InvoicePayment Create(InvoicePaymentAddModel model,string depositFrom,decimal amount,string userId)
        {
            var invoicePayment = new InvoicePayment()
            {
                InvoiceId = model.InvoiceId,
                PaymentMode = model.PaymentMode,
                BankAccountId = model.BankAccountId,
                ChequeNumber = model.ChequeNumber,
                DepositFrom = depositFrom,
                Amount=amount,
                PaymentDate = model.PaymentDate,
                Description = model.Description,
                Status = Constants.RecordStatus.Active,
                CreatedBy = userId ?? "0",
                CreatedOn = Utility.GetDateTime()
            };

            return invoicePayment;
        }
    }
}
