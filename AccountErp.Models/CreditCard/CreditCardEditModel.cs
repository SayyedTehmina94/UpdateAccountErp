using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Models.CreditCard
{
    public class CreditCardEditModel
    {
        public int Id { get; set; }
        public string CreditCardNumber { get; set; }
        public string CardHolderName { get; set; }
        public string BankName { get; set; }
    }
}
