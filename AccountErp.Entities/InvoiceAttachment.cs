using System;

namespace AccountErp.Entities
{
    public class InvoiceAttachment
    {
        public int Id { get; set; }
        public int InvoiceId { get; set; }
        public string Title { get; set; }
        public string FileName { get; set; }
        public string OriginalFileName { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
    }
}
