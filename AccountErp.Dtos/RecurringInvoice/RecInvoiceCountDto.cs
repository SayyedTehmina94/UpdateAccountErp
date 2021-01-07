using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.RecurringInvoice
{
    public class RecInvoiceCountDto
    {
        public List<RecListTopTenDto> RecListTopTenDtos { get; set; }
        public int Count { get; set; }
    }
}
