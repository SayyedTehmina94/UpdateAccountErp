using AccountErp.Dtos;
using AccountErp.Dtos.Address;
using AccountErp.Dtos.Customer;
using AccountErp.Dtos.Invoice;
using AccountErp.Dtos.ShippingAddress;
using AccountErp.Dtos.Vendor;
using AccountErp.Entities;
using AccountErp.Infrastructure.Repositories;
using AccountErp.Models.Customer;
using AccountErp.Utilities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;

namespace AccountErp.DataLayer.Repositories
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly DataContext _dataContext;

        public CustomerRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task AddAsync(Customer entity)
        {
            await _dataContext.Customers.AddAsync(entity);
        }

        public void Edit(Customer entity)
        {
            _dataContext.Customers.Update(entity);
        }

        public async Task<Customer> GetAsync(int id)
        {
            return await _dataContext.Customers.Include(x => x.Address).SingleAsync(x => x.Id == id);

        }

        public async Task<CustomerDetailDto> GetDetailAsync(int id)
        {
            return await (from c in _dataContext.Customers
                          where c.Id == id
                          select new CustomerDetailDto
                          {
                              Id = c.Id,
                              FirstName = c.FirstName,
                              MiddleName = c.MiddleName,
                              LastName = c.LastName,
                              Phone = c.Phone,
                              Email = c.Email,
                              Discount = (c.Discount ?? 0),
                              Address = new AddressDto
                              {
                                  StreetNumber = c.Address.StreetNumber,
                                  StreetName = c.Address.StreetName,
                                  PostalCode = c.Address.PostalCode,
                                  City = c.Address.City,
                                  State = c.Address.State,
                                  CountryName = c.Address.Country.Name,
                                  Phone = c.Address.Phone,
                                  CountryId = c.Address.Country.Id
                              },
                              ShippingAddress = new ShippingAddressDto
                              {
                                  Id = c.ShippingAddress.Id,
                                  AddressLine1 = c.ShippingAddress.AddressLine1,
                                  AddressLine2 = c.ShippingAddress.AddressLine2,
                                  PostalCode = c.ShippingAddress.PostalCode,
                                  City = c.ShippingAddress.City,
                                  State = c.ShippingAddress.State,
                                  CountryId = c.ShippingAddress.CountryId,
                                  ShipTo = c.ShippingAddress.ShipTo,
                                  DeliveryInstruction = c.ShippingAddress.DeliveryInstruction,
                                  Phone = c.ShippingAddress.Phone,
                                  CountryName = c.ShippingAddress.Country.Name
                              },
                              AccountNumber = c.AccountNumber,
                              BankName = c.BankName,
                              BankBranch = c.BankBranch,
                              Ifsc = c.Ifsc
                          })
                      .AsNoTracking()
                     .SingleOrDefaultAsync();
        }

        public async Task<CustomerDetailDto> GetForEditAsync(int id)
        {
            var customer = await (from c in _dataContext.Customers
                                  where c.Id == id
                                  select new CustomerDetailDto
                                  {
                                      Id = c.Id,
                                      FirstName = c.FirstName,
                                      MiddleName = c.MiddleName,
                                      LastName = c.LastName,
                                      Phone = c.Phone,
                                      Email = c.Email,
                                      Discount = c.Discount,
                                      AddressId = c.AddressId,
                                      Address = new AddressDto
                                      {
                                          Id = c.Address.Id,
                                          StreetNumber = c.Address.StreetNumber,
                                          StreetName = c.Address.StreetName,
                                          PostalCode = c.Address.PostalCode,
                                          City = c.Address.City,
                                          State = c.Address.State,
                                          CountryId = c.Address.CountryId,
                                          Phone = c.Address.Phone,
                                          CountryName = c.Address.Country.Name
                                      },
                                      ShippingAddress = new ShippingAddressDto
                                      {
                                          Id = c.ShippingAddress.Id,
                                          AddressLine1 = c.ShippingAddress.AddressLine1,
                                          AddressLine2 = c.ShippingAddress.AddressLine2,
                                          PostalCode = c.ShippingAddress.PostalCode,
                                          City = c.ShippingAddress.City,
                                          State = c.ShippingAddress.State,
                                          CountryId = c.ShippingAddress.CountryId,
                                          ShipTo = c.ShippingAddress.ShipTo,
                                          DeliveryInstruction = c.ShippingAddress.DeliveryInstruction,
                                          Phone = c.ShippingAddress.Phone
                                      },
                                      AccountNumber = c.AccountNumber,
                                      BankName = c.BankName,
                                      BankBranch = c.BankBranch,
                                      Ifsc = c.Ifsc
                                  })
                         .AsNoTracking()
                         .SingleOrDefaultAsync();

            return customer;
        }

        public async Task<JqDataTableResponse<CustomerListItemDto>> GetPagedResultAsync(CustomerJqDataTableRequestModel model)
        {
            if (model.Length == 0)
            {
                model.Length = Constants.DefaultPageSize;
            }
            var filerKey = model.Search.Value;

            var linqstmt = (from c in _dataContext.Customers
                            where c.Status != Constants.RecordStatus.Deleted && (model.FilterKey == null || EF.Functions.Like(c.FirstName, "%" + model.FilterKey + "%")
                            || EF.Functions.Like(c.LastName, "%" + model.FilterKey + "%") || EF.Functions.Like(c.Email, "%" + model.FilterKey + "%"))
                            select new CustomerListItemDto
                            {
                                Id = c.Id,
                                FirstName = c.FirstName,
                                MiddleName = c.MiddleName,
                                LastName = c.LastName,
                                Phone = c.Phone,
                                Email = c.Email,
                                AccountNumber = c.AccountNumber,
                                BankBranch = c.BankBranch,
                                Discount = (c.Discount ?? 0),
                                Status = c.Status
                            })
                           .AsNoTracking();

            var sortExpression = model.GetSortExpression();

            var pagedResult = new JqDataTableResponse<CustomerListItemDto>
            {
                RecordsTotal = await _dataContext.Customers.CountAsync(x => x.Status != Constants.RecordStatus.Deleted),
                RecordsFiltered = await linqstmt.CountAsync(),
                Data = await linqstmt.OrderBy(sortExpression).Skip(model.Start).Take(model.Length).ToListAsync()
            };
            return pagedResult;
        }

        public async Task<IEnumerable<SelectListItemDto>> GetSelectItemsAsync()
        {
            return await _dataContext.Customers
                .AsNoTracking()
                .Where(x => x.Status == Constants.RecordStatus.Active)
                .OrderBy(x => x.FirstName)
                .Select(x => new SelectListItemDto
                {
                    KeyInt = x.Id,
                    Value = (x.FirstName ?? "") + " " + (x.MiddleName ?? "") + " " + (x.LastName ?? "")
                }).ToListAsync();
        }

        public async Task ToggleStatusAsync(int id)
        {
            var customer = await _dataContext.Customers.FindAsync(id);

            if (customer.Status == Constants.RecordStatus.Active)
            {
                customer.Status = Constants.RecordStatus.Inactive;
            }
            else if (customer.Status == Constants.RecordStatus.Inactive)
            {
                customer.Status = Constants.RecordStatus.Active;
            }

            _dataContext.Customers.Update(customer);
        }

        public async Task DeleteAsync(int id)
        {
            var customer = await _dataContext.Customers.FindAsync(id);
            customer.Status = Constants.RecordStatus.Deleted;
            _dataContext.Customers.Update(customer);
        }

        public async Task<bool> IsEmailExistsAsync(string email)
        {
            return await _dataContext.Customers.AnyAsync(x => x.Email.Equals(email)
                                                              && x.Status != Constants.RecordStatus.Deleted);
        }

        public async Task<bool> IsEmailExistsAsync(int id, string email)
        {
            return await _dataContext.Customers.AnyAsync(x => x.Email.Equals(email)
                                                             && x.Id != id
                                                             && x.Status != Constants.RecordStatus.Deleted);
        }

        public async Task<CustomerPaymentInfoDto> GetPaymentInfoAsync(int id)
        {
            return await (from c in _dataContext.Customers
                          where c.Id == id
                          select new CustomerPaymentInfoDto()
                          {
                              Id = c.Id,
                              AccountNumber = c.AccountNumber,
                              BankName = c.BankName,
                              BankBranch = c.BankBranch,
                              Ifsc = c.Ifsc
                          })
                            .AsNoTracking()
                            .SingleOrDefaultAsync();
        }

        public async Task<CustomerStatementDto> GetCustomerStatementAsync(CustomerStatementDto model)
        {

            var customerStatement = await (from i in _dataContext.Invoices
                                            join c in _dataContext.Customers
                                            on i.CustomerId equals c.Id
                                           where(i.CustomerId == model.CustomerId) && i.Status != Constants.InvoiceStatus.Deleted
                                           select new CustomerStatementDto
                                           {
                                               startDate = model.startDate,
                                               endDate = model.endDate,
                                               CustomerId = model.CustomerId,
                                               openingBalance = model.openingBalance,
                                               Customer = new CustomerDetailDto
                                               {
                                                   FirstName = c.FirstName,
                                                   LastName = c.LastName,
                                                   Email = c.Email,
                                                   Phone = c.Phone,
                                                   Discount = c.Discount,
                                                   Address = new AddressDto
                                                   {
                                                       StreetNumber = c.Address.StreetNumber,
                                                       StreetName = c.Address.StreetName,
                                                       City = c.Address.City,
                                                       State = c.Address.State,
                                                       CountryName = c.Address.Country.Name,
                                                       PostalCode = c.Address.PostalCode,
                                                       Phone = c.Address.Phone
                                                   }
                                               },
                                               InvoiceList = c.Invoices.Select(x => new InvoiceListItemDto
                                               {
                                                   Id = x.Id,
                                                   CustomerId = x.CustomerId,
                                                   Description = x.Remark,
                                                   Discount = x.Discount,
                                                   InvoiceDate = x.InvoiceDate,
                                                   DueDate = x.DueDate,
                                                   //Amount = i.Services.Sum(x => x.Rate),
                                                   Tax = x.Tax,
                                                   TotalAmount = x.TotalAmount,
                                                   CreatedOn = x.CreatedOn,
                                                   InvoiceNumber = x.InvoiceNumber,
                                                   Status = x.Status
                                               })
                                           })
                          .AsNoTracking().ToListAsync();
            return customerStatement.FirstOrDefault();
        }
        public async Task<List<InvoiceListItemDto>> GetOpeningBalance(DateTime date, int custId)
        {
            var linqstmt = (from i in _dataContext.Invoices
                            join c in _dataContext.Customers
                            on i.CustomerId equals c.Id
                            where i.CustomerId == custId && i.Status != Constants.InvoiceStatus.Deleted && i.Status != Constants.InvoiceStatus.Paid && i.InvoiceDate <= date
                            select new InvoiceListItemDto
                            {
                                Id = i.Id,
                                CustomerId = i.CustomerId,
                                CustomerName = (c.FirstName ?? "") + " " + (c.MiddleName ?? "") + " " + (c.LastName ?? ""),
                                Description = i.Remark,
                                Tax = i.Tax ?? 0,
                                Amount = i.TotalAmount,
                                CreatedOn = i.CreatedOn,
                                InvoiceDate = i.InvoiceDate,
                                StrInvoiceDate = i.StrInvoiceDate,
                                DueDate = i.DueDate,
                                StrDueDate = i.StrDueDate,
                                PoSoNumber = i.PoSoNumber,
                                InvoiceNumber = i.InvoiceNumber
                            })
                            .AsNoTracking();

            return await linqstmt.ToListAsync();
        }
        public async Task<CustomerAndVendorMainDetailsDto> GetCustomerAsync()
        {
            CustomerAndVendorMainDetailsDto mainDetailsDto = new CustomerAndVendorMainDetailsDto();
            List<CustomerDetailDto> customerDetails = await (from i in _dataContext.Customers
                              select new CustomerDetailDto
                              {
                                  Id = i.Id,
                                  FirstName = i.FirstName + " " + i.MiddleName + " " + i.LastName

                              })
                           .AsNoTracking().ToListAsync();
            List<VendorDetailDto> vendorDetails = await (from i in _dataContext.Vendors
                                                             select new VendorDetailDto
                                                             {
                                                                 Id = i.Id,
                                                                 Name = i.Name

                                                             })
                          .AsNoTracking().ToListAsync();
            mainDetailsDto.CustomerTypes = customerDetails;
            mainDetailsDto.VendorTypes = vendorDetails;

            return mainDetailsDto;
        }
        
        //public async Task SetOverdueStatus()
        //{
        //    DateTime startDateTime = DateTime.Today;
        //    var linqstmt = await (from i in _dataContext.Invoices
        //                    where i.Status != Constants.InvoiceStatus.Deleted && i.Status != Constants.InvoiceStatus.Paid && i.DueDate <= startDateTime
        //                          select i
        //                    ).AsNoTracking()
        //                    .ToListAsync();

        //    foreach (var item in linqstmt)
        //    {
        //        item.Status = Constants.InvoiceStatus.Overdue;
        //        _dataContext.Invoices.Update(item);
        //    }
        //  //  _dataContext.Invoices.Update(linqstmt);

        //    //  return await linqstmt.ToListAsync();


        //}
    }

}