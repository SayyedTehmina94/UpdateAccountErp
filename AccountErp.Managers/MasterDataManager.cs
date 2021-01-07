using AccountErp.Dtos;
using AccountErp.Infrastructure.Managers;
using AccountErp.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace AccountErp.Managers
{
    public class MasterDataManager : IMasterDataManager
    {
        private readonly IItemTypeRepository _itemTypeRepository;
        private readonly ICountryRepository _countryRepository;
        public MasterDataManager(IItemTypeRepository itemTypeRepository,ICountryRepository countryRepository)
        {
            _itemTypeRepository = itemTypeRepository;
            _countryRepository = countryRepository;
        }

        public async Task<IEnumerable<SelectListItemDto>> GetItemTypeSelectItemsAsync()
        {
            return await _itemTypeRepository.GetSelectItemsAsync();
        }

        public async Task<IEnumerable<SelectListItemDto>> GetCountrySelectItemsAsync()
        {
            return await _countryRepository.GetSelectItemsAsync();
        }
    }
}
