
using AccountErp.Dtos.BankAccount;
using AccountErp.Dtos.Bill;
using AccountErp.Dtos.ChartofAccount;
using AccountErp.Dtos.Invoice;
using AccountErp.Dtos.Report;
using AccountErp.Dtos.Transaction;
using AccountErp.Entities;
using AccountErp.Infrastructure.Repositories;
using AccountErp.Models.Report;
using AccountErp.Utilities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;


namespace AccountErp.DataLayer.Repositories
{
    public class ReportRepository : IReportRepository
    {
        private readonly DataContext _dataContext;

        public ReportRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        public async Task<List<VendorReportsDto>> GetVendorReportAsync(VendorReportModel model)
        {
            List<VendorReportsDto> vendorReportsList;
            if (model.VendorId == 0)
            {
                vendorReportsList = await (from v in _dataContext.Vendors
                                           select new VendorReportsDto
                                           {
                                               VendorId = v.Id,
                                               VendorName = v.Name
                                               /*TotalAmount = model.TotalAmount,
                                               TotalPaidAmount = model.TotalPaidAmount*/

                                           }).ToListAsync();

            }
            else
            {
                vendorReportsList = await (from v in _dataContext.Vendors
                                           where v.Id == model.VendorId
                                           select new VendorReportsDto
                                           {
                                               VendorId = v.Id,
                                               VendorName = v.Name
                                               /*  TotalAmount = model.TotalAmount,
                                                 TotalPaidAmount = model.TotalPaidAmount*/

                                           }).ToListAsync();

            }

            foreach (var item in vendorReportsList)
            {
                List<BillSummaryDto> billSummaryDtosList = await (from b in _dataContext.Bills
                                                                  where b.VendorId == item.VendorId && b.Status != Constants.BillStatus.Deleted
                                                                  select new BillSummaryDto
                                                                  {
                                                                      TotalAmount = b.TotalAmount,
                                                                      status = b.Status,
                                                                      BillDate = b.BillDate
                                                                  }).ToListAsync();

                billSummaryDtosList = billSummaryDtosList.Where(p => (p.BillDate >= model.StartDate && p.BillDate <= model.EndDate)).ToList();

                item.TotalAmount = billSummaryDtosList.Sum(x => x.TotalAmount);
                item.TotalPaidAmount = billSummaryDtosList.Where(x => x.status == Constants.BillStatus.Paid).Sum(x => x.TotalAmount);
            }

            return vendorReportsList;

        }

        public async Task<List<CustomerReportsDto>> GetCustomerReportAsync(CustomerReportModel model)
        {
            List<CustomerReportsDto> customerReportsDtoList;
            if (model.CustomerId == 0)
            {
                customerReportsDtoList = await (from c in _dataContext.Customers
                                                select new CustomerReportsDto
                                                {
                                                    CustomerId = c.Id,
                                                    CustomerName = c.FirstName + " " + c.MiddleName + " " + c.LastName,
                                                    /*IncomeAmount = model.IncomeAmount,
                                                    PaidAmount = model.PaidAmount*/

                                                }).ToListAsync();
            }
            else
            {
                customerReportsDtoList = await (from c in _dataContext.Customers
                                                where c.Id == model.CustomerId
                                                select new CustomerReportsDto
                                                {
                                                    CustomerId = c.Id,
                                                    CustomerName = c.FirstName + " " + c.MiddleName + " " + c.LastName,
                                                    /*  IncomeAmount = model.IncomeAmount,
                                                      PaidAmount = model.PaidAmount*/

                                                }).ToListAsync();
            }

            foreach (var invoice in customerReportsDtoList)
            {
                List<InvoiceListItemDto> invoiceListItemDtosList = await (from v in _dataContext.Invoices
                                                                          where v.CustomerId == invoice.CustomerId && v.Status != Constants.InvoiceStatus.Deleted
                                                                          select new InvoiceListItemDto
                                                                          {
                                                                              TotalAmount = v.TotalAmount,
                                                                              Status = v.Status,
                                                                              InvoiceDate = v.InvoiceDate
                                                                          }).ToListAsync();
                invoiceListItemDtosList = invoiceListItemDtosList.Where(p => (p.InvoiceDate >= model.StartDate && p.InvoiceDate <= model.EndDate)).ToList();
                invoice.IncomeAmount = invoiceListItemDtosList.Sum(x => x.TotalAmount);
                invoice.PaidAmount = invoiceListItemDtosList.Where(x => x.Status == Constants.InvoiceStatus.Paid).Sum(x => x.TotalAmount);
            }
            return customerReportsDtoList;
        }

