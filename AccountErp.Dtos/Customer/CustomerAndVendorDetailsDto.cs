using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Customer
{
    public class CustomerAndVendorDetailsDto
    {
        public String id { get; set; }
        public String text { get; set; }
        public List<CustomerAndVendorDto> children { get; set; }
    }
}
