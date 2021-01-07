using System;

namespace AccountErp.Entities
{
    public class BillAttachment
    {
        public int Id { get; set; }
        public int BillId { get; set; }
        public string Title { get; set; }
        public string FileName { get; set; }
        public string OriginalFileName { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
    }
}