        public async Task<List<SalesTaxReportDto>> GetSalesTaxReportAsync(SalesReportModel model)
        {
            List<SalesTaxReportDto> salesTaxReportDtosList;
            List<InvoiceDetailDto> invoiceDetailDtoList;
            List<BillDetailDto> billDetailDtoList;
            List<TransactionDetailDto> bankAccountDetailsList;
            if (model.SalesId == 0)
            {
                salesTaxReportDtosList = await (from s in _dataContext.SalesTaxes
                                                select new SalesTaxReportDto
                                                {
                                                    SalesId = s.Id,
                                                    Tax = s.TaxPercentage + " " + s.Code,
                                                    BankAccountId = s.BankAccountId
                                                }).ToListAsync();
            }
            else
            {
                salesTaxReportDtosList = await (from s in _dataContext.SalesTaxes
                                                where s.Id == model.SalesId
                                                select new SalesTaxReportDto
                                                {
                                                    SalesId = s.Id,
                                                    Tax = s.TaxPercentage + " " + s.Code
                                                }).ToListAsync();
            }

            foreach (var salesTax in salesTaxReportDtosList)
            {
                invoiceDetailDtoList = await (from i in _dataContext.InvoiceServices
                                              join s in _dataContext.Invoices on i.InvoiceId equals s.Id
                                              where i.TaxId == salesTax.SalesId
                                              && s.Status != Constants.InvoiceStatus.Deleted
                                              select new InvoiceDetailDto
                                              {
                                                  Status = s.Status,
                                                  InvoiceDate = s.InvoiceDate,
                                                  InvoiceServiceDto = new InvoiceServiceDto
                                                  {
                                                      Rate = i.Rate,
                                                      Price = i.Price,
                                                      TaxPrice = i.TaxPrice
                                                  }

                                              }).ToListAsync();
                if (model.ReportType == 1)
                {
                    invoiceDetailDtoList = invoiceDetailDtoList.Where(p => p.Status == Constants.InvoiceStatus.Paid).ToList();
                }
                DateTime NextDate = new System.DateTime(model.StartDate.Year, model.StartDate.Month, model.StartDate.Day);

                var inv = invoiceDetailDtoList.Where(p => (p.InvoiceDate <= NextDate)).ToList();
                var invTaxAmt = inv.Sum(x => x.InvoiceServiceDto.TaxPrice);

                invoiceDetailDtoList = invoiceDetailDtoList.Where(p => (p.InvoiceDate >= model.StartDate && p.InvoiceDate <= model.EndDate && p.Status != Constants.InvoiceStatus.Overdue)).ToList();
                salesTax.SalesSubjectToTax = invoiceDetailDtoList.Sum(x => x.InvoiceServiceDto.Price);
                salesTax.TaxAmountOnSales = invoiceDetailDtoList.Sum(x => x.InvoiceServiceDto.TaxPrice);

                billDetailDtoList = await (from b in _dataContext.BillItems
                                           join bs in _dataContext.Bills on b.BillId equals bs.Id
                                           where b.TaxId == salesTax.SalesId
                                           && bs.Status != Constants.BillStatus.Deleted
                                           select new BillDetailDto
                                           {
                                               Status = bs.Status,
                                               BillDate = bs.BillDate,
                                               Bill = new BillServiceDto
                                               {
                                                   Rate = b.Rate,
                                                   Price = b.Price,
                                                   TaxPrice = b.TaxPrice
                                               }

                                           }).ToListAsync();
                if (model.ReportType == 1)
                {
                    billDetailDtoList = billDetailDtoList.Where(p => p.Status == Constants.BillStatus.Paid).ToList();
                }
                var bill = billDetailDtoList.Where(p => (p.BillDate <= model.StartDate)).ToList();
                var billTaxAmt = bill.Sum(x => x.Bill.TaxPrice);
                billDetailDtoList = billDetailDtoList.Where(p => (p.BillDate >= model.StartDate && p.BillDate <= model.EndDate && p.Status != Constants.BillStatus.Overdue)).ToList();
                salesTax.PurchaseSubjectToTax = billDetailDtoList.Sum(x => x.Bill.Price);
                salesTax.TaxAmountOnPurchases = billDetailDtoList.Sum(x => x.Bill.TaxPrice);
                salesTax.NetTaxOwing = salesTax.TaxAmountOnSales - salesTax.TaxAmountOnPurchases;
                salesTax.StartingBalance = invTaxAmt - billTaxAmt;

                bankAccountDetailsList = await (from t in _dataContext.Transaction where t.BankAccountId == salesTax.BankAccountId
                                                select new TransactionDetailDto
                                                    {
                                                        TransactionId = t.TransactionId,
                                                        BankAccountId = t.BankAccountId,
                                                        Id = t.Id,
                                                        CreditAmount = t.CreditAmount,
                                                        DebitAmount = t.DebitAmount,
                                                        TransactionDate =t.TransactionDate,
                                                        Status = t.Status,
                                                        TransactionType = t.TransactionTypeId
                                                }).ToListAsync();
                if (model.ReportType == 1)
                {
                    bankAccountDetailsList = bankAccountDetailsList.Where(p => p.Status == Constants.TransactionStatus.Paid ).ToList();
                }
                bankAccountDetailsList = bankAccountDetailsList.Where(p => (p.TransactionDate >= model.StartDate && p.TransactionDate <= model.EndDate)).ToList();
                var income = bankAccountDetailsList.Where(t => t.TransactionType.Equals(Constants.TransactionType.AccountIncome));
                var expence = bankAccountDetailsList.Where(t => t.TransactionType.Equals(Constants.TransactionType.AccountExpence));
                if (income.Equals(4))
                {
                    salesTax.LessPaymentsToGovernment = bankAccountDetailsList.Sum(x => x.CreditAmount);
                }
                else
                {
                    salesTax.LessPaymentsToGovernment = bankAccountDetailsList.Sum(x => x.DebitAmount);
                }
                //salesTax.LessPaymentsToGovernment = 2;
                salesTax.EndingBalance = salesTax.StartingBalance + salesTax.NetTaxOwing - salesTax.LessPaymentsToGovernment;
            }
            return salesTaxReportDtosList;
        }

