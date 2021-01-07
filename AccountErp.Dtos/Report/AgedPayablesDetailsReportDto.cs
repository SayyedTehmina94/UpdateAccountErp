using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Report
{
    public class AgedPayablesDetailsReportDto
    {
        public Decimal TotalAmount { get; set; }
        public Decimal TotalUnpaidAmount { get; set; }
        public Decimal TotalNotYetOverDue { get; set; }
        public Decimal TotalLessThan30 { get; set; }
        public Decimal TotalThirtyFirstToSixty { get; set; }
        public Decimal TotalSixtyOneToNinety { get; set; }
        public Decimal TotalMoreThanNinety { get; set; }
        public int TotalCountNotYetOverDue { get; set; }
        public int TotalCountLessThan30 { get; set; }
        public int TotalCountThirtyFirstToSixty { get; set; }
        public int TotalCountSixtyOneToNinety { get; set; }
        public int TotalCountMoreThanNinety { get; set; }

        public List<AgedPayablesReportDto> AgedPayablesReportDtoList { get; set; }
        public List<AgedReceivablesReportDto> AgedReceivablesReportDtoList { get; set; }
    }
}
