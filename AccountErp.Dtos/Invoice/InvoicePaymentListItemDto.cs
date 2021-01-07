using AccountErp.Utilities;
using System;

namespace AccountErp.Dtos.Invoice
{
    public class InvoicePaymentListItemDto
    {
        public int Id { get; set; }
        public string InvoiceNumber { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string DepositTo { get; set; }
        public string DepositFrom { get; set; }
        public Constants.PaymentMode PaymentMode { get; set; }
        public decimal Amount { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