        public async Task<List<AgedPayablesReportDto>> GetAgedPayablesReportAsync(AgedPayablesModel model)
        {
            List<AgedPayablesReportDto> agedPayablesReportsList;
            List<BillDetailDto> billDetailDtoList;
            if (model.VendorId == 0)
            {
                agedPayablesReportsList = await (from v in _dataContext.Vendors
                                                 select new AgedPayablesReportDto
                                                 {
                                                     VendorId = v.Id,
                                                     VendorName = v.Name
                                                 }).ToListAsync();
            }
            else
            {
                agedPayablesReportsList = await (from v in _dataContext.Vendors
                                                 where v.Id == model.VendorId
                                                 select new AgedPayablesReportDto
                                                 {
                                                     VendorId = v.Id,
                                                     VendorName = v.Name
                                                 }).ToListAsync();
            }

            foreach (var agedPayables in agedPayablesReportsList)
            {
                //agedPayables.Count = 0;
                billDetailDtoList = await (from b in _dataContext.Bills
                                           where b.VendorId == agedPayables.VendorId && b.Status != Constants.BillStatus.Deleted
                                           select new BillDetailDto
                                           {
                                               TotalAmount = b.TotalAmount,
                                               DueDate = b.DueDate,
                                               Status = b.Status
                                           }).ToListAsync();

                foreach (var item in billDetailDtoList)
                {
                    DateTime firstDate = new System.DateTime(item.DueDate.Value.Year, item.DueDate.Value.Month, item.DueDate.Value.Day);
                    DateTime SecondDate = new System.DateTime(model.AsOfDate.Year, model.AsOfDate.Month, model.AsOfDate.Day);

                    System.TimeSpan diff = SecondDate.Subtract(firstDate);
                    System.TimeSpan diff1 = SecondDate - firstDate;

                    String diff2 = (SecondDate - firstDate).TotalDays.ToString();
                    var date = Int16.Parse(diff2);
                    if (date <= 0)
                    {
                        agedPayables.NotYetOverDue += item.TotalAmount;
                        agedPayables.TotalAmount += item.TotalAmount;
                        agedPayables.CountNotYetOverDue++;
                    }
                    else if (date > 0 && date <= 30)
                    {
                        agedPayables.LessThan30 += item.TotalAmount;
                        agedPayables.TotalAmount += item.TotalAmount;
                        agedPayables.TotalUnpaid += item.TotalAmount;

                        agedPayables.CountLessThan30++;
                    }
                    else if (date > 30 && date <= 60)
                    {
                        agedPayables.ThirtyFirstToSixty += item.TotalAmount;
                        agedPayables.TotalAmount += item.TotalAmount;
                        agedPayables.TotalUnpaid += item.TotalAmount;
                        agedPayables.CountThirtyFirstToSixty++;
                    }
                    else if (date > 60 && date <= 90)
                    {
                        agedPayables.SixtyOneToNinety += item.TotalAmount;
                        agedPayables.TotalAmount += item.TotalAmount;
                        agedPayables.TotalUnpaid += item.TotalAmount;
                        agedPayables.CountSixtyOneToNinety++;
                    }
                    else
                    {
                        agedPayables.MoreThanNinety += item.TotalAmount;
                        agedPayables.TotalAmount += item.TotalAmount;
                        agedPayables.TotalUnpaid += item.TotalAmount;
                        agedPayables.CountMoreThanNinety++;
                    }
                }
                if (model.ReportType == 1)
                {
                    billDetailDtoList = billDetailDtoList.Where(p => p.Status == Constants.BillStatus.Paid).ToList();
                }
                billDetailDtoList = billDetailDtoList.Where(p => (p.DueDate >= model.AsOfDate)).ToList();
                agedPayables.TotalUnpaid = billDetailDtoList.Sum(x => x.TotalAmount);
            }
            return agedPayablesReportsList;
        }

