using AccountErp.Dtos.RecurringInvoice;
using AccountErp.Factories;
using AccountErp.Infrastructure.DataLayer;
using AccountErp.Infrastructure.Managers;
using AccountErp.Infrastructure.Repositories;
using AccountErp.Models.RecurringInvoice;
using AccountErp.Utilities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccountErp.Managers
{
    public class RecurringInvoiceManager : IRecurringInvoiceManager
    {
        private readonly IRecurringInvoiceRepository _recInvoiceRepository;
        private readonly IItemRepository _itemRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly IUnitOfWork _unitOfWork;

        private readonly string _userId;

        public RecurringInvoiceManager(IHttpContextAccessor contextAccessor,
            IRecurringInvoiceRepository recInvoiceRepository,
            IUnitOfWork unitOfWork,
            IItemRepository itemRepository,
            ICustomerRepository customerRepository)
        {
            _userId = contextAccessor.HttpContext.User.GetUserId();
            _recInvoiceRepository = recInvoiceRepository;
            _itemRepository = itemRepository;
            _customerRepository = customerRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task AddAsync(RecInvoiceAddModel model)
        {
            // var items = (await _itemRepository.GetAsync(model.Items)).ToList();

            //model.TotalAmount = items.Sum(x => x.Rate);

            //model.Tax = items.Where(x => x.IsTaxable).Sum(x => x.Rate * x.SalesTax.TaxPercentage / 100);

            //var customer = await _customerRepository.GetAsync(model.CustomerId);

            //if (customer.Discount != null)
            //{
            //    model.Discount = model.TotalAmount * customer.Discount / 100;
            //    model.TotalAmount = model.TotalAmount - (model.Discount ?? 0);
            //}

            //if (model.Tax != null)
            //{
            //    model.TotalAmount = model.TotalAmount + (model.Tax ?? 0);
            //}
            model.LineAmountSubTotal = model.Items.Sum(x => x.LineAmount);
            var count = await _recInvoiceRepository.getCount();

            //await _invoiceRepository.AddAsync(InvoiceFactory.Create(model, _userId, items));
            await _recInvoiceRepository.AddAsync(RecurringInvoiceFactory.Create(model, _userId, count));

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task EditAsync(RecInvoiceEditModel model)
        {
            //var items = (await _itemRepository.GetAsync(model.Items)).ToList();

            //model.TotalAmount = items.Sum(x => x.Rate);

            //model.Tax = items.Where(x => x.IsTaxable).Sum(x => x.Rate * x.SalesTax.TaxPercentage / 100);

            //var customer = await _customerRepository.GetAsync(model.CustomerId);

            //if (customer.Discount != null)
            //{
            //    model.Discount = model.TotalAmount * customer.Discount / 100;
            //    model.TotalAmount = model.TotalAmount - (model.Discount ?? 0);
            //}

            //if (model.Tax != null)
            //{
            //    model.TotalAmount = model.TotalAmount + (model.Tax ?? 0);
            //}

            var invoice = await _recInvoiceRepository.GetAsync(model.Id);

            //InvoiceFactory.Create(model, invoice, _userId, items);
            RecurringInvoiceFactory.EditInvoice(model, invoice, _userId);

            _recInvoiceRepository.Edit(invoice);

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task<RecInvoiceDetailDto> GetDetailAsync(int id)
        {
            return await _recInvoiceRepository.GetDetailAsync(id);
        }

        public async Task<RecInvoiceDetailForEditDto> GetForEditAsync(int id)
        {
            return await _recInvoiceRepository.GetForEditAsync(id);
        }

        public async Task<JqDataTableResponse<RecInvoiceListitemDto>> GetPagedResultAsync(RecInvoiceJqDataTableRequestModel model)
        {
            return await _recInvoiceRepository.GetPagedResultAsync(model);
        }

        public async Task<List<RecInvoiceListitemDto>> GetRecentAsync()
        {
            return await _recInvoiceRepository.GetRecentAsync();
        }

        public async Task<RecInvoiceSummaryDto> GetSummaryAsunc(int id)
        {
            return await _recInvoiceRepository.GetSummaryAsunc(id);
        }

        public async Task DeleteAsync(int id)
        {
            await _recInvoiceRepository.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task<int> GetRecInvoiceNumber()
        {
            var count = await _recInvoiceRepository.getCount();
            return (count + 1);
        }
        public async Task<RecInvoiceCountDto> GetTopTenRecurringInvoicesAsync()
        {
            RecInvoiceCountDto recInvoiceCount = new RecInvoiceCountDto();
            List<RecListTopTenDto> recListTopTensList = await _recInvoiceRepository.GetTopTenRecurringInvoicesAsync();
            recInvoiceCount.RecListTopTenDtos = recListTopTensList.Take(5).ToList();
            recInvoiceCount.Count = recListTopTensList.Count;
            return recInvoiceCount;
        }

    }
}