using AccountErp.Dtos.Customer;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Report
{
    public class CustomerDetailsReportDto
    {
     /*   public DateTime startDate { get; set; }
        public DateTime endDate { get; set; }*/
        public Decimal TotalIncome { get; set; }

        public Decimal TotaPaidIncome { get; set; }

        public List<CustomerReportsDto> customerReportsDtosList { get; set; }
    }
}
