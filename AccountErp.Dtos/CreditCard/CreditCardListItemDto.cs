using AccountErp.Utilities;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.CreditCard
{
    public class CreditCardListItemDto
    {
        public int Id { get; set; }
        public string CreditCardNumber { get; set; }
        public string CardHolderName { get; set; }
        public string BankName { get; set; }
        public Constants.RecordStatus Status { get; set; }
    }
}
