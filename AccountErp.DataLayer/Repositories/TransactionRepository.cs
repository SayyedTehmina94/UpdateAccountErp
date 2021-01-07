using AccountErp.Entities;
using AccountErp.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using System.Linq.Dynamic.Core;
using Microsoft.EntityFrameworkCore;
using AccountErp.Utilities;
using AccountErp.Dtos.Transaction;
using AccountErp.Models.Transaction;

namespace AccountErp.DataLayer.Repositories
{
    public class TransactionRepository: ITransactionRepository
    {
        private readonly DataContext _dataContext;

        public TransactionRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task AddAsync(Transaction entity)
        {
            await _dataContext.Transaction.AddAsync(entity);
        }

        public async Task SetTransactionAccountIdForInvoice(int invoiceId, int? AccId, DateTime date, string desc)
        {
            var linqstmt = await (from t in _dataContext.Transaction
                                  where t.TransactionId == invoiceId
                                  select t
                            ).AsNoTracking()
                            .ToListAsync();

            foreach (var item in linqstmt)
            {
               if(item.BankAccountId == 1)
                {
                    item.BankAccountId = AccId;
                    item.Description = desc;
                }
                item.ModifyDate = date;
                item.Status = Utilities.Constants.TransactionStatus.Paid;
                _dataContext.Transaction.Update(item);
            }
           
        }
        public async Task SetTransactionAccountIdForBill(int billId, int? AccId, DateTime date ,string desc)
        {
            var linqstmt = await (from t in _dataContext.Transaction
                                  where t.TransactionId == billId
                                  select t
                            ).AsNoTracking()
                            .ToListAsync();

            foreach (var item in linqstmt)
            {
                if (item.BankAccountId == 2)
                {
                    item.BankAccountId = AccId;
                    item.Description = desc;
                }
                item.ModifyDate = date;
                item.Status = Utilities.Constants.TransactionStatus.Paid;
                _dataContext.Transaction.Update(item);
            }

        }

        public async Task DeleteTransaction(int id)
        {
           var delItem = await _dataContext.Transaction.Where(x => x.TransactionId == id && x.Status != Constants.TransactionStatus.Paid).ToListAsync();
            foreach(var item in delItem)
            {
                _dataContext.Transaction.Remove(item);
            }
        }

        public async Task<JqDataTableResponse<TransactionListItemDto>> GetPagedResultAsync(TransactionJqDataTableRequestModel model)
        {
            if (model.Length == 0)
            {
                model.Length = Constants.DefaultPageSize;
            }

            var linqstmt = (from i in _dataContext.Transaction
                            join b in _dataContext.BankAccounts
                            on i.BankAccountId equals b.Id
                            join c in _dataContext.Customers
                            on i.ContactId equals c.Id into cust
                            from c in cust.DefaultIfEmpty()
                            join v in _dataContext.Vendors
                           on i.ContactId equals v.Id into vend
                            from v in vend.DefaultIfEmpty()
                            where i.isForTransEntry == true
                            && (model.FilterKey == null
                                || EF.Functions.Like(v.Name, "%" + model.FilterKey + "%")
                                || EF.Functions.Like(c.FirstName, "%" + model.FilterKey + "%")
                                 || EF.Functions.Like(c.LastName, "%" + model.FilterKey + "%")
                                  || EF.Functions.Like(c.MiddleName, "%" + model.FilterKey + "%"))


                            select new TransactionListItemDto
                            {
                                Id = i.Id,
                                TransactionId=i.TransactionId,
                                BankAccountName=b.AccountName,
                                Description=i.Description,
                                TransactionDate=i.TransactionDate,
                                DebitAmount=i.DebitAmount,
                                CreditAmount=i.CreditAmount,
                                Status=i.Status,
                                TransactionType=i.TransactionTypeId,
                                ContactName = (Constants.ContactType)i.ContactType == 0 ? (c.FirstName ?? "") + " " + (c.MiddleName ?? "") + " " + (c.LastName ?? "") : (v.Name ?? ""),
                                isForTransEntry = i.isForTransEntry,
                                amount=(int)i.TransactionTypeId==0 && (int)i.TransactionTypeId == 1 && (int)i.TransactionTypeId == 4 ? i.DebitAmount:i.CreditAmount,
                                //ContactType = (Constants.ContactType)i.ContactType,
                                //ContactId= (int)i.ContactId,

                            })
                            .AsNoTracking();


            var sortExpresstion = model.GetSortExpression();

            var pagedResult = new JqDataTableResponse<TransactionListItemDto>
            {
                RecordsTotal = await _dataContext.Transaction.CountAsync(),
                RecordsFiltered = await linqstmt.CountAsync(),
                Data = await linqstmt.OrderBy(sortExpresstion).Skip(model.Start).Take(model.Length).ToListAsync()
            };

            foreach (var transactionListItemDto in pagedResult.Data)
            {
                transactionListItemDto.TransactionDate = Utility.GetDateTime(transactionListItemDto.TransactionDate, null);
                transactionListItemDto.ModifyDate = Utility.GetDateTime(transactionListItemDto.ModifyDate, null);
            }
           

            return pagedResult;
        }

    }


}
