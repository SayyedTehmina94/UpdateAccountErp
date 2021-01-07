using AccountErp.Entities;
using AccountErp.Models.Vendor;
using AccountErp.Utilities;
using System;
using System.Linq;

namespace AccountErp.Factories
{
    public class VendorFactory
    {
        public static Vendor Create(VendorAddModel model, string userId)
        {
            var vendor = new Vendor
            {
                HSTNumber = model.HSTNumber,
                Name = model.Name,
                Email = model.Email,
                Fax = model.Fax,
                Phone = model.Phone,
                Website = model.Website,
                CreatedBy = userId ?? "0",
                CreatedOn = Utility.GetDateTime(),
                Status = Constants.RecordStatus.Active
            };

            return vendor;
        }

        public static void Create(VendorEditModel model, Vendor entity, string userId)
        {
            entity.HSTNumber = model.HSTNumber;
            entity.Name = model.Name;
            entity.Phone = model.Phone;
            entity.Fax = model.Fax;
            entity.Email = model.Email;
            entity.Website = model.Website;

            entity.BankBranch = model.BankBranch;
            entity.AccountNumber = model.AccountNumber;
            entity.Ifsc = model.Ifsc;
            entity.BankName = model.BankName;

            entity.UpdatedBy = userId;
            entity.UpdatedOn = DateTime.UtcNow;

            entity.Discount = model.Discount;

            if (model.BillingAddress.Id.HasValue && model.BillingAddress.Id != 0)
            {
                entity.BillingAddress.StreetNumber = model.BillingAddress.StreetNumber;
                entity.BillingAddress.StreetName = model.BillingAddress.StreetName;
                entity.BillingAddress.PostalCode = model.BillingAddress.PostalCode;
                entity.BillingAddress.City = model.BillingAddress.City;
                entity.BillingAddress.State = model.BillingAddress.State;
                entity.BillingAddress.CountryId = model.BillingAddress.CountryId;

            }
            else if (!model.BillingAddress.IsAllNullOrEmpty())
            {
                entity.BillingAddress = new Address
                {
                    StreetNumber = model.BillingAddress.StreetNumber,
                    StreetName = model.BillingAddress.StreetName,
                    PostalCode = model.BillingAddress.PostalCode,
                    City = model.BillingAddress.City,
                    State = model.BillingAddress.State,
                    CountryId = model.BillingAddress.CountryId
                };
            }

            if (model.ShippingAddress.Id.HasValue && model.ShippingAddress.Id != 0)
            {
                entity.ShippingAddress.StreetNumber = model.ShippingAddress.StreetNumber;
                entity.ShippingAddress.StreetName = model.ShippingAddress.StreetName;
                entity.ShippingAddress.PostalCode = model.ShippingAddress.PostalCode;
                entity.ShippingAddress.City = model.ShippingAddress.City;
                entity.ShippingAddress.State = model.ShippingAddress.State;
                entity.ShippingAddress.CountryId = model.ShippingAddress.CountryId;

            }
            else if (!model.ShippingAddress.IsAllNullOrEmpty())
            {
                entity.ShippingAddress = new Address
                {
                    StreetNumber = model.ShippingAddress.StreetNumber,
                    StreetName = model.ShippingAddress.StreetName,
                    PostalCode = model.ShippingAddress.PostalCode,
                    City = model.ShippingAddress.City,
                    State = model.ShippingAddress.State,
                    CountryId = model.ShippingAddress.CountryId
                };
            }

            if (!entity.Contacts.Any() && !model.Contacts.Any())
            {
                return;
            }

            var deletedContactIds = entity.Contacts.Select(x => x.Id).Except(model.Contacts.Select(y => y.Id ?? 0)).ToList();

            foreach (var deletedContactId in deletedContactIds)
            {
                var contact = entity.Contacts.Single(x => x.Id == deletedContactId);

                entity.Contacts.Remove(contact);
            }

            foreach (var contactModel in model.Contacts)
            {
                if (contactModel.IsAllNullOrEmpty())
                {
                    continue;
                }

                if (!contactModel.Id.HasValue)
                {
                    var contact = new Contact
                    {
                        FirstName = contactModel.FirstName,
                        MiddleName = contactModel.MiddleName,
                        LastName = contactModel.LastName,
                        JobTitle = contactModel.JobTitle,
                        Phone = contactModel.Phone,
                        Email = contactModel.Email,
                    };

                    if (!contactModel.Address.IsAllNullOrEmpty())
                    {
                        contact.Address = new Address
                        {
                            StreetNumber = contactModel.Address.StreetNumber,
                            StreetName = contactModel.Address.StreetName,
                            PostalCode = contactModel.Address.PostalCode,
                            City = contactModel.Address.City,
                            State = contactModel.Address.State,
                            CountryId = contactModel.Address.CountryId
                        };
                    }

                    entity.Contacts.Add(contact);
                }
                else if(contactModel.Id.Value != 0)
                {
                    var contact = entity.Contacts.Single(x => x.Id == contactModel.Id);

                    contact.FirstName = contactModel.FirstName;
                    contact.MiddleName = contactModel.MiddleName;
                    contact.LastName = contactModel.LastName;
                    contact.JobTitle = contactModel.JobTitle;
                    contact.Phone = contactModel.Phone;
                    contact.Email = contactModel.Email;

                    if (contact.AddressId.HasValue)
                    {
                        contact.Address.StreetNumber = contactModel.Address.StreetNumber;
                        contact.Address.StreetName = contactModel.Address.StreetName;
                        contact.Address.PostalCode = contactModel.Address.PostalCode;
                        contact.Address.City = contactModel.Address.City;
                        contact.Address.State = contactModel.Address.State;
                        contact.Address.CountryId = contactModel.Address.CountryId;
                    }
                    else if (!contactModel.Address.IsAllNullOrEmpty())
                    {
                        contact.Address = new Address
                        {
                            StreetNumber = contactModel.Address.StreetNumber,
                            StreetName = contactModel.Address.StreetName,
                            PostalCode = contactModel.Address.PostalCode,
                            City = contactModel.Address.City,
                            State = contactModel.Address.State,
                            CountryId = contactModel.Address.CountryId
                        };
                    }
                }
            }
        }
    }
}


