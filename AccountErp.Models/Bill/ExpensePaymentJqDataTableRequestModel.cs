using AccountErp.Utilities;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Models.Expense
{
    public class ExpensePaymentJqDataTableRequestModel : JqDataTableRequest
    {
        public string FilterKey { get; set; }
        public int? VendorId { get; set; }
    }
}
