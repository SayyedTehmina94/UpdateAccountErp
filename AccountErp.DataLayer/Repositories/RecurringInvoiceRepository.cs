using AccountErp.Dtos.RecurringInvoice;
using AccountErp.Entities;
using AccountErp.Infrastructure.Repositories;
using AccountErp.Utilities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using System.Linq.Dynamic.Core;
using Microsoft.EntityFrameworkCore;
using AccountErp.Models.RecurringInvoice;
using AccountErp.Dtos.Customer;
using AccountErp.Dtos.Address;

namespace AccountErp.DataLayer.Repositories
{
    public class RecurringInvoiceRepository : IRecurringInvoiceRepository
    {
        private readonly DataContext _dataContext;

        public RecurringInvoiceRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task AddAsync(RecurringInvoice entity)
        {
            await _dataContext.RecurringInvoice.AddAsync(entity);
        }

        public void Edit(RecurringInvoice entity)
        {

            _dataContext.RecurringInvoice.Update(entity);
        }

        public async Task<RecurringInvoice> GetAsync(int id)
        {
            return await _dataContext.RecurringInvoice
                .Include(x => x.Services)
                .Include(x => x.Attachments)
                .SingleAsync(x => x.Id == id);
        }

        public async Task<RecInvoiceDetailDto> GetDetailAsync(int id)
        {
            var recInvoice = await (from i in _dataContext.RecurringInvoice
                                 join c in _dataContext.Customers
                                 on i.CustomerId equals c.Id
                                 where i.Id == id
                                 select new RecInvoiceDetailDto
                                 {
                                     Id = i.Id,
                                     Tax = i.Tax,
                                     Discount = i.Discount,
                                     TotalAmount = i.TotalAmount,
                                     Remark = i.Remark,
                                     Status = i.Status,
                                     CreatedOn = i.CreatedOn,
                                     RecInvoiceDate = i.RecInvoiceDate,
                                     StrRecInvoiceDate = i.StrRecInvoiceDate,
                                     RecDueDate = i.RecDueDate,
                                     StrRecDueDate = i.StrRecDueDate,
                                     PoSoNumber = i.PoSoNumber,
                                     RecInvoiceNumber = i.RecInvoiceNumber,
                                     SubTotal = i.SubTotal,
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
                                             PostalCode = c.Address.PostalCode
                                         }
                                     },
                                     Items = i.Services.Select(x => new RecInvoiceServiceDto
                                     {
                                         Id = x.ServiceId,
                                         Type = x.Service.Name,
                                         Rate = x.Rate,
                                         Name = x.Service.Name,
                                         Description = x.Service.Description,
                                         Quantity = x.Quantity,
                                         Price = x.Price,
                                         TaxId = x.TaxId,
                                         TaxPercentage = x.TaxPercentage,
                                         TaxPrice = x.TaxPrice,
                                         LineAmount = x.LineAmount,
                                         BankAccountId = x.Service.BankAccountId,
                                         TaxBankAccountId = x.Taxes.BankAccountId

                                     }),
                                     Attachments = i.Attachments.Select(x => new RecInvoiceAttachmentDto
                                     {
                                         Id = x.Id,
                                         Title = x.Title,
                                         FileName = x.FileName,
                                         OriginalFileName = x.OriginalFileName
                                     })
                                 })
                          .AsNoTracking()
                          .SingleOrDefaultAsync();

