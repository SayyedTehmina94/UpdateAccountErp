using AccountErp.Entities;
using AccountErp.Models.Address;

namespace AccountErp.Factories
{
    public class AddressFactory
    {
        public static Address Create(AddressModel model)
        {
            var address = new Address()
            {
                CountryId = model.CountryId,
                StreetNumber = model.StreetNumber,
                StreetName = model.StreetName,
                City = model.City,
                State = model.State,
                PostalCode = model.PostalCode
            };

            return address;
        }

        public static void Create(AddressModel model, Address entity)
        {
            entity.CountryId = model.CountryId;
            entity.StreetNumber = model.StreetNumber;
            entity.StreetName = model.StreetName;
            entity.City = model.City;
            entity.State = model.State;
            entity.PostalCode = model.PostalCode;
        }
    }
}
