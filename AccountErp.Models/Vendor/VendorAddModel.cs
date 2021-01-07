using System.ComponentModel.DataAnnotations;

namespace AccountErp.Models.Vendor
{
    public class VendorAddModel
    {
        public string HSTNumber;

        [Required]
        public string Name { get; set; }
        
        public string Phone { get; set; }
        public string Fax { get; set; }

        [Required]
        public string Email { get; set; }
        public string Website { get; set; }
    }
}