        public async Task<List<AgedReceivablesReportDto>> GetAgedReceivablesReportAsync(AgedReceivablesModel model)
        {
            List<AgedReceivablesReportDto> agedReceivablesReportDtosList;
            List<InvoiceDetailDto> invoiceDetailDtoList;
            if (model.CustomerId == 0)
            {
                agedReceivablesReportDtosList = await (from c in _dataContext.Customers
                                                       select new AgedReceivablesReportDto
                                                       {
                                                           CustomerId = c.Id,
                                                           CustomerName = c.FirstName + "" + c.MiddleName + "" + c.LastName
                                                       }).ToListAsync();
            }
            else
            {
                agedReceivablesReportDtosList = await (from c in _dataContext.Customers
                                                       where c.Id == model.CustomerId
                                                       select new AgedReceivablesReportDto
                                                       {
                                                           CustomerId = c.Id,
                                                           CustomerName = c.FirstName + "" + c.MiddleName + "" + c.LastName

                                                       }).ToListAsync();
            }

            foreach (var agedReceivables in agedReceivablesReportDtosList)
            {
                var test = agedReceivables;
                invoiceDetailDtoList = await (from i in _dataContext.Invoices
                                              where i.CustomerId == agedReceivables.CustomerId && i.Status != Constants.InvoiceStatus.Deleted
                                              select new InvoiceDetailDto
                                              {
                                                  TotalAmount = i.TotalAmount,
                                                  DueDate = i.DueDate,
                                                  Status = i.Status
                                              }).ToListAsync();

                foreach (var item in invoiceDetailDtoList)
                {
                    DateTime firstDate = new System.DateTime(item.DueDate.Year, item.DueDate.Month, item.DueDate.Day);
                    DateTime SecondDate = new System.DateTime(model.AsOfDate.Year, model.AsOfDate.Month, model.AsOfDate.Day);

                    System.TimeSpan diff = SecondDate.Subtract(firstDate);
                    System.TimeSpan diff1 = SecondDate - firstDate;

                    String diff2 = (SecondDate - firstDate).TotalDays.ToString();
                    var date = Int16.Parse(diff2);
                    if (date <= 0)
                    {
                        agedReceivables.NotYetOverDue += item.TotalAmount;
                        agedReceivables.TotalAmount += item.TotalAmount;
                        agedReceivables.CountNotYetOverDue++;
                    }
                    else if (date > 0 && date <= 30)
                    {
                        agedReceivables.LessThan30 += item.TotalAmount;
                        agedReceivables.TotalAmount += item.TotalAmount;
                        agedReceivables.TotalUnpaid += item.TotalAmount;

                        agedReceivables.CountLessThan30++;
                    }
                    else if (date > 30 && date <= 60)
                    {
                        agedReceivables.ThirtyFirstToSixty += item.TotalAmount;
                        agedReceivables.TotalAmount += item.TotalAmount;
                        agedReceivables.TotalUnpaid += item.TotalAmount;
                        agedReceivables.CountThirtyFirstToSixty++;
                    }
                    else if (date > 60 && date <= 90)
                    {
                        agedReceivables.SixtyOneToNinety += item.TotalAmount;
                        agedReceivables.TotalAmount += item.TotalAmount;
                        agedReceivables.TotalUnpaid += item.TotalAmount;
                        agedReceivables.CountSixtyOneToNinety++;
                    }
                    else
                    {
                        agedReceivables.MoreThanNinety += item.TotalAmount;
                        agedReceivables.TotalAmount += item.TotalAmount;
                        agedReceivables.TotalUnpaid += item.TotalAmount;
                        agedReceivables.CountMoreThanNinety++;
                    }
                }
                if (model.ReportType == 1)
                {
                    invoiceDetailDtoList = invoiceDetailDtoList.Where(p => p.Status == Constants.InvoiceStatus.Paid).ToList();
                }
                invoiceDetailDtoList = invoiceDetailDtoList.Where(p => (p.DueDate >= model.AsOfDate)).ToList();
                agedReceivables.TotalUnpaid = invoiceDetailDtoList.Sum(x => x.TotalAmount);
            }
            return agedReceivablesReportDtosList;
        }

