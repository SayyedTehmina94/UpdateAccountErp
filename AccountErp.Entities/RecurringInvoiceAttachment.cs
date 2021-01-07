using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Entities
{
    public class RecurringInvoiceAttachment
    {
        public int Id { get; set; }
        public int RecInvoiceId { get; set; }
        public string Title { get; set; }
        public string FileName { get; set; }
        public string OriginalFileName { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
    }
}
