using AccountErp.Dtos.Address;
using AccountErp.Dtos.ShippingAddress;
using AccountErp.Utilities;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Customer
{
    public class CustomerListItemDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string AccountNumber { get; set; }
        public string BankBranch { get; set; }
        public decimal? Discount { get; set; }
        public string City { get; set; }
        public Constants.RecordStatus Status { get; set; }
        public AddressDto Address { get; set; }
        public ShippingAddressDto ShippingAddress { get; set; }
    }
}
