using AccountErp.Dtos.Quotation;
using AccountErp.Factories;
using AccountErp.Infrastructure.DataLayer;
using AccountErp.Infrastructure.Managers;
using AccountErp.Infrastructure.Repositories;
using AccountErp.Models.Quotation;
using AccountErp.Utilities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccountErp.Managers
{
    public class QuotationManager : IQuotationManager
    {
        private readonly IQuotationRepository _quotationRepository;
        private readonly IItemRepository _itemRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly IUnitOfWork _unitOfWork;

        private readonly string _userId;

        public QuotationManager(IHttpContextAccessor contextAccessor,
            IQuotationRepository quotationRepository,
            IUnitOfWork unitOfWork,
            IItemRepository itemRepository,
            ICustomerRepository customerRepository)
        {
            _userId = contextAccessor.HttpContext.User.GetUserId();
            _quotationRepository = quotationRepository;
            _itemRepository = itemRepository;
            _customerRepository = customerRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task AddAsync(QuotationAddModel model)
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
            var count = await _quotationRepository.getCount();

            //await _invoiceRepository.AddAsync(InvoiceFactory.Create(model, _userId, items));
            await _quotationRepository.AddAsync(QuotationFactory.Create(model, _userId, count));

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task EditAsync(QuotationEditModel model)
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

            var invoice = await _quotationRepository.GetAsync(model.Id);

            //InvoiceFactory.Create(model, invoice, _userId, items);
            QuotationFactory.EditInvoice(model, invoice, _userId);

            _quotationRepository.Edit(invoice);

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task<QuotationDetailDto> GetDetailAsync(int id)
        {
            return await _quotationRepository.GetDetailAsync(id);
        }

        public async Task<QuotationDeatilForEditDto> GetForEditAsync(int id)
        {
            return await _quotationRepository.GetForEditAsync(id);
        }

        public async Task<JqDataTableResponse<QuotationListItemDto>> GetPagedResultAsync(QuotationJqDataTableRequestModel model)
        {
            return await _quotationRepository.GetPagedResultAsync(model);
        }

        public async Task<List<QuotationListItemDto>> GetRecentAsync()
        {
            return await _quotationRepository.GetRecentAsync();
        }

        public async Task<QuotationSummary> GetSummaryAsunc(int id)
        {
            return await _quotationRepository.GetSummaryAsunc(id);
        }

        public async Task DeleteAsync(int id)
        {
            await _quotationRepository.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();
        }
        public async Task<int> GetQuotationNumber()
        {
            var count = await _quotationRepository.getCount();
            return (count + 1);
        }
    }
}

