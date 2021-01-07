using AccountErp.Dtos;
using AccountErp.Dtos.Address;
using AccountErp.Dtos.Contact;
using AccountErp.Dtos.Vendor;
using AccountErp.Entities;
using AccountErp.Infrastructure.Repositories;
using AccountErp.Models.Vendor;
using AccountErp.Utilities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;

namespace AccountErp.DataLayer.Repositories
{
    public class VendorRepository : IVendorRepository
    {
        private readonly DataContext _dataContext;

        public VendorRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task AddAsync(Vendor entity)
        {
            await _dataContext.Vendors.AddAsync(entity);
        }

        public void Edit(Vendor entity)
        {
            _dataContext.Vendors.Update(entity);
        }

        public async Task<Vendor> GetAsync(int id)
        {
            return await _dataContext.Vendors
                .Include(x => x.BillingAddress)
                .Include(x => x.ShippingAddress)
                .Include(x => x.Contacts)
                .ThenInclude(y => y.Address)
                .Where(x => x.Id == id)
                .SingleOrDefaultAsync();
        }

        public async Task<VendorDetailDto> GetDetailAsync(int id)
        {
            return await (from v in _dataContext.Vendors
                          where v.Id == id && v.Status != Constants.RecordStatus.Deleted
                          select new VendorDetailDto
                          {
                              Id = v.Id,
                              HSTNumber = v.HSTNumber,
                              Name = v.Name,
                              Phone = v.Phone,
                              Email = v.Email,
                              Fax = v.Fax,
                              Website = v.Website,
                              BillingAddress = new AddressDto
                              {
                                  StreetNumber = v.BillingAddress.StreetNumber,
                                  StreetName = v.BillingAddress.StreetName,
                                  PostalCode = v.BillingAddress.PostalCode,
                                  City = v.BillingAddress.City,
                                  State = v.BillingAddress.State,
                                  CountryName = v.BillingAddress.Country.Name,
                                  CountryId = v.BillingAddress.Country.Id

                              },
                              ShippingAddress = new AddressDto
                              {
                                  StreetNumber = v.ShippingAddress.StreetNumber,
                                  StreetName = v.ShippingAddress.StreetName,
                                  PostalCode = v.ShippingAddress.PostalCode,
                                  City = v.ShippingAddress.City,
                                  State = v.ShippingAddress.State,
                                  CountryName = v.ShippingAddress.Country.Name,
                                  CountryId = v.ShippingAddress.CountryId
                              },
                              BankBranch = v.BankBranch,
                              AccountNumber = v.AccountNumber,
                              Ifsc = v.Ifsc,
                              BankName = v.BankName,

                              Contacts = v.Contacts.Select(c => new ContactDto
                              {
                                  FirstName = c.FirstName,
                                  MiddleName = c.MiddleName,
                                  LastName = c.LastName,
                                  JobTitle = c.JobTitle,
                                  Phone = c.Phone,
                                  Email = c.Email,
                                  Address = new AddressDto
                                  {
                                      StreetNumber = c.Address.StreetNumber,
                                      StreetName = c.Address.StreetName,
                                      PostalCode = c.Address.PostalCode,
                                      City = c.Address.City,
                                      State = c.Address.State,
                                      CountryName = c.Address.Country.Name
                                  }
                              }),
                              Discount = v.Discount
                          })
                         .AsNoTracking()
                         .SingleOrDefaultAsync();
        }

        public async Task<VendorDetailDto> GetForEditAsync(int id)
        {
            return await (from v in _dataContext.Vendors.AsNoTracking()
                          where v.Id == id && v.Status != Constants.RecordStatus.Deleted
                          select new VendorDetailDto
                          {
                              Id = v.Id,
                              HSTNumber = v.HSTNumber,
                              Name = v.Name,
                              Phone = v.Phone,
                              Email = v.Email,
                              Fax = v.Fax,
                              Website = v.Website,
                              BillingAddressId = v.BillingAddressId,
                              ShippingAddressId = v.ShippingAddressId,
                              BillingAddress = new AddressDto
                              {
                                  Id = v.BillingAddress.Id,
                                  StreetNumber = v.BillingAddress.StreetNumber,
                                  StreetName = v.BillingAddress.StreetName,
                                  PostalCode = v.BillingAddress.PostalCode,
                                  City = v.BillingAddress.City,
                                  State = v.BillingAddress.State,
                                  //CountryId = v.BillingAddress.CountryId,
                                  CountryId = v.BillingAddress.Country.Id,
                                  CountryName = v.BillingAddress.Country.Name,
                              },
                              ShippingAddress = new AddressDto
                              {
                                  Id = v.ShippingAddress.Id,
                                  StreetNumber = v.ShippingAddress.StreetNumber,
                                  StreetName = v.ShippingAddress.StreetName,
                                  PostalCode = v.ShippingAddress.PostalCode,
                                  City = v.ShippingAddress.City,
                                  State = v.ShippingAddress.State,
                                  CountryId = v.ShippingAddress.CountryId
                              },

                              BankBranch = v.BankBranch,
                              AccountNumber = v.AccountNumber,
                              Ifsc = v.Ifsc,
                              BankName = v.BankName,

                              Contacts = v.Contacts.Select(c => new ContactDto
                              {
                                  Id = c.Id,
                                  FirstName = c.FirstName,
                                  MiddleName = c.MiddleName,
                                  LastName = c.LastName,
                                  JobTitle = c.JobTitle,
                                  Phone = c.Phone,
                                  Email = c.Email,
                                  AddressId = c.AddressId,
                                  Address = new AddressDto
                                  {
                                      Id = c.Address.Id,
                                      StreetNumber = c.Address.StreetNumber,
                                      StreetName = c.Address.StreetName,
                                      PostalCode = c.Address.PostalCode,
                                      City = c.Address.City,
                                      State = c.Address.State,
                                      CountryId = c.Address.CountryId
                                  }
                              }),
                              Discount = v.Discount
                          })
                         .SingleOrDefaultAsync();
        }

