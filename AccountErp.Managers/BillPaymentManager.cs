using AccountErp.Dtos.Bill;
using AccountErp.Factories;
using AccountErp.Infrastructure;
using AccountErp.Infrastructure.DataLayer;
using AccountErp.Infrastructure.Managers;
using AccountErp.Infrastructure.Repositories;
using AccountErp.Models.Bill;
using AccountErp.Models.Expense;
using AccountErp.Utilities;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace AccountErp.Managers
{
    public class BillPaymentManager : IBillPaymentManager
    {
        private readonly IBillRepository _billRepository;
        private readonly IVendorRepository _vendorRepository;
        private readonly IBankAccountRepository _bankAccountRepository;
        private readonly ITransactionRepository _transactionRepository;
        private readonly IBillPaymentRepository _billPaymentRepository;

        private readonly IUnitOfWork _unitOfWork;

        private readonly string _userId;

        public BillPaymentManager(IHttpContextAccessor contextAccessor,
            IBillRepository billRepository,
            IVendorRepository vendorRepository,
            IBillPaymentRepository billPaymentRepository,
            ITransactionRepository transactionRepository,
            IBankAccountRepository bankAccountRepository,
            IUnitOfWork unitOfWork)
        {
            _userId = contextAccessor.HttpContext.User.GetUserId();
            _billRepository = billRepository;
            _vendorRepository = vendorRepository;
            _billPaymentRepository = billPaymentRepository;
            _transactionRepository = transactionRepository;
            _bankAccountRepository = bankAccountRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task AddAsync(BillPaymentAddModel model)
        {
            if(model.PaymentType == Constants.TransactionType.BillPayment)
            {
                var billSummary = await _billRepository.GetSummaryAsunc(model.BillId);
                var vendorPaymentInfo = await _vendorRepository.GetPaymentInfoAsync(billSummary.VendorId);
                var billPayment = BillPaymentFactory.Create(model, vendorPaymentInfo.AccountNumber, billSummary.TotalAmount, _userId);

                await _billPaymentRepository.AddAsync(billPayment);
                await _billRepository.UpdateStatusAsync(model.BillId, Constants.BillStatus.Paid);

                //For Transaction Update
                await _transactionRepository.SetTransactionAccountIdForBill(model.BillId, model.BankAccountId, model.PaymentDate, model.Description);

                await _unitOfWork.SaveChangesAsync();
            }
            else if(model.PaymentType == Constants.TransactionType.VendorAdvancePayment)
            {
                var transaction = TransactionFactory.CreateByVendorAdvancePayment( model, model.BankAccountId, model.Amount, 0, true);
                await _transactionRepository.AddAsync(transaction);
                var transactionForDebit = TransactionFactory.CreateByVendorAdvancePayment(model, model.DebitBankAccountId, 0, model.Amount, false);
                await _transactionRepository.AddAsync(transactionForDebit);
                await _unitOfWork.SaveChangesAsync();
            }
            else if(model.PaymentType == Constants.TransactionType.AccountExpence)
            {
                var transactionforCredit = TransactionFactory.CreateByTaxPaymentByVendor(model,model.BankAccountId,model.Amount,0, true);
                await _transactionRepository.AddAsync(transactionforCredit);
                var transactionforDebit = TransactionFactory.CreateByTaxPaymentByVendor(model, model.DebitBankAccountId, 0, model.Amount, false);
                await _transactionRepository.AddAsync(transactionforDebit);
                await _unitOfWork.SaveChangesAsync();
            }
           
        }

        public async Task<JqDataTableResponse<BillPaymentListItemDto>> GetPagedResultAsync(ExpensePaymentJqDataTableRequestModel model)
        {
            return await _billPaymentRepository.GetPagedResultAsync(model);
        }
    }
}

