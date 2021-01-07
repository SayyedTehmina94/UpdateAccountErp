using AccountErp.Utilities;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Models.Vendor
{
    public class VendorJqDataTableRequestModel : JqDataTableRequest
    {
        public string FilterKey { get; set; }
        public int? VendorId { get; set; }
    }
}
