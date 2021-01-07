using AccountErp.Dtos.Vendor;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Customer
{
    public class CustomerAndVendorMainDetailsDto
    {
        public IEnumerable<CustomerDetailDto> CustomerTypes { get; set; }
        public IEnumerable<VendorDetailDto> VendorTypes { get; set; }
    }
}
