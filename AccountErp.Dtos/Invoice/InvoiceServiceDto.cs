namespace AccountErp.Dtos.Invoice
{
    public class InvoiceServiceDto
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public decimal Rate { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public decimal Price { get; set; }
        public int? TaxId { get; set; }
        public decimal? TaxPrice { get; set; }
        public decimal? TaxPercentage { get; set; }
        public decimal LineAmount { get; set; }
        public int Quantity { get; set; }
        public int? BankAccountId { get; set; }
        public int? TaxBankAccountId { get; set; }


    }
}
