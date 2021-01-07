using AccountErp.Entities;
using AccountErp.Models.Bill;
using AccountErp.Models.Invoice;
using AccountErp.Utilities;
using System;
using System.Collections.Generic;
using System.Reflection.Metadata;
using System.Text;

namespace AccountErp.Factories
{
    public class TransactionFactory
    {
        public static Transaction CreateByInvoice(Invoice entity)
        {
            var transaction = new Transaction
            {
                TransactionId = entity.Id,
                CompanyId = null,
                TransactionTypeId = Constants.TransactionType.InvoicePayment,
                TransactionDate = Utility.GetDateTime(),
                TransactionNumber = entity.InvoiceNumber,
                ContactType = Constants.ContactType.Customer,
                ContactId = entity.CustomerId,
                BankAccountId = Constants.Account.AccountReceiveable,
                DebitAmount = entity.TotalAmount,
                CreditAmount = 0,
                CreationDate = Utility.GetDateTime(),
                ModifyDate = null,
                Status = Constants.TransactionStatus.Pending,
         
                isForTransEntry = true
            };

            return transaction;
        }

        public static Transaction CreateByInvoiceItemsAndTax(Invoice entity, int AccId, decimal? amount)
        {
            var transaction = new Transaction
            {
                TransactionId = entity.Id,
                CompanyId = null,
                TransactionTypeId = Constants.TransactionType.InvoicePayment,
                TransactionDate = Utility.GetDateTime(),
                TransactionNumber = entity.InvoiceNumber,
                ContactType = Constants.ContactType.Customer,
                ContactId = entity.CustomerId,
                BankAccountId = AccId,
                DebitAmount = 0,
                CreditAmount = amount ?? 0,
                CreationDate = Utility.GetDateTime(),
                ModifyDate = null,
                Status = Constants.TransactionStatus.Pending,
                isForTransEntry = false
            };

            return transaction;
        }

        public static Transaction CreateByBill(Bill entity)
        {
            var transaction = new Transaction
            {
                TransactionId = entity.Id,
                CompanyId = null,
                TransactionTypeId = Constants.TransactionType.BillPayment,
                TransactionDate = Utility.GetDateTime(),
                TransactionNumber = entity.BillNumber,
                ContactType = Constants.ContactType.Vendor,
                ContactId = entity.VendorId,
                BankAccountId = Constants.Account.AccountPayable,
                DebitAmount = 0,
                CreditAmount = entity.TotalAmount,
                CreationDate = Utility.GetDateTime(),
                ModifyDate = null,
                Status = Constants.TransactionStatus.Pending,
                isForTransEntry = true
            };

            return transaction;
        }

        public static Transaction CreateByBillItemsAndTax(Bill entity, int AccId, decimal? amount)
        {
            var transaction = new Transaction
            {
                TransactionId = entity.Id,
                CompanyId = null,
                TransactionTypeId = Constants.TransactionType.BillPayment,
                TransactionDate = Utility.GetDateTime(),
                TransactionNumber = entity.BillNumber,
                ContactType = Constants.ContactType.Vendor,
                ContactId = entity.VendorId,
                BankAccountId = AccId,
                DebitAmount = amount ?? 0,
                CreditAmount = 0,
                CreationDate = Utility.GetDateTime(),
                ModifyDate = null,
                Status = Constants.TransactionStatus.Pending,
                isForTransEntry = false
            };

            return transaction;
        }

        public static Transaction CreateByCustomerAdvancePayment(InvoicePaymentAddModel model, int? accId, decimal creditAmt, decimal debitAmt, bool isForTransEntry)
        {
            var transaction = new Transaction
            {
                TransactionId = null,
                CompanyId = null,
                TransactionTypeId = Constants.TransactionType.CustomerAdvancePayment,
                TransactionDate = model.PaymentDate,
                TransactionNumber = null,
                ContactType = Constants.ContactType.Customer,
                ContactId = model.CustomerId,
                BankAccountId = accId,
                DebitAmount = debitAmt,
                CreditAmount = creditAmt,
                CreationDate = model.PaymentDate,
                ModifyDate = model.PaymentDate,
                Status = Constants.TransactionStatus.Paid,
                Description = model.Description,
                isForTransEntry = isForTransEntry
            };

            return transaction;
        }
        public static Transaction CreateByVendorAdvancePayment(BillPaymentAddModel model, int? accId, decimal creditAmt, decimal debitAmt, bool isForTransEntry)
        {
            var transaction = new Transaction
            {
                TransactionId = null,
                CompanyId = null,
                TransactionTypeId = Constants.TransactionType.VendorAdvancePayment,
                TransactionDate = model.PaymentDate,
                TransactionNumber = null,
                ContactType = Constants.ContactType.Vendor,
                ContactId = model.VendorId,
                BankAccountId = accId,
                DebitAmount = debitAmt,
                CreditAmount = creditAmt,
                CreationDate = model.PaymentDate,
                ModifyDate = model.PaymentDate,
                Status= Constants.TransactionStatus.Paid,
                Description = model.Description,
                isForTransEntry = isForTransEntry
            };

            return transaction;
        }

        public static Transaction CreateByTaxPaymentByVendor(BillPaymentAddModel model, int? accId, decimal creditAmt, decimal debitAmt, bool isForTransEntry)
        {
            var transaction = new Transaction
            {
                TransactionId = null,
                CompanyId = null,
                TransactionTypeId = Constants.TransactionType.AccountExpence,
                TransactionDate = model.PaymentDate,
                TransactionNumber = null,
                ContactType = null,
                ContactId = null,
                BankAccountId = accId,
                DebitAmount = debitAmt,
                CreditAmount = creditAmt,
                CreationDate = model.PaymentDate,
                ModifyDate = model.PaymentDate,
                Status = Constants.TransactionStatus.Paid,
                Description = model.Description,
                isForTransEntry = isForTransEntry
            };

            return transaction;
        }
        public static Transaction CreateByTaxPaymentByCustomer(InvoicePaymentAddModel model, int? accId, decimal creditAmt, decimal debitAmt, bool isForTransEntry)
        {
            var transaction = new Transaction
            {
                TransactionId = null,
                CompanyId = null,
                TransactionTypeId = Constants.TransactionType.AccountIncome,
                TransactionDate = model.PaymentDate,
                TransactionNumber = null,
                ContactType = null,
                ContactId = null,
                BankAccountId = accId,
                DebitAmount = debitAmt,
                CreditAmount = creditAmt,
                CreationDate = model.PaymentDate,
                ModifyDate = model.PaymentDate,
                Status = Constants.TransactionStatus.Paid,
                Description = model.Description,
                isForTransEntry = isForTransEntry
            };

            return transaction;
        }
    }
}

