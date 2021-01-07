using AccountErp.Utilities;

namespace AccountErp.Dtos.SalesTax
{
    public class SalesTaxListItemDto
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public decimal TaxPercentage { get; set; }
        public Constants.RecordStatus Status { get; set; }
        public int? BankAccountId { get; set; }
    }
}
