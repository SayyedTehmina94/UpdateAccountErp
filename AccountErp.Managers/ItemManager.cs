using AccountErp.Dtos;
using AccountErp.Dtos.Item;
using AccountErp.Factories;
using AccountErp.Infrastructure.DataLayer;
using AccountErp.Infrastructure.Managers;
using AccountErp.Infrastructure.Repositories;
using AccountErp.Models.Item;
using AccountErp.Utilities;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AccountErp.Managers
{
    public class ItemManager : IItemManager
    {
        private readonly IItemRepository _repository;
        private readonly IUnitOfWork _unitOfWork;

        private readonly string _userId;

        public ItemManager(IHttpContextAccessor contextAccessor,
            IItemRepository repository,
            IUnitOfWork unitOfWork)
        {
            _userId = contextAccessor.HttpContext.User.GetUserId();

            _repository = repository;
            _unitOfWork = unitOfWork;
        }

        public async Task AddAsync(ItemAddModel model)
        {
            await _repository.AddAsync(ItemFactory.Create(model, _userId));
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task EditAsync(ItemEditModel model)
        {
            var item = await _repository.GetAsync(model.Id);
            ItemFactory.Create(model, item, _userId);
            _repository.Edit(item);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task<ItemDetailDto> GetDetailAsync(int id)
        {
            return await _repository.GetDetailAsync(id);
        }

        public async Task<JqDataTableResponse<ItemListItemDto>> GetPagedResultAsync(ItemJqDataTableRequestModel model)
        {
            return await _repository.GetPagedResultAsync(model);
        }

        public async Task<IEnumerable<SelectListItemDto>> GetSelectItemsAsync()
        {
            return await _repository.GetSelectItemsAsync();
        }

        public async Task<IEnumerable<ItemDetailDto>> GetAllAsync(Constants.RecordStatus? status = null)
        {
            return await _repository.GetAllAsync(status);
        }

        public async Task<ItemDetailForEditDto> GetForEditAsync(int id)
        {
            return await _repository.GetForEditAsync(id);
        }

        public async Task ToggleStatusAsync(int id)
        {
            await _repository.ToggleStatusAsync(id);
            await _unitOfWork.SaveChangesAsync();
        }

        public bool checkItemAvailable(int id)
        {
           return _repository.checkItemAvailable(id);
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task<IEnumerable<ItemDetailDto>> GetAllForSalesAsync(Constants.RecordStatus? status = null)
        {
            return await _repository.GetAllForSalesAsync(status);
        }

        public async Task<IEnumerable<ItemDetailDto>> GetAllForExpenseAsync(Constants.RecordStatus? status = null)
        {
            return await _repository.GetAllForExpenseAsync(status);
        }


        
    }
}
