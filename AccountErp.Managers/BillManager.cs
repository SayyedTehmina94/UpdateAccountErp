using AccountErp.Dtos;
using AccountErp.Dtos.Bill;
using AccountErp.Factories;
using AccountErp.Infrastructure.DataLayer;
using AccountErp.Infrastructure.Managers;
using AccountErp.Infrastructure.Repositories;
using AccountErp.Models.Bill;
using AccountErp.Utilities;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccountErp.Managers
{
    public class BillManager : IBillManager
    {
        private readonly IBillRepository _repository;
        private readonly IItemRepository _itemRepository;
        private readonly IVendorRepository _vendorRepository;
        private readonly ITransactionRepository _transactionRepository;
        private readonly IUnitOfWork _unitOfWork;

        private readonly string _userId;

        public BillManager(IHttpContextAccessor contextAccessor,
            IBillRepository repository, IItemRepository itemRepository,
            IVendorRepository vendorRepository, ITransactionRepository transactionRepository,
            IUnitOfWork unitOfWork)
        {
            _userId = contextAccessor.HttpContext.User.GetUserId();
            _repository = repository;
            _itemRepository = itemRepository;
            _vendorRepository = vendorRepository;
            _transactionRepository = transactionRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task AddAsync(BillAddModel model)
        {
            //var items = (await _itemRepository.GetAsync(model.Items)).ToList();

            //model.TotalAmount = items.Sum(x => x.Rate);

            //model.Tax = items.Where(x => x.IsTaxable).Sum(x => x.Rate * x.SalesTax.TaxPercentage / 100);

            //var vendor = await _vendorRepository.GetAsync(model.VendorId);

            //if (vendor.Discount != null)
            //{
            //    model.Discount = model.TotalAmount * vendor.Discount / 100;
            //    model.TotalAmount = model.TotalAmount - (model.Discount ?? 0);
            //}

            //if (model.Tax != null)
            //{
            //    model.TotalAmount = model.TotalAmount + (model.Tax ?? 0);
            //}
            model.LineAmountSubTotal = model.Items.Sum(x => x.LineAmount);
            var count = await _repository.getCount();
            var bill = BillFactory.Create(model, _userId, count);
            await _repository.AddAsync(bill);

            await _unitOfWork.SaveChangesAsync();
            var transaction = TransactionFactory.CreateByBill(bill);
            await _transactionRepository.AddAsync(transaction);
            await _unitOfWork.SaveChangesAsync();

            var itemsList = (model.Items.GroupBy(l => l.BankAccountId, l => new { l.BankAccountId, l.LineAmount })
      .Select(g => new { GroupId = g.Key, Values = g.ToList() })).ToList();

            foreach (var item in itemsList)
            {
                var id = item.GroupId;
                var amount = item.Values.Sum(x => x.LineAmount);

                var itemsData = TransactionFactory.CreateByBillItemsAndTax(bill, id, amount);
                await _transactionRepository.AddAsync(itemsData);
                await _unitOfWork.SaveChangesAsync();
            }

            var taxlistList = (model.Items.GroupBy(l => l.TaxBankAccountId, l => new { l.TaxBankAccountId, l.TaxPrice })
       .Select(g => new { GroupId = g.Key, Values = g.ToList() })).ToList();

            foreach (var tax in taxlistList)
            {
                if(tax.GroupId > 0)
                {
                    var id = tax.GroupId;
                    var amount = tax.Values.Sum(x => x.TaxPrice);

                    var taxData = TransactionFactory.CreateByBillItemsAndTax(bill, id, amount);
                    await _transactionRepository.AddAsync(taxData);
                    await _unitOfWork.SaveChangesAsync();
                }
               
            }
        }

        public async Task Editsync(BillEditModel model)
        {
            //var items = (await _itemRepository.GetAsync(model.Items)).ToList();

            //model.TotalAmount = items.Sum(x => x.Rate);

            //model.Tax = items.Where(x => x.IsTaxable).Sum(x => x.Rate * x.SalesTax.TaxPercentage / 100);

            //var vendor = await _vendorRepository.GetAsync(model.VendorId);

            //if (vendor.Discount != null)
            //{
            //    model.Discount = model.TotalAmount * vendor.Discount / 100;
            //    model.TotalAmount = model.TotalAmount - (model.Discount ?? 0);
            //}

            //if (model.Tax != null)
            //{
            //    model.TotalAmount = model.TotalAmount + (model.Tax ?? 0);
            //}
            await _transactionRepository.DeleteTransaction(model.Id);
            var bill = await _repository.GetAsync(model.Id);

            BillFactory.Edit(bill, model, _userId);

            _repository.Edit(bill);

            await _unitOfWork.SaveChangesAsync();
            var transaction = TransactionFactory.CreateByBill(bill);
            await _transactionRepository.AddAsync(transaction);
            await _unitOfWork.SaveChangesAsync();

            var itemsList = (model.Items.GroupBy(l => l.BankAccountId, l => new { l.BankAccountId, l.LineAmount })
      .Select(g => new { GroupId = g.Key, Values = g.ToList() })).ToList();

            foreach (var item in itemsList)
            {
                var id = item.GroupId;
                var amount = item.Values.Sum(x => x.LineAmount);

                var itemsData = TransactionFactory.CreateByBillItemsAndTax(bill, id, amount);
                await _transactionRepository.AddAsync(itemsData);
                await _unitOfWork.SaveChangesAsync();
            }

            var taxlistList = (model.Items.GroupBy(l => l.TaxBankAccountId, l => new { l.TaxBankAccountId, l.TaxPrice })
       .Select(g => new { GroupId = g.Key, Values = g.ToList() })).ToList();

            foreach (var tax in taxlistList)
            {
                if (tax.GroupId > 0)
                {
                    var id = tax.GroupId;
                    var amount = tax.Values.Sum(x => x.TaxPrice);

                    var taxData = TransactionFactory.CreateByBillItemsAndTax(bill, id, amount);
                    await _transactionRepository.AddAsync(taxData);
                    await _unitOfWork.SaveChangesAsync();
                }

            }
        }

        public async Task<JqDataTableResponse<BillListItemDto>> GetPagedResultAsync(BillJqDataTableRequestModel model)
        {
            return await _repository.GetPagedResultAsync(model);
        }
        public async Task<JqDataTableResponse<BillListItemDto>> getTopFiveBillsAsync(BillJqDataTableRequestModel model)
        {
            return await _repository.getTopFiveBillsAsync(model);
        }



        

        public async Task<List<BillListItemDto>> GetRecentAsync()
        {
            return await _repository.GetRecentAsync();
        }

        public async Task<BillDetailDto> GetDetailAsync(int id)
        {
            return await _repository.GetDetailAsync(id);
        }

        public async Task<BillDetailForEditDto> GetDetailForEditAsync(int id)
        {
            return await _repository.GetDetailForEditAsync(id);
        }

        public async Task<BillSummaryDto> GetSummaryAsunc(int id)
        {

            return await _repository.GetSummaryAsunc(id);
        }

        public async Task<IEnumerable<SelectListItemDto>> GetSelectItemsAsync()
        {
            return await _repository.GetSelectItemsAsync();
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();
        }
        public async Task<int> GetBillNumber()
        {
            var count = await _repository.getCount();
            return (count + 1);
        }
        public async Task<List<BillListItemDto>> GetAllUnpaidAsync()
        {
            return await _repository.GetAllUnpaidAsync();
        }

    }
}
