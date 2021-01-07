using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Entities
{
   public class ShippingAddress
    {
        public int Id { get; set; }
        public int? CountryId { get; set; }
        public string ShipTo { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
        public string DeliveryInstruction { get; set; }
        public Country Country { get; set; }
        public string Phone { get; set; }
    }
}
