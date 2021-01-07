using AccountErp.Models.Address;
using AccountErp.Models.ShippingAddress;
using System.ComponentModel.DataAnnotations;

namespace AccountErp.Models.Customer
{
    public class CustomerEditModel
    {
        public int Id { get; set; }

        [Required]
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }

        [Required]
        public string Email { get; set; }
        public string Phone { get; set; }
        public string AccountNumber { get; set; }
        public string BankName { get; set; }
        public string BankBranch { get; set; }
        public string Ifsc { get; set; }

        public decimal? Discount { get; set; }

        public AddressModel Address { get; set; }
        public ShippingAddressModel ShippingAddress { get; set; }
    }
}
