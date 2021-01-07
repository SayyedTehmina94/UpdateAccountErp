using AccountErp.Dtos.Bill;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Report
{
    public class CustomerReportsDto
    {
        public int CustomerId;

        public string CustomerName;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public Decimal PaidAmount { get; set; }
        public Decimal IncomeAmount { get; set; }
        public string Status { get; set; }
    }
}


