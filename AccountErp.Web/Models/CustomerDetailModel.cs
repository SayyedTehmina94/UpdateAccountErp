namespace AccountErp.Web.Models
{
    public class CustomerDetailModel
    {
        public int Id { get; set; }

        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string AccountNumber { get; set; }
        public string BankName { get; set; }
        public string BankBranch { get; set; }
        public string Ifsc { get; set; }
        public decimal? Discount { get; set; }
        public AddressModel Address { get; set; }
        public int? AddressId { get; set; }
    }
}
