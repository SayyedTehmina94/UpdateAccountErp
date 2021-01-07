using AccountErp.Utilities;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Models.CustomerSalesTax
{
    public class CustomerSalesTaxJqDataTableRequestModel : JqDataTableRequest
    {
        public string FilterKey { get; set; }
        public int? CustomerId { get; set; }
    }
}
