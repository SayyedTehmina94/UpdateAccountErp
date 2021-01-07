using AccountErp.Utilities;

namespace AccountErp.Dtos.Item
{
    public class ItemDetailForEditDto
    {
        public int Id { get; set; }
        public int ItemTypeId { get; set; }
        public string Name { get; set; }
        public decimal Rate { get; set; }
        public string Description { get; set; }
        public string IsTaxable { get; set; }
        public int? SalesTaxId { get; set; }
        public string isForSell { get; set; }
        public int? BankAccountId { get; set; }
        public Constants.RecordStatus Status { get; set; }
    }
}
