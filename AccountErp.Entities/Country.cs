using AccountErp.Utilities;
using System.Collections.Generic;

namespace AccountErp.Entities
{
    public class Country
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string IsoCode { get; set; }
        public Constants.RecordStatus Status {get;set;}
        public ICollection<Address> Addresses { get; set; }
    }
}