        public async Task<List<COADetailDto>> GetCOADetailAsyncForTrialReport()
        {
            return await (from i in _dataContext.COA_AccountMaster
                          select new COADetailDto
                          {
                              Id = i.Id,
                              AccountMasterName = i.AccountMasterName,
                              AccountTypes = i.AccountTypes.Select(x => new AccountTypeDetailDto
                              {
                                  Id = x.Id,
                                  AccountTypeName = x.AccountTypeName,
                                  COA_AccountMasterId = x.COA_AccountMasterId,
                                  BankAccount = x.BanKAccount.Select(y => new BankAccountDetailDto
                                  {
                                      Id = y.Id,
                                      AccountName = y.AccountName,
                                      AccountCode = y.AccountCode,
                                      Description = y.Description,
                                      AccountNumber = y.AccountNumber,
                                      COA_AccountTypeId = y.COA_AccountTypeId,
                                      AccountHolderName = y.AccountHolderName,
                                      Transactions = y.Transaction.Select(z => new TransactionDetailDto
                                      {
                                          TransactionId = z.TransactionId,
                                          BankAccountId = z.BankAccountId,
                                          Id = z.Id,
                                          CreditAmount = z.CreditAmount,
                                          DebitAmount = z.DebitAmount,
                                          TransactionDate = z.TransactionDate,
                                          Status = z.Status
                                      })

                                  })
                              }),

                          })
                           .AsNoTracking()
                           .ToListAsync();
        }

