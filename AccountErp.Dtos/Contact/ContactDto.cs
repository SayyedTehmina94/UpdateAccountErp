using AccountErp.Dtos.Address;

namespace AccountErp.Dtos.Contact
{
    public class ContactDto
    {
        public int? Id { get; set; }
        public int? AddressId { get; set; }
        public AddressDto Address { get; set; }
        public int VendorId { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string JobTitle { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
    }
}
