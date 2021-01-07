using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.Invoice
{
    public class InvoiceCountDto
    {
        public List<InvoiceListTopTenDto> InvoiceListTopTensList { get; set; }
        public int Count { get; set; }
    }
}
