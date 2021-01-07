using AccountErp.Dtos.Invoice;
using AccountErp.Entities;
using AccountErp.Infrastructure.Repositories;
using AccountErp.Models.Invoice;
using AccountErp.Utilities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;

namespace AccountErp.DataLayer.Repositories
{
    public class InvoicePaymentRepository : IInvoicePaymentRepository
    {
        private readonly DataContext _dataContext;
        public InvoicePaymentRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task AddAsync(InvoicePayment entity)
        {
            await _dataContext.InvoicePayments.AddAsync(entity);
        }

        public async Task<JqDataTableResponse<InvoicePaymentListItemDto>> GetPagedResultAsync(InvoiceJqDataTableRequestModel model)
        {
            if (model.Length == 0)
            {
                model.Length = Constants.DefaultPageSize;
            }

            var linqstmt = (from ip in _dataContext.InvoicePayments
                            join i in _dataContext.Invoices
                                on ip.InvoiceId equals i.Id
                            join c in _dataContext.Customers
                                on i.CustomerId equals c.Id
                            where (model.CustomerId == null
                                   || i.CustomerId == model.CustomerId.Value)
                                  && (model.FilterKey == null
                                      || EF.Functions.Like(i.Id.ToString(), "%" + model.FilterKey + "%")
                                      || EF.Functions.Like(c.FirstName, "%" + model.FilterKey + "%")
                                      || EF.Functions.Like(c.LastName, "%" + model.FilterKey + "%"))
                          && i.Status != Constants.InvoiceStatus.Deleted
                            select new InvoicePaymentListItemDto
                            {
                                Id = ip.Id,
                                InvoiceNumber = ip.Invoice.Id.ToString(),
                                FirstName = c.FirstName,
                                MiddleName = c.MiddleName,
                                LastName = c.LastName,
                                DepositFrom = ip.DepositFrom,
                                DepositTo = ip.BankAccount.AccountNumber,
                                PaymentMode = ip.PaymentMode,
                                Amount = ip.Amount,
                                CreatedOn = ip.CreatedOn
                            })
                              .AsNoTracking();

            var sortExpression = model.GetSortExpression();

            var pageResult = new JqDataTableResponse<InvoicePaymentListItemDto>
            {
                RecordsTotal = await _dataContext.InvoicePayments.CountAsync(x => x.Status != Constants.RecordStatus.Deleted),
                RecordsFiltered = await linqstmt.CountAsync(),
                Data = await linqstmt.OrderBy(sortExpression).ToListAsync()
            };

            return pageResult;
        }
    }
}
