using AccountErp.Utilities;
using System;

namespace AccountErp.Dtos.Bill
{
    public class BillPaymentListItemDto
    {
        public int Id { get; set; }
        public string VendorName { get; set; }
        public Constants.BillPaymentMode PaymentMode { get; set; }
        public string ReferenceNumber { get; set; }
        public decimal PaymentAmount { get; set; }
        public string DepositFrom { get; set; }
        public string DepositTo { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
