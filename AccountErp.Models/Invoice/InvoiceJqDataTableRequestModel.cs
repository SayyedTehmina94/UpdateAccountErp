using AccountErp.Utilities;

namespace AccountErp.Models.Invoice
{
    public class InvoiceJqDataTableRequestModel : JqDataTableRequest
    {
        public string FilterKey { get; set; }
        public int? CustomerId { get; set; }
    }
}
