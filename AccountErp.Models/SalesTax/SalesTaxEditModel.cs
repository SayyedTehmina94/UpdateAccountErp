using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace AccountErp.Models.SalesTax
{
    public class SalesTaxEditModel
    {
        public int Id { get; set; }
        [Required]
        public string Code { get; set; }

        public string Description { get; set; }
        [Required]
        public decimal TaxPercentage { get; set; }
    }
}
