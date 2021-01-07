using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace AccountErp.Models.CustomerSalesTax
{
    public class CustomerSalesTaxWithCustomerAddModel
    {
        [Required]
        public int CustomerId { get; set; }
        [Required]
        public string Code { get; set; }
        [Required]
        public string Class { get; set; }

        public string Description { get; set; }

        public string IsTaxable { get; set; }
    }
}