            return recInvoice;
        }

        public async Task<RecInvoiceDetailForEditDto> GetForEditAsync(int id)
        {
            return await (from i in _dataContext.RecurringInvoice
                          join c in _dataContext.Customers
                          on i.CustomerId equals c.Id
                          where i.Id == id
                          select new RecInvoiceDetailForEditDto
                          {
                              Id = i.Id,
                              CustomerId = i.CustomerId,
                              Tax = i.Tax,
                              Discount = i.Discount,
                              TotalAmount = i.TotalAmount,
                              Remark = i.Remark,
                              RecInvoiceDate = i.RecInvoiceDate,
                              StrRecInvoiceDate = i.StrRecInvoiceDate,
                              RecDueDate = i.RecDueDate,
                              StrRecDueDate = i.StrRecDueDate,
                              PoSoNumber = i.PoSoNumber,
                              RecInvoiceNumber = i.RecInvoiceNumber,
                              SubTotal = i.SubTotal,
                              Customer = new CustomerDetailDto
                              {
                                  FirstName = c.FirstName,
                                  LastName = c.LastName,
                                  Phone = c.Phone
                              },
                              Items = i.Services.Select(x => new RecInvoiceServiceDto
                              {
                                  Id = x.ServiceId,
                                  Type = x.Service.Name,
                                  Rate = x.Rate,
                                  Name = x.Service.Name,
                                  Description = x.Service.Description,
                                  Quantity = x.Quantity,
                                  Price = x.Price,
                                  TaxId = x.TaxId,
                                  TaxPercentage = x.TaxPercentage,
                                  TaxPrice = x.TaxPrice,
                                  LineAmount = x.LineAmount,
                                  BankAccountId = x.Service.BankAccountId,
                                  TaxBankAccountId = x.Taxes.BankAccountId
                              }),
                              Attachments = i.Attachments.Select(x => new RecInvoiceAttachmentDto
                              {
                                  Id = x.Id,
                                  Title = x.Title,
                                  FileName = x.FileName,
                                  OriginalFileName = x.OriginalFileName
                              })
                          })
                           .AsNoTracking()
                           .SingleOrDefaultAsync();
        }

        public async Task<JqDataTableResponse<RecInvoiceListitemDto>> GetPagedResultAsync(RecInvoiceJqDataTableRequestModel model)
        {
            if (model.Length == 0)
            {
                model.Length = Constants.DefaultPageSize;
            }

            var linqstmt = (from i in _dataContext.RecurringInvoice
                            join c in _dataContext.Customers
                            on i.CustomerId equals c.Id
                            where (model.CustomerId == null
                                    || i.CustomerId == model.CustomerId.Value)
                                && (model.FilterKey == null
                                    || EF.Functions.Like(c.FirstName, "%" + model.FilterKey + "%")
                                    || EF.Functions.Like(c.LastName, "%" + model.FilterKey + "%"))
                            && i.Status != Constants.InvoiceStatus.Deleted
                            select new RecInvoiceListitemDto
                            {
                                Id = i.Id,
                                CustomerId = i.CustomerId,
                                CustomerName = (c.FirstName ?? "") + " " + (c.MiddleName ?? "") + " " + (c.LastName ?? ""),
                                Description = i.Remark,
                                Amount = i.Services.Sum(x => x.Rate),
                                Discount = i.Discount,
                                Tax = i.Tax,
                                TotalAmount = i.TotalAmount,
                                CreatedOn = i.CreatedOn,
                                Status = i.Status,
                                RecDueDate = i.RecDueDate,
                                RecInvoiceDate = i.RecInvoiceDate,
                                StrRecDueDate = i.StrRecDueDate,
                                StrRecInvoiceDate = i.StrRecInvoiceDate,
                                RecInvoiceNumber = i.RecInvoiceNumber,
                                SubTotal = i.SubTotal
                            })
                            .AsNoTracking();

            var sortExpresstion = model.GetSortExpression();

            var pagedResult = new JqDataTableResponse<RecInvoiceListitemDto>
            {
                RecordsTotal = await _dataContext.RecurringInvoice.CountAsync(x => model.CustomerId == null || x.CustomerId == model.CustomerId.Value),
                RecordsFiltered = await linqstmt.CountAsync(),
                Data = await linqstmt.OrderBy(sortExpresstion).Skip(model.Start).Take(model.Length).ToListAsync()
            };

            foreach (var recInvoiceListItemDto in pagedResult.Data)
            {
                recInvoiceListItemDto.CreatedOn = Utility.GetDateTime(recInvoiceListItemDto.CreatedOn, null);
            }

            return pagedResult;
        }

        public async Task<List<RecInvoiceListitemDto>> GetRecentAsync()
        {
            var linqstmt = (from i in _dataContext.RecurringInvoice
                            join c in _dataContext.Customers
                            on i.CustomerId equals c.Id
                            where i.Status != Constants.InvoiceStatus.Deleted
                            select new RecInvoiceListitemDto
                            {
                                Id = i.Id,
                                CustomerId = i.CustomerId,
                                CustomerName = (c.FirstName ?? "") + " " + (c.MiddleName ?? "") + " " + (c.LastName ?? ""),
                                Description = i.Remark,
                                Tax = i.Tax ?? 0,
                                Amount = i.TotalAmount,
                                CreatedOn = i.CreatedOn,
                                RecInvoiceDate = i.RecInvoiceDate,
                                StrRecInvoiceDate = i.StrRecInvoiceDate,
                                RecDueDate = i.RecDueDate,
                                StrRecDueDate = i.StrRecDueDate,
                                PoSoNumber = i.PoSoNumber,
                                RecInvoiceNumber = i.RecInvoiceNumber,
                                SubTotal = i.SubTotal
                            })
                            .AsNoTracking();

            return await linqstmt.OrderByDescending(x => x.CreatedOn).Take(5).ToListAsync();
        }

        public async Task<RecInvoiceSummaryDto> GetSummaryAsunc(int id)
        {
            return await (from i in _dataContext.RecurringInvoice
                          join c in _dataContext.Customers
                            on i.CustomerId equals c.Id
                          where i.Id == id
                          select new RecInvoiceSummaryDto
                          {
                              Id = i.Id,
                              CustomerId = c.Id,
                              FirstName = c.FirstName,
                              MiddleName = c.MiddleName,
                              LastName = c.LastName,
                              Amount = i.Services.Sum(x => x.Rate),
                              Tax = i.Tax,
                              Discount = i.Discount,
                              TotalAmount = i.TotalAmount,
                              Description = i.Remark,
                              Status = i.Status,
                              CreatedOn = i.CreatedOn,
                              RecInvoiceDate = i.RecInvoiceDate,
                              StrRecInvoiceDate = i.StrRecInvoiceDate,
                              RecDueDate = i.RecDueDate,
                              StrRecDueDate = i.StrRecDueDate,
                              PoSoNumber = i.PoSoNumber,
                              RecInvoiceNumber = i.RecInvoiceNumber,
                              SubTotal = i.SubTotal
                          })
                          .AsNoTracking()
                          .SingleOrDefaultAsync();
        }

        public async Task UpdateStatusAsync(int id, Constants.InvoiceStatus status)
        {
            var recInvoice = await _dataContext.RecurringInvoice.FindAsync(id);
            recInvoice.Status = status;
            _dataContext.RecurringInvoice.Update(recInvoice);
        }

        public async Task DeleteAsync(int id)
        {
            var recInvoice = await _dataContext.RecurringInvoice.FindAsync(id);
            recInvoice.Status = Constants.InvoiceStatus.Deleted;
            _dataContext.RecurringInvoice.Update(recInvoice);
        }

        public async Task<int> getCount()
        {
            int count = await _dataContext.RecurringInvoice.CountAsync();
            return count;
        }
        public async Task<List<RecListTopTenDto>> GetTopTenRecurringInvoicesAsync()
        {
            var linqstmt = await (from i in _dataContext.RecurringInvoice
                                  join c in _dataContext.Customers
                                  on i.CustomerId equals c.Id
                                  where i.Status != Constants.InvoiceStatus.Deleted
                                  select new RecListTopTenDto
                                  {
                                      Id = i.Id,
                                      CustomerId = c.Id,
                                      CustomerName = (c.FirstName ?? "") + " " + (c.MiddleName ?? "") + " " + (c.LastName ?? ""),
                                      InvoiceNumber = i.RecInvoiceNumber,
                                      Amount = i.Services.Sum(x => x.Rate),
                                      TotalAmount = i.TotalAmount,
                                      RecInvoiceDate = i.RecInvoiceDate

                                  }).AsNoTracking().OrderBy("RecInvoiceDate ASC").ToListAsync();
                            //.AsNoTracking().Take(10).OrderBy("RecInvoiceDate ASC").ToListAsync();

            return linqstmt;
        }
    }
}
