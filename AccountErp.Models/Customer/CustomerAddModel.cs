using System.ComponentModel.DataAnnotations;

namespace AccountErp.Models.Customer
{
    public class CustomerAddModel
    {
        [Required]
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        [Required]
        public string Email { get; set; }
        public string Phone { get; set; }
    }
}
