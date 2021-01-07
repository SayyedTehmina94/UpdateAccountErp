using AccountErp.Dtos.Transaction;
using AccountErp.Infrastructure.DataLayer;
using AccountErp.Infrastructure.Managers;
using AccountErp.Infrastructure.Repositories;
using AccountErp.Models.Transaction;
using AccountErp.Utilities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace AccountErp.Managers
{
    public class TransactionManager: ITransactionManager
    {
        private readonly ITransactionRepository _transactionRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly string _userId;


        public TransactionManager(IHttpContextAccessor contextAccessor,
           IInvoiceRepository invoiceRepository,
           IUnitOfWork unitOfWork,
           IItemRepository itemRepository,
            ITransactionRepository transactionRepository,
           ICustomerRepository customerRepository)
        {
            _userId = contextAccessor.HttpContext.User.GetUserId();
            //_invoiceRepository = invoiceRepository;
            //_itemRepository = itemRepository;
            //_customerRepository = customerRepository;
            _transactionRepository = transactionRepository;
            _unitOfWork = unitOfWork;
        }
        //async Task<JqDataTableResponse<TransactionListItemDto>> ITransactionManager.GetPagedResultAsync(TransactionJqDataTableRequestModel model)
        //{
        //    return await _transactionRepository.GetPagedResultAsync(model);
        //}

        async Task<JqDataTableResponse<TransactionListItemDto>> ITransactionManager.GetPagedResultAsync(TransactionJqDataTableRequestModel model)
        {
           return await _transactionRepository.GetPagedResultAsync(model);
        }
    }
}
