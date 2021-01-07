using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Entities
{
   public class QuotationAttachment
    {
        public int Id { get; set; }
        public int QuotationId { get; set; }
        public string Title { get; set; }
        public string FileName { get; set; }
        public string OriginalFileName { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
    }
}
