using AccountErp.Api.Helpers;
using AccountErp.Infrastructure.Managers;
using AccountErp.Models.BankAccount;
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
    public class BankAccountController : ControllerBase
    {
        private readonly IBankAccountManager _bankAccountManager;

        public BankAccountController(IBankAccountManager bankAccountManager)
        {
            _bankAccountManager = bankAccountManager;
        }

        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> Add([FromBody] BankAccountAddModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.GetErrorList());
            }
            if (model.LedgerType == 2)
            {
                if (await _bankAccountManager.IsAccountNumberExistsAsync(model.AccountNumber))
                {
                    return BadRequest("Bank account number already exists");
                }
            }
            try
            {
                await _bankAccountManager.AddAsync(model);
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
            var bankAccount = await _bankAccountManager.GetDetailAsync(id);
            if (bankAccount == null)
            {
                return NotFound();
            }
            return Ok(bankAccount);
        }

        [HttpGet]
        [Route("get-for-edit/{id}")]
        public async Task<IActionResult> GetForEdit(int id)
        {
            var bankAccount = await _bankAccountManager.GetForEditAsync(id);
            if (bankAccount == null)
            {
                return NotFound();
            }
            return Ok(bankAccount);
        }

        [HttpPost]
        [Route("edit")]
        public async Task<IActionResult> Edit([FromBody] BankAccountEditModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.GetErrorList());
            }
            if (model.LedgerType == 2)
            {
                if (await _bankAccountManager.IsAccountNumberExistsForEditAsync(model.Id, model.AccountNumber))
                {
                    return BadRequest("Bank account number already exists");
                }
            }
            try
            {
                await _bankAccountManager.EditAsync(model);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            return Ok();
        }

        [HttpPost]
        [Route("paged-result")]
        public async Task<IActionResult> GetPagedResult(JqDataTableRequest model)
        {
            var pagedResult = await _bankAccountManager.GetPagedResultAsync(model);
            return Ok(pagedResult);
        }

        [HttpGet]
        [Route("get-select-items")]
        public async Task<IActionResult> GetSelectItems()
        {
            return Ok(await _bankAccountManager.GetSelectItemsAsync());
        }

        [HttpPost]
        [Route("toggle-status/{id}")]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            await _bankAccountManager.ToggleStatusAsync(id);

            return Ok();
        }

        [HttpPost]
        [Route("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _bankAccountManager.DeleteAsync(id);

            return Ok();
        }

        [HttpPost]
        [Route("getDetailByLedgerType")]
        public async Task<IActionResult> GetByLedgerType(int typeId)
        {
            return Ok(await _bankAccountManager.GetDetailByLedgerTypeAsync(typeId));
        }
    }
}