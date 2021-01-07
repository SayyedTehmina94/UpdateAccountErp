namespace AccountErp.Entities
{
    public class Address
    {
        public int Id { get; set; }
        public int? CountryId { get; set; }
        public string StreetNumber { get; set; }
        public string StreetName { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
        public string Phone { get; set; }
        public Country Country { get; set; }

    }
}
