using AccountErp.Utilities;

namespace AccountErp.Models.Item
{
    public class ItemJqDataTableRequestModel : JqDataTableRequest
    {
        public string FilterKey { get; set; }
        public int? ItemTypeId { get; set; }
    }
}
