using AccountErp.Utilities;

namespace AccountErp.Entities
{
    public class ItemType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public Constants.RecordStatus Status { get; set; }
    }
}
