using AccountErp.Utilities;
using System;

namespace AccountErp.Dtos.Bill
{
    public class BillListItemDto
    {
        public int Id { get; set; }
        public int VendorId { get; set; }
        public string VendorName { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public decimal? Tax { get; set; }
        public decimal? Discount { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime BillDate { get; set; }
        public DateTime DueDate { get; set; }
        public decimal? PoSoNumber { get; set; }
        public string RefrenceNumber { get; set; }
        public string StrBillDate { get; set; }
        public string StrDueDate { get; set; }
        public string Notes { get; set; }
        public string BillNumber { get; set; }
        public decimal? SubTotal { get; set; }
        public Constants.BillStatus Status { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
