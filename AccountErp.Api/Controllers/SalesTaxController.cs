using AccountErp.Api.Helpers;
using AccountErp.Infrastructure.Managers;
using AccountErp.Models.SalesTax;
using AccountErp.Models.VendorSalesTax;
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
    public class SalesTaxController : ControllerBase
    {
        private readonly ISalesTaxManager _manager;

        public SalesTaxController(ISalesTaxManager manager)
        {
            _manager = manager;
        }

        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> Add([FromBody] SalesTaxAddModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.GetErrorList());
            }
            if (await _manager.IsCodeExistsAsync(model.Code))
            {
                return BadRequest("Sales tax of this code is already exists");
            }
            try
            {
                await _manager.AddAsync(model);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            return Ok();
        }

        [HttpPost]
        [Route("edit")]
        public async Task<IActionResult> Edit([FromBody]SalesTaxEditModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.GetErrorList());
            }
            if (await _manager.IsCodeExistsAsync(model.Code,model.Id))
            {
                return BadRequest("Code for this vendor already exists");
            }
            try
            {
                await _manager.EditAsync(model);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            return Ok();
        }

        [HttpGet]
        [Route("get-for-edit/{id}")]
        public async Task<IActionResult> GetForEdit(int id)
        {
            var salesTax = await _manager.GetForEditAsync(id);
            if (salesTax == null)
            {
                return NotFound();
            }
            return Ok(salesTax);
        }

        [HttpGet]
        [Route("get-select-list-items")]
        public async Task<IActionResult> GetVendorTax()
        {
            return Ok(await _manager.GetSelectListItemsAsync());
        }

        [HttpPost]
        [Route("paged-result")]
        public async Task<IActionResult> GetPagedResult(SalexTaxJqDataTableRequestModel model)
        {
            var pagedResult = await _manager.GetPagedResultAsync(model);
            return Ok(pagedResult);
        }

        [HttpPost]
        [Route("toggle-status/{id}")]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            await _manager.ToggleStatusAsync(id);

            return Ok();
        }

        [HttpPost]
        [Route("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _manager.DeleteAsync(id);

            return Ok();
        }
        [HttpGet]
        [Route("get-active-only")]
        public async Task<IActionResult> GetActiveOnly()
        {
            return Ok(await _manager.GetActiveOnlyAsync());
        }
    }
}