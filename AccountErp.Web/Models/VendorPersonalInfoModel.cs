namespace AccountErp.Web.Models
{
    public class VendorPersonalInfoModel
    {
        public int Id { get; set; }
        public string RegistrationNumber { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public decimal? Discount { get; set; }
    }
}
