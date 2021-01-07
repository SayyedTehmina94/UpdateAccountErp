using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.RecurringInvoice
{
    public class RecInvoiceAttachmentDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string FileName { get; set; }
        public string OriginalFileName { get; set; }
        public string FileUrl { get; set; }
    }
}
