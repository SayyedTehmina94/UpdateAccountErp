using AccountErp.Api.Helpers;
using AccountErp.Infrastructure.Managers;
using AccountErp.Models.Vendor;
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
    public class VendorController : ControllerBase
    {
        private readonly IVendorManager _vendorManager;

        public VendorController(IVendorManager vendorManager)
        {
            _vendorManager = vendorManager;
        }

        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> Add([FromBody]VendorAddModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.GetErrorList());
            }

            if (await _vendorManager.IsEmailExistsAsync(model.Email))
            {
                return BadRequest("Email already exists");
            }

            try
            {
                var vendorId = await _vendorManager.AddAsync(model);

                return Ok(vendorId);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("get-detail/{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var vendor = await _vendorManager.GetDetailAsync(id);
            if (vendor == null)
            {
                return NotFound();
            }
            return Ok(vendor);
        }

        [HttpGet]
        [Route("get-for-edit/{id}")]
        public async Task<IActionResult> GetForEdit(int id)
        {
            var vendor = await _vendorManager.GetForEditAsync(id);

            if (vendor == null)
            {
                return NotFound();
            }

            return Ok(vendor);
        }

        [HttpPost]
        [Route("edit")]
        public async Task<IActionResult> Edit([FromBody]VendorEditModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.GetErrorList());
            }

            if (await _vendorManager.IsEmailExistsAsync(model.Id, model.Email))
            {
                return BadRequest("Email already exists");
            }

            try
            {
                await _vendorManager.EditAsync(model);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return Ok();
        }

        [HttpPost]
        [Route("paged-result")]
        public async Task<IActionResult> GetPagedResult(VendorJqDataTableRequestModel model)
        {
            var pagedResult = await _vendorManager.GetPagedResultAsync(model);
            return Ok(pagedResult);
        }

        [HttpGet]
        [Route("get-personal-info/{id}")]
        public async Task<IActionResult> GetPersonalInfo(int id)
        {
            return Ok(await _vendorManager.GetPersonalInfoAsync(id));
        }

        [HttpGet]
        [Route("get-payment-info/{id}")]
        public async Task<IActionResult> GetPaymentInfo(int id)
        {
            return Ok(await _vendorManager.GetPaymentInfoAsync(id));
        }

        [HttpGet]
        [Route("get-select-items")]
        public async Task<IActionResult> GetSelectItems()
        {
            return Ok(await _vendorManager.GetSelectItemsAsync());
        }

        [HttpPost]
        [Route("toggle-status/{id}")]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            await _vendorManager.ToggleStatusAsync(id);

            return Ok();
        }

        [HttpPost]
        [Route("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _vendorManager.DeleteAsync(id);

            return Ok();
        }
    }
}