namespace AccountErp.Dtos.Invoice
{
    public class InvoiceAttachmentDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string FileName { get; set; }
        public string OriginalFileName { get; set; }
        public string FileUrl { get; set; }
    }
}
