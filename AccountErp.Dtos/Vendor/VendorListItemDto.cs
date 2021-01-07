using AccountErp.Utilities;

namespace AccountErp.Dtos.Vendor
{
    public class VendorListItemDto
    {
        public int Id { get; set; }
        public string HSTNumber { get; set; }
        public string Name { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Website { get; set; }
        public Constants.RecordStatus Status { get; set; }
    }
}
