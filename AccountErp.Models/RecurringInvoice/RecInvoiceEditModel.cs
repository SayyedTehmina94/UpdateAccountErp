using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace AccountErp.Models.RecurringInvoice
{
    public class RecInvoiceEditModel
    {
        public int Id { get; set; }
        [Required]
        public int CustomerId { get; set; }

        public decimal? Tax { get; set; }

        public decimal? Discount { get; set; }

        [Required]
        public decimal TotalAmount { get; set; }

        public string Remark { get; set; }

        public DateTime RecInvoiceDate { get; set; }
        public DateTime RecDueDate { get; set; }
        public decimal? PoSoNumber { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? LineAmountSubTotal { get; set; }
        [Required]
        public List<RecInvoiceServiceModel> Items { get; set; }

        public List<RecInvoiceAttachmentAddModel> Attachments { get; set; }
    }
}
