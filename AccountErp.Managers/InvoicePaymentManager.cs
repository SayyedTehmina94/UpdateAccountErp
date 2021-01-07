using AccountErp.Factories;
using AccountErp.Infrastructure.DataLayer;
using AccountErp.Infrastructure.Managers;
using AccountErp.Infrastructure.Repositories;
using AccountErp.Models.Invoice;
using AccountErp.Utilities;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using AccountErp.Dtos.Invoice;

namespace AccountErp.Managers
{
    public class InvoicePaymentManager : IInvoicePaymentManager
    {
        private readonly IInvoicePaymentRepository _invoicePaymentRepository;
        private readonly IInvoiceRepository _invoiceRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly ITransactionRepository _transactionRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly string _userId;

        public InvoicePaymentManager(IHttpContextAccessor contextAccessor,
            IInvoicePaymentRepository invoicePaymentRepository, ICustomerRepository customerRepository,
             ITransactionRepository transactionRepository,IInvoiceRepository invoiceRepository,
            IUnitOfWork unitOfWork)
        {
            _userId = contextAccessor.HttpContext.User.GetUserId();
            _invoicePaymentRepository = invoicePaymentRepository;
            _invoiceRepository = invoiceRepository;
            _customerRepository = customerRepository;
            _transactionRepository = transactionRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task AddAsync(InvoicePaymentAddModel model)
        {
            if(model.PaymentType == Constants.TransactionType.InvoicePayment)
            {
                var invoiceSummary = await _invoiceRepository.GetSummaryAsunc(model.InvoiceId);

                var customerPaymentInfo = await _customerRepository.GetPaymentInfoAsync(invoiceSummary.CustomerId);

                var invoicePayment = InvoicePaymentFactory.Create(model, customerPaymentInfo.AccountNumber, invoiceSummary.TotalAmount, _userId);

                await _invoicePaymentRepository.AddAsync(invoicePayment);

                await _invoiceRepository.UpdateStatusAsync(model.InvoiceId, Constants.InvoiceStatus.Paid);

                //For Transaction Update
                await _transactionRepository.SetTransactionAccountIdForInvoice(model.InvoiceId,model.BankAccountId,model.PaymentDate,model.Description);

                await _unitOfWork.SaveChangesAsync();
            }
            else if(model.PaymentType == Constants.TransactionType.CustomerAdvancePayment)
            {
                var transaction = TransactionFactory.CreateByCustomerAdvancePayment(model,model.BankAccountId,0, model.Amount, true);
                await _transactionRepository.AddAsync(transaction);
                var transactionForCredit = TransactionFactory.CreateByCustomerAdvancePayment(model, model.CreditBankAccountId, model.Amount, 0, false);
                await _transactionRepository.AddAsync(transactionForCredit);
                await _unitOfWork.SaveChangesAsync();
            }
            else if (model.PaymentType == Constants.TransactionType.AccountIncome)
            {
                var transactionforCredit = TransactionFactory.CreateByTaxPaymentByCustomer(model, model.CreditBankAccountId, model.Amount, 0, false);
                await _transactionRepository.AddAsync(transactionforCredit);
                var transactionforDebit = TransactionFactory.CreateByTaxPaymentByCustomer(model, model.BankAccountId, 0, model.Amount, true);
                await _transactionRepository.AddAsync(transactionforDebit);
                await _unitOfWork.SaveChangesAsync();
            }

        }

        public async Task<JqDataTableResponse<InvoicePaymentListItemDto>> GetPagedResultAsync(InvoiceJqDataTableRequestModel model)
        {
            return await _invoicePaymentRepository.GetPagedResultAsync(model);
        }
    }
}
