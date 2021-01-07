using AccountErp.Dtos.Address;
using AccountErp.Dtos.Invoice;
using AccountErp.Dtos.ShippingAddress;
using AccountErp.Utilities;
using System;
using System.Collections.Generic;
using System.Text;
namespace AccountErp.Dtos.Customer
{
    public class CustomerStatementDto
    {

        public int Id { get; set; }
        public int CustomerId { get; set; }
        public DateTime startDate { get; set; } 
        public DateTime endDate { get; set; }
        public int Status { get; set; }
        public AddressDto Address { get; set; }
        public CustomerDetailDto Customer { get; set; }
        public ShippingAddressDto ShippingAddress { get; set; }
        public IEnumerable<InvoiceListItemDto> InvoiceList { get; set; }
        public decimal openingBalance { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
