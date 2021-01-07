using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace AccountErp.Models.Quotation
{
    public class QuotationEditModel
    {
        public int Id { get; set; }

        [Required]
        public int CustomerId { get; set; }

        public decimal? Tax { get; set; }

        public decimal? Discount { get; set; }

        [Required]
        public decimal TotalAmount { get; set; }
        public string Remark { get; set; }
        public DateTime QuotationDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public decimal? PoSoNumber { get; set; }

        public string Memo { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? LineAmountSubTotal { get; set; }

        [Required]
        public List<QuotationServiceModel> Items { get; set; }
        //public List<int> Items { get; set; }

        public List<QuotationAttachmentAddModel> Attachments { get; set; }
    }
}

