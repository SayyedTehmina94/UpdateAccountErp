using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Report
{
    public class AgedReceivablesReportDto
    {
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public Decimal TotalAmount { get; set; }
        public Decimal TotalUnpaid { get; set; }
        public DateTime DateForDue { get; set; }
        public Decimal LessThan30 { get; set; }
        public Decimal ThirtyFirstToSixty { get; set; }
        public Decimal SixtyOneToNinety { get; set; }
        public Decimal MoreThanNinety { get; set; }
        public Decimal NotYetOverDue { get; set; }
        public int CountNotYetOverDue { get; set; }
        public int CountLessThan30 { get; set; }
        public int CountThirtyFirstToSixty { get; set; }
        public int CountSixtyOneToNinety { get; set; }
        public int CountMoreThanNinety { get; set; }
    }
}

