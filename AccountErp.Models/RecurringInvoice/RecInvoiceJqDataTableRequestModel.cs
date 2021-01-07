using AccountErp.Utilities;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Models.RecurringInvoice
{
   public class RecInvoiceJqDataTableRequestModel : JqDataTableRequest
    {
        public string FilterKey { get; set; }
        public int? CustomerId { get; set; }
    }
}