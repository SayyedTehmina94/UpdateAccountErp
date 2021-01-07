using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AccountErp.Models.Bill
{
    public class BillEditModel
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public int VendorId { get; set; }
        public DateTime? DueDate { get; set; }
        public decimal? Tax { get; set; }
        public decimal? Discount { get; set; }
        [Required]
        public decimal TotalAmount { get; set; }
        public string Remark { get; set; }
        public string RefrenceNumber { get; set; }
        public string Notes { get; set; }
        public DateTime BillDate { get; set; }
        public string BillNumber { get; set; }
        public decimal? PoSoNumber { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? LineAmountSubTotal { get; set; }
        [Required]
        public List<BillServiceModel> Items { get; set; }
        public IList<BillAttachmentModel> Attachments { get; set; }
    }
}
