using AccountErp.Dtos;
using AccountErp.Dtos.Address;
using AccountErp.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Repositories
{
    public interface IAddressRepository
    {
        Task<int> AddAsync(Address entity);
        void Edit(Address entity);
        Task<Address> GetAsync(int id);
    }
}
