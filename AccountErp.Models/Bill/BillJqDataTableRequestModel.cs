using AccountErp.Utilities;

namespace AccountErp.Models.Bill
{
    public class BillJqDataTableRequestModel : JqDataTableRequest
    {
        public string FilterKey { get; set; }
        public int? VendorId { get; set; }
        public int Status { get; set; }
    }
}
