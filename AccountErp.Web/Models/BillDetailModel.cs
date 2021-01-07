using AccountErp.Web.Helpers;
using System;
using System.Collections.Generic;

namespace AccountErp.Web.Models
{
    public class BillDetailModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public decimal? Tax { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal? Discount { get; set; }
        public string Remark { get; set; }
        public Constants.BillStatus Status { get; set; }
        public DateTime CreatedOn { get; set; }

        public VendorPersonalInfoModel Vendor { get; set; }

        public IEnumerable<ServiceModel> Items { get; set; }
        public IEnumerable<AttachmentModel> Attachments { get; set; }
    }
}
