using AccountErp.Models.Address;
using AccountErp.Models.Contact;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AccountErp.Models.Vendor
{
    public class VendorEditModel
    {
        public int Id { get; set; }
        public string HSTNumber { get; set; }
        [Required]
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
        [Required]
        public string Email { get; set; }
        public string Website { get; set; }
        public AddressModel BillingAddress { get; set; }
        public AddressModel ShippingAddress { get; set; }
        public string AccountNumber { get; set; }
        public string BankName { get; set; }
        public string BankBranch { get; set; }
        public string Ifsc { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public List<ContactModel> Contacts { get; set; }
        public decimal? Discount { get; set; }
    }
}