        public async Task<List<COADetailDto>> GetAccountBalanceReportAsync()
        {
            return await (from i in _dataContext.COA_AccountMaster
                          select new COADetailDto
                          {
                              Id = i.Id,
                              AccountMasterName = i.AccountMasterName,
                              AccountTypes = i.AccountTypes.Select(x => new AccountTypeDetailDto
                              {
                                  Id = x.Id,
                                  AccountTypeName = x.AccountTypeName,
                                  COA_AccountMasterId = x.COA_AccountMasterId,
                                  BankAccount = x.BanKAccount.Select(y => new BankAccountDetailDto
                                  {
                                      Id = y.Id,
                                      AccountName = y.AccountName,
                                      AccountCode = y.AccountCode,
                                      Description = y.Description,
                                      AccountNumber = y.AccountNumber,
                                      COA_AccountTypeId = y.COA_AccountTypeId,
                                      AccountHolderName = y.AccountHolderName,
                                      Transactions = y.Transaction.Select(z => new TransactionDetailDto
                                      {
                                          TransactionId = z.TransactionId,
                                          BankAccountId = z.BankAccountId,
                                          Id = z.Id,
                                          CreditAmount = z.CreditAmount,
                                          DebitAmount = z.DebitAmount,
                                          TransactionDate = z.TransactionDate,
                                          Status = z.Status
                                      })

                                  })
                              }),

                          })
                            .AsNoTracking()
                            .ToListAsync();
        }

        public async Task<List<COADetailDto>> GetProfitAndLossDetailsReportAsync()
        {

            return await (from a in _dataContext.COA_AccountMaster
                          where a.Id == 3 || a.Id == 4
                          select new COADetailDto
                          {
                              Id = a.Id,
                              AccountMasterName = a.AccountMasterName,
                              AccountTypes = a.AccountTypes.Select(x => new AccountTypeDetailDto
                              {
                                  Id = x.Id,
                                  AccountTypeName = x.AccountTypeName,
                                  COA_AccountMasterId = x.COA_AccountMasterId,
                                  BankAccount = x.BanKAccount.Select(y => new BankAccountDetailDto
                                  {
                                      Id = y.Id,
                                      AccountName = y.AccountName,
                                      AccountCode = y.AccountCode,
                                      Description = y.Description,
                                      AccountNumber = y.AccountNumber,
                                      COA_AccountTypeId = y.COA_AccountTypeId,
                                      AccountHolderName = y.AccountHolderName,
                                      Transactions = y.Transaction.Select(z => new TransactionDetailDto
                                      {
                                          TransactionId = z.TransactionId,
                                          BankAccountId = z.BankAccountId,
                                          Id = z.Id,
                                          CreditAmount = z.CreditAmount,
                                          DebitAmount = z.DebitAmount,
                                          TransactionDate = z.TransactionDate,
                                          Status = z.Status
                                      })

                                  })
                              }),
                          }).AsNoTracking().ToListAsync();
        }

        public async Task<List<COADetailDto>> GetBalanceSheetReportAsync()
        {
            return await (from i in _dataContext.COA_AccountMaster
                          where i.Id == 1 || i.Id == 2 || i.Id == 5
                          select new COADetailDto
                          {
                              Id = i.Id,
                              AccountMasterName = i.AccountMasterName,
                              AccountTypes = i.AccountTypes.Select(x => new AccountTypeDetailDto
                              {
                                  Id = x.Id,
                                  AccountTypeName = x.AccountTypeName,
                                  COA_AccountMasterId = x.COA_AccountMasterId,
                                  BankAccount = x.BanKAccount.Select(y => new BankAccountDetailDto
                                  {
                                      Id = y.Id,
                                      AccountName = y.AccountName,
                                      AccountCode = y.AccountCode,
                                      Description = y.Description,
                                      AccountNumber = y.AccountNumber,
                                      COA_AccountTypeId = y.COA_AccountTypeId,
                                      AccountHolderName = y.AccountHolderName,
                                      Transactions = y.Transaction.Select(z => new TransactionDetailDto
                                      {
                                          TransactionId = z.TransactionId,
                                          BankAccountId = z.BankAccountId,
                                          Id = z.Id,
                                          DebitAmount = z.DebitAmount,
                                          CreditAmount = z.CreditAmount,
                                          TransactionDate = z.TransactionDate,
                                          Status = z.Status
                                      })

                                  })
                              }),

                          })
                           .AsNoTracking()
                           .ToListAsync();
        }

