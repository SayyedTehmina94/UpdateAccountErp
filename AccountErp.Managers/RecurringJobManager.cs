using AccountErp.Infrastructure.DataLayer;
using AccountErp.Infrastructure.Managers;
using AccountErp.Infrastructure.Repositories;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace AccountErp.Managers
{
    public class RecurringJobManager : IRecurringJobManager
    {
        private readonly IRecurringJobRepository _recurringJobRepository;
        private readonly IUnitOfWork _unitOfWork;


        public RecurringJobManager(IRecurringJobRepository recurringJobRepository,
            IUnitOfWork unitOfWork)
        {
            _recurringJobRepository = recurringJobRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task SetOverdueStatus()
        {
            await _recurringJobRepository.SetOverdueStatus();
            await _recurringJobRepository.SetOverdueStatusBill();
            await _unitOfWork.SaveChangesAsync();
        }

    }
}
