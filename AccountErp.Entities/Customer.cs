using AccountErp.Utilities;
using System;
using System.Collections.Generic;

namespace AccountErp.Entities
{
    public class Customer
    {
        public int Id { get; set; }
        public int? AddressId { get; set; }
        public int? ShippingAddressId { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }

        public Constants.RecordStatus Status { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }

        public string AccountNumber { get; set; }
        public string BankName { get; set; }
        public string BankBranch { get; set; }
        public string Ifsc { get; set; }

        public decimal? Discount { get; set; }

        public Address Address {get;set;}
        public ShippingAddress ShippingAddress { get; set; }

        public ICollection<Invoice> Invoices { get; set; }
    }
}
