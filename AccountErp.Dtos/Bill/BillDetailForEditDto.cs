using System;
using System.Collections.Generic;

namespace AccountErp.Dtos.Bill
{
    public class BillDetailForEditDto
    {
        public int Id { get; set; }
        public int VendorId { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public decimal? Tax { get; set; }
        public decimal TotalAmount { get; set; }
        public string Remark { get; set; }
        public string RefrenceNumber { get; set; }
        public decimal? Discount { get; set; }
        public DateTime BillDate { get; set; }
        public DateTime DueDate { get; set; }
        public decimal? PoSoNumber { get; set; }
        public string StrBillDate { get; set; }
        public string StrDueDate { get; set; }
        public string Notes { get; set; }
        public string BillNumber { get; set; }
        public decimal? SubTotal { get; set; }
        public IEnumerable<BillServiceDto> Items { get; set; }
        public IEnumerable<BillAttachmentDto> Attachments { get; set; }
    }
}
