using System.ComponentModel.DataAnnotations;

namespace AccountErp.Models.VendorSalesTax
{
    public class SalesTaxAddModel
    {
        [Required]
        public string Code { get; set; }

        public string Description { get; set; }
        [Required]
        public decimal TaxPercentage { get; set; }
    }
}
