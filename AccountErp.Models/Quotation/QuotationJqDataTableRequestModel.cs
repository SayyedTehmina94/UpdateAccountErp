using AccountErp.Utilities;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Models.Quotation
{
    public class QuotationJqDataTableRequestModel : JqDataTableRequest
    {
        public string FilterKey { get; set; }
        public int? CustomerId { get; set; }
    }
}
