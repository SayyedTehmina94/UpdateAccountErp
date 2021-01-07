using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Models.RecurringInvoice
{
    public class RecInvoiceAttachmentEditModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string FileName { get; set; }
        public string OriginalFileName { get; set; }
    }
}
