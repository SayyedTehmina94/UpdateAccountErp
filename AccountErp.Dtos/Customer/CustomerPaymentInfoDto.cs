using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Customer
{
    public class CustomerPaymentInfoDto
    {
        public int Id { get; set; }
        public string AccountNumber { get; set; }
        public string BankName { get; set; }
        public string BankBranch { get; set; }
        public string Ifsc { get; set; }
    }
}
