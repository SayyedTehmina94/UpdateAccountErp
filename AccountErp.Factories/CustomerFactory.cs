using AccountErp.Entities;
using AccountErp.Models.Customer;
using AccountErp.Utilities;

namespace AccountErp.Factories
{
    public class CustomerFactory
    {
        public static Customer Create(CustomerAddModel model, string userId)
        {
            var customer = new Customer
            {
                FirstName = model.FirstName,
                MiddleName = model.MiddleName,
                LastName = model.LastName,
                Phone = model.Phone,
                Email = model.Email,

                CreatedBy = userId ?? "0",
                CreatedOn = Utility.GetDateTime(),
                Status = Constants.RecordStatus.Active
            };

            return customer;
        }

        public static void Update(CustomerEditModel model, Customer entity, string userId)
        {
            entity.FirstName = model.FirstName;
            entity.MiddleName = model.MiddleName;
            entity.LastName = model.LastName;
            entity.Phone = model.Phone;
            entity.Email = model.Email;
            entity.AccountNumber = model.AccountNumber;
            entity.BankName = model.BankName;
            entity.BankBranch = model.BankBranch;
            entity.Ifsc = model.Ifsc;
            entity.Discount = model.Discount;
            entity.UpdatedBy = userId;
            entity.UpdatedOn = Utility.GetDateTime();

            if (!model.Address.Id.HasValue && model.Address.IsAllNullOrEmpty())
            {
                return;
            }

            if (entity.Address != null)
            {
                entity.Address.StreetNumber = model.Address.StreetNumber;
                entity.Address.StreetName = model.Address.StreetName;
                entity.Address.PostalCode = model.Address.PostalCode;
                entity.Address.City = model.Address.City;
                entity.Address.State = model.Address.State;
                entity.Address.CountryId = model.Address.CountryId;
                entity.Address.Phone = model.Address.Phone;
            }

            if (entity.Address == null && model.Address != null)
            {
                entity.Address = new Address
                {
                    StreetNumber = model.Address.StreetNumber,
                    StreetName = model.Address.StreetName,
                    PostalCode = model.Address.PostalCode,
                    City = model.Address.City,
                    State = model.Address.State,
                    CountryId = model.Address.CountryId,
                    Phone = model.Address.Phone
                };
            }

            if (!model.ShippingAddress.Id.HasValue && model.ShippingAddress.IsAllNullOrEmpty())
            {
                return;
            }

            if (entity.ShippingAddress != null)
            {
                entity.ShippingAddress.AddressLine1 = model.ShippingAddress.AddressLine1;
                entity.ShippingAddress.AddressLine2 = model.ShippingAddress.AddressLine2;
                entity.ShippingAddress.PostalCode = model.ShippingAddress.PostalCode;
                entity.ShippingAddress.City = model.ShippingAddress.City;
                entity.ShippingAddress.State = model.ShippingAddress.State;
                entity.ShippingAddress.CountryId = model.ShippingAddress.CountryId;
                entity.ShippingAddress.ShipTo = model.ShippingAddress.ShipTo;
                entity.ShippingAddress.DeliveryInstruction = model.ShippingAddress.DeliveryInstruction;
                entity.ShippingAddress.Phone = model.ShippingAddress.Phone;
            }

            if (entity.ShippingAddress == null && model.ShippingAddress != null)
            {
                entity.ShippingAddress = new ShippingAddress
                {
                    AddressLine1 = model.ShippingAddress.AddressLine1,
                    AddressLine2 = model.ShippingAddress.AddressLine2,
                    PostalCode = model.ShippingAddress.PostalCode,
                    City = model.ShippingAddress.City,
                    State = model.ShippingAddress.State,
                    CountryId = model.ShippingAddress.CountryId,
                    ShipTo = model.ShippingAddress.ShipTo,
                    DeliveryInstruction = model.ShippingAddress.DeliveryInstruction,
                    Phone = model.ShippingAddress.Phone
                };
            }

        }
    }
}
