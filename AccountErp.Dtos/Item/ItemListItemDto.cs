using AccountErp.Utilities;

namespace AccountErp.Dtos.Item
{
    public class ItemListItemDto
    {
        public int Id { get; set; }
        public int ItemTypeId { get; set; }
        public string ItemTypeName { get; set; }
        public decimal Percentage { get; set; }
        public string Name { get; set; }
        public decimal Rate { get; set; }
        public string Description { get; set; }

        public string TaxCode { get; set; }
        public decimal? TaxPercentage { get; set; }
        public int? BankAccountId { get; set; }
        public Constants.RecordStatus Status { get; set; }
    }
}
