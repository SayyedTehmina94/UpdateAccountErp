using AccountErp.Api.Helpers;
using AccountErp.Infrastructure.Managers;
using AccountErp.Models.CreditCard;
using AccountErp.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace AccountErp.Api.Controllers
{
    [Route("api/[controller]")]
    [Produces("application/json")]
    [Authorize]
    [ApiController]
    public class CreditCardController : ControllerBase
    {
        private readonly ICreditCardManager _creditCardManager;

        public CreditCardController(ICreditCardManager creditCardManager)
        {
            _creditCardManager = creditCardManager;
        }

        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> Add([FromBody]CreditCardAddModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.GetErrorList());
            }
            if (await _creditCardManager.IsCreditCardNumberExistsAsync(model.CreditCardNumber))
            {
                return BadRequest("Credit card number already exists");
            }
            try
            {
                await _creditCardManager.AddAsync(model);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            return Ok();
        }

        [HttpGet]
        [Route("get-detail/{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var creditCard = await _creditCardManager.GetDetailAsync(id);
            if (creditCard == null)
            {
                return NotFound();
            }
            return Ok(creditCard);
        }

        [HttpGet]
        [Route("get-for-edit/{id}")]
        public async Task<IActionResult> GetForEdit(int id)
        {
            var creditCard = await _creditCardManager.GetForEditAsync(id);
            if (creditCard == null)
            {
                return NotFound();
            }
            return Ok(creditCard);
        }

        [HttpPost]
        [Route("edit")]
        public async Task<IActionResult> Edit([FromBody]CreditCardEditModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.GetErrorList());
            }
            if (await _creditCardManager.IsCreditCardNumberExistsForEditAsync(model.Id, model.CreditCardNumber))
            {
                return BadRequest("Credit card number already exists");
            }
            try
            {
                await _creditCardManager.EditAsync(model);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            return Ok();
        }

        [HttpPost]
        [Route("paged-result")]
        public async Task<IActionResult> GetPagedResult(CreditCardJqDataTableRequestModel model)
        {
            var pagedResult = await _creditCardManager.GetPagedResultAsync(model);
            return Ok(pagedResult);
        }

        [HttpGet]
        [Route("get-select-items")]
        public async Task<IActionResult> GetSelectItems()
        {
            return Ok(await _creditCardManager.GetSelectItemsAsync());
        }

        [HttpPost]
        [Route("toggle-status/{id}")]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            await _creditCardManager.ToggleStatusAsync(id);

            return Ok();
        }

        [HttpPost]
        [Route("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _creditCardManager.DeleteAsync(id);

            return Ok();
        }
    }
}