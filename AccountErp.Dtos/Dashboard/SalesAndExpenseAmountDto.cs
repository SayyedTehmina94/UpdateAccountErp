using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Dashboard
{
    public class SalesAndExpenseAmountDto
    {
        public decimal[] SalesData { get; set; }
        public decimal[] ExpenseData { get; set; }
    }
}
