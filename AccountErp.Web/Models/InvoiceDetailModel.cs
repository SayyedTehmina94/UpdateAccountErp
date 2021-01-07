using AccountErp.Web.Helpers;
using System;
using System.Collections.Generic;

namespace AccountErp.Web.Models
{
    public class InvoiceDetailModel
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public decimal? Tax { get; set; }
        public decimal? Discount { get; set; }
        public decimal TotalAmount { get; set; }
        public string Remark { get; set; }
        public Constants.InvoiceStatus Status { get; set; }
        public DateTime CreatedOn { get; set; }

        public CustomerDetailModel Customer { get; set; }

        public IEnumerable<ServiceModel> Items { get; set; }
        public IEnumerable<AttachmentModel> Attachments { get; set; }
    }
}
