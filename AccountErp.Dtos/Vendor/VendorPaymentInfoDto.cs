namespace AccountErp.Dtos.Vendor
{
    public class VendorPaymentInfoDto
    {
        public int Id { get; set; }
        public string AccountNumber { get; set; }
        public string BankName { get; set; }
        public string BankBranch { get; set; }
        public string Ifsc { get; set; }
    }
}
