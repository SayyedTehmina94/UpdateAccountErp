using AccountErp.Utilities;

namespace AccountErp.Dtos.Item
{
    public class ItemDetailDto
    {
        public int Id { get; set; }
        public string ItemTypeName { get; set; }
        public string Name { get; set; }
        public decimal Rate { get; set; }
        public string Description { get; set; }
        public bool IsTaxable { get; set; }
        public string TaxCode { get; set; }
        public decimal? TaxPercentage { get; set; }
        public int? SalesTaxId { get; set; }
        public bool? isForSell { get; set; }
        public int? BankAccountId { get; set; }
        public int? TaxBankAccountId { get; set; }
        public Constants.RecordStatus Status { get; set; }
    }
}
