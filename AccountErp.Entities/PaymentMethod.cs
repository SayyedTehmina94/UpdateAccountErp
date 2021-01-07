using AccountErp.Utilities;

namespace AccountErp.Entities
{
    public class PaymentMethod
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public Constants.RecordStatus Status { get; set; }
    }
}
