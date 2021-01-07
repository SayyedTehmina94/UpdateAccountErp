using AccountErp.Utilities;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Models.Report
{
    public class AccountTransactionReportModel
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int ContactId { get; set; }
        public int AccountId { get; set; }
        public int ReportType { get; set; }
        public Constants.ContactType ContactType { get; set; }

    }
}