        public async Task<VendorPersonallnfoDto> GetPersonalInfoAsync(int id)
        {
            return await (from v in _dataContext.Vendors
                          where v.Id == id
                          select new VendorPersonallnfoDto
                          {
                              Id = v.Id,
                              HSTNumber = v.HSTNumber,
                              Name = v.Name,
                              Email = v.Email,
                              Phone = v.Phone,
                              Discount = v.Discount
                          })
                .AsNoTracking()
                .SingleOrDefaultAsync();
        }

        public async Task<VendorPaymentInfoDto> GetPaymentInfoAsync(int id)
        {
            return await (from v in _dataContext.Vendors
                          where v.Id == id
                          select new VendorPaymentInfoDto
                          {
                              Id = v.Id,
                              AccountNumber = v.AccountNumber,
                              BankName = v.BankName,
                              BankBranch = v.BankBranch,
                              Ifsc = v.Ifsc
                          })
                .AsNoTracking()
                .SingleOrDefaultAsync();
        }

        public async Task<JqDataTableResponse<VendorListItemDto>> GetPagedResultAsync(VendorJqDataTableRequestModel model)
        {
            if (model.Length == 0)
            {
                model.Length = Constants.DefaultPageSize;
            }

            var filterKey = model.Search.Value;

            var linqStmt = (from v in _dataContext.Vendors
                            where v.Status != Constants.RecordStatus.Deleted
                                  && (model.FilterKey == null
                                      || EF.Functions.Like(v.Name, "%" + model.FilterKey + "%")
                                      || EF.Functions.Like(v.Email, "%" + model.FilterKey + "%"))
                            select new VendorListItemDto
                            {
                                Id = v.Id,
                                HSTNumber = v.HSTNumber,
                                Name = v.Name,
                                Email = v.Email,
                                Phone = v.Phone,
                                Fax = v.Fax,
                                Website = v.Website,
                                Status = v.Status
                            })
                            .AsNoTracking();
            var sortExpression = model.GetSortExpression();
            var pagedResult = new JqDataTableResponse<VendorListItemDto>
            {
                RecordsTotal = await _dataContext.Vendors.CountAsync(x => x.Status != Constants.RecordStatus.Deleted),
                RecordsFiltered = await linqStmt.CountAsync(),
                Data = await linqStmt.OrderBy(sortExpression).Skip(model.Start)
                .Take(model.Length)
                .ToListAsync()
            };
            return pagedResult;
        }

        public async Task<bool> IsEmailExistsAsync(string email)
        {
            return await _dataContext.Vendors.AnyAsync(
                x => x.Email.Equals(email) && x.Status != Constants.RecordStatus.Deleted);
        }

        public async Task<bool> IsEmailExistsAsync(int id, string email)
        {
            return await _dataContext.Vendors.AnyAsync(
                x => x.Email.Equals(email)
                && x.Id != id
                && x.Status != Constants.RecordStatus.Deleted);
        }

        public async Task<bool> IsAccountNumberExistsAsync(string accountNumber)
        {
            return await _dataContext.Vendors.AnyAsync(x => x.AccountNumber == accountNumber);
        }

        public async Task<bool> IsAccountNumberExistsForEditAsync(int id, string accountNumber)
        {
            return await _dataContext.Vendors.AnyAsync(x => x.AccountNumber == accountNumber && x.Id != id);
        }

        public async Task<IEnumerable<SelectListItemDto>> GetSelectItemsAsync()
        {
            return await _dataContext.Vendors
                .AsNoTracking()
                .Where(x => x.Status == Constants.RecordStatus.Active)
                .OrderBy(x => x.Name)
                .Select(x => new SelectListItemDto
                {
                    KeyInt = x.Id,
                    Value = x.Name
                }).ToListAsync();
        }

        public async Task ToggleStatusAsync(int id)
        {
            var vendor = await _dataContext.Vendors.FindAsync(id);

            if (vendor.Status == Constants.RecordStatus.Active)
            {
                vendor.Status = Constants.RecordStatus.Inactive;
            }
            else if (vendor.Status == Constants.RecordStatus.Inactive)
            {
                vendor.Status = Constants.RecordStatus.Active;
            }

            _dataContext.Vendors.Update(vendor);
        }

        public async Task DeleteAsync(int id)
        {
            var vendor = await _dataContext.Vendors.FindAsync(id);
            vendor.Status = Constants.RecordStatus.Deleted;
            _dataContext.Vendors.Update(vendor);
        }

        public async Task<int> GetCountAsync()
        {
            return await _dataContext.Vendors.CountAsync();
        }

        public async Task<int> GetCountAsync(DateTime createdOn)
        {
            return await _dataContext.Vendors.CountAsync(x => x.CreatedOn.Date == createdOn);
        }
    }
}