        public async Task<List<COADetailDto>> GetCOADetailAsyncForAccountTransactionReport()
        {
            return await (from i in _dataContext.COA_AccountMaster
                          select new COADetailDto
                          {
                              Id = i.Id,
                              AccountMasterName = i.AccountMasterName,
                              AccountTypes = i.AccountTypes.Select(x => new AccountTypeDetailDto
                              {
                                  Id = x.Id,
                                  AccountTypeName = x.AccountTypeName,
                                  COA_AccountMasterId = x.COA_AccountMasterId,
                                  BankAccount = x.BanKAccount.Select(y => new BankAccountDetailDto
                                  {
                                      Id = y.Id,
                                      AccountName = y.AccountName,
                                      AccountCode = y.AccountCode,
                                      Description = y.Description,
                                      AccountNumber = y.AccountNumber,
                                      COA_AccountTypeId = y.COA_AccountTypeId,
                                      AccountHolderName = y.AccountHolderName,
                                      Transactions = y.Transaction.Select(z => new TransactionDetailDto
                                      {
                                          TransactionId = z.TransactionId,
                                          BankAccountId = z.BankAccountId,
                                          Id = z.Id,
                                          CreditAmount = z.CreditAmount,
                                          DebitAmount = z.DebitAmount,
                                          TransactionDate = z.TransactionDate,
                                          Status = z.Status,
                                          TransactionType = z.TransactionTypeId,
                                          ContactType = z.ContactType ?? 0,
                                          ContactId = z.ContactId ?? 0
                                      })

                                  })
                              }),

                          })
                           .AsNoTracking()
                           .ToListAsync();
        }

        public async Task<List<COADetailDto>> GetCashFlowReportAsync()
        {
            return await (from i in _dataContext.COA_AccountMaster
                          select new COADetailDto
                          {
                              Id = i.Id,
                              AccountMasterName = i.AccountMasterName,
                              AccountTypes = i.AccountTypes.Select(x => new AccountTypeDetailDto
                              {
                                  Id = x.Id,
                                  AccountTypeName = x.AccountTypeName,
                                  COA_AccountMasterId = x.COA_AccountMasterId,
                                  BankAccount = x.BanKAccount.Select(y => new BankAccountDetailDto
                                  {
                                      Id = y.Id,
                                      AccountName = y.AccountName,
                                      AccountCode = y.AccountCode,
                                      Description = y.Description,
                                      AccountNumber = y.AccountNumber,
                                      COA_AccountTypeId = y.COA_AccountTypeId,
                                      AccountHolderName = y.AccountHolderName,
                                      Transactions = y.Transaction.Select(z => new TransactionDetailDto
                                      {
                                          TransactionId = z.TransactionId,
                                          BankAccountId = z.BankAccountId,
                                          Id = z.Id,
                                          DebitAmount = z.DebitAmount,
                                          CreditAmount = z.CreditAmount,
                                          TransactionDate = z.TransactionDate,
                                          Status = z.Status,
                                          ModifyDate = z.ModifyDate ?? DateTime.Now
                                      })

                                  })
                              }),

                          })
                           .AsNoTracking()
                           .ToListAsync();
        }
        public async Task<List<TransactionDetailDto>> GetProfitAndLossDetailsForAmount()
        {
            return await (from t in _dataContext.Transaction
                          select new TransactionDetailDto
                          {
                              TransactionId = t.TransactionId,
                              BankAccountId = t.BankAccountId,
                              Id = t.Id,
                              DebitAmount = t.DebitAmount,
                              CreditAmount = t.CreditAmount,
                              TransactionDate = t.TransactionDate,
                              Status = t.Status,
                              ModifyDate = t.ModifyDate ?? DateTime.Now
                          })
                           .AsNoTracking()
                           .ToListAsync();
        }

    }
}
