namespace AccountErp.Dtos.Vendor
{
    public class VendorPersonallnfoDto
    {
        public int Id { get; set; }
        public string HSTNumber { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public decimal? Discount { get; set; }
    }
}
