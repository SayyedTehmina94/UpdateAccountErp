using AccountErp.Dtos.Bill;
using AccountErp.Entities;
using AccountErp.Infrastructure.Repositories;
using AccountErp.Models.Expense;
using AccountErp.Utilities;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;

namespace AccountErp.DataLayer.Repositories
{
    public class BillPaymentRepository : IBillPaymentRepository
    {
        private readonly DataContext _dataContext;

        public BillPaymentRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task AddAsync(BillPayment entity)
        {
            await _dataContext.BillPayments.AddAsync(entity);
        }

        public async Task<JqDataTableResponse<BillPaymentListItemDto>> GetPagedResultAsync(ExpensePaymentJqDataTableRequestModel model)
        {
            if (model.Length == 0)
            {
                model.Length = Constants.DefaultPageSize;
            }

            var linqstmt = (from bp in _dataContext.BillPayments
                            join b in _dataContext.Bills
                                on bp.BillId equals b.Id
                            join v in _dataContext.Vendors
                                on b.VendorId equals v.Id
                            where (model.VendorId == null
                                   || b.VendorId == model.VendorId.Value)
                                  && (model.FilterKey == null
                                      || EF.Functions.Like(b.Id.ToString(), "%" + model.FilterKey + "%")
                                      || EF.Functions.Like(v.Name, "%" + model.FilterKey + "%")
                                      || EF.Functions.Like(v.HSTNumber, "%" + model.FilterKey + "%"))
                            select new BillPaymentListItemDto
                            {
                                Id = bp.Id,
                                ReferenceNumber = bp.BillId.ToString(),
                                VendorName = bp.Bill.Vendor.Name,
                                PaymentMode = bp.PaymentMode,
                                PaymentAmount = bp.Amount,
                                DepositFrom = bp.BankAccount.AccountNumber,
                                DepositTo = bp.DepositTo,
                                CreatedOn = bp.CreatedOn
                            })
                            .AsNoTracking();

            var sortExpression = model.GetSortExpression();

            var pagedResult = new JqDataTableResponse<BillPaymentListItemDto>
            {
                RecordsTotal = await _dataContext.BillPayments.CountAsync(x => x.Status != Constants.RecordStatus.Deleted),
                RecordsFiltered = await linqstmt.CountAsync(),
                Data = await linqstmt.OrderBy(sortExpression).Skip(model.Start).Take(model.Length).ToListAsync()
            };

            return pagedResult;
        }

    }
}
