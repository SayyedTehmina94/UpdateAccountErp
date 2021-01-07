using AccountErp.Utilities;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Models.Customer
{
    public class CustomerJqDataTableRequestModel : JqDataTableRequest
    {
        public string FilterKey { get; set; }
        public int? CustomerId { get; set; }
    }
}