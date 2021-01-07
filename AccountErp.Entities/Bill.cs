using AccountErp.Utilities;
using System;
using System.Collections.Generic;

namespace AccountErp.Entities
{
    public class Bill
    {
        public int Id { get; set; }
        public int VendorId { get; set; }
        public string RefrenceNumber { get; set; }
        public decimal? Tax { get; set; }
        public decimal? Discount { get; set; }
        public decimal TotalAmount { get; set; }
        public string Remark { get; set; }
        public Constants.BillStatus Status { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }

        public string StrBillDate { get; set; }
        public DateTime BillDate { get; set; }
        public string StrDueDate { get; set; }
        public decimal? PoSoNumber { get; set; }

        public string Notes { get; set; }
        public string BillNumber { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? LineAmountSubTotal { get; set; }
        public Vendor Vendor { get; set; }
        public ICollection<BillItem> Items { get; set; }
        public ICollection<BillAttachment> Attachments { get; set; }
    }
}
