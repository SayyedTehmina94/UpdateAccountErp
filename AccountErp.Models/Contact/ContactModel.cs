using AccountErp.Models.Address;

namespace AccountErp.Models.Contact
{
    public class ContactModel
    {
        public int? Id { get; set; }
        public int? AddressId { get; set; }
        public AddressModel Address { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string JobTitle { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
    }
}
