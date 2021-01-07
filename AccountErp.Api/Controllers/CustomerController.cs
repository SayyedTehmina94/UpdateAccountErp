using AccountErp.Api.Helpers;
using AccountErp.Dtos.Customer;
using AccountErp.Infrastructure.Managers;
using AccountErp.Models.Customer;
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
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerManager _customerManager;

        public CustomerController(ICustomerManager customerManager)
        {
            _customerManager = customerManager;
        }

        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> Add([FromBody]CustomerAddModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.GetErrorList());
            }

            if (await _customerManager.IsEmailExistsAsync(model.Email))
            {
                return BadRequest("Another customer with same email already exists");
            }

            try
            {
                var customerId = await _customerManager.AddAsync(model);

                return Ok(customerId);
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

            var customer = await _customerManager.GetDetailAsync(id);
            if (customer == null)
            {
                return NotFound();
            }
            return Ok(customer);

        }

        [HttpGet]
        [Route("get-for-edit/{id}")]
        public async Task<IActionResult> GetForEdit(int id)
        {
            var customer = await _customerManager.GetForEditAsync(id);
            if (customer == null)
            {
                return NotFound();
            }
            return Ok(customer);
        }

        [HttpPost]
        [Route("edit")]
        public async Task<IActionResult> Edit([FromBody]CustomerEditModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.GetErrorList());
            }

            if (await _customerManager.IsEmailExistsAsync(model.Id, model.Email))
            {
                return BadRequest("Another customer with same email already exists");
            }

            try
            {
                await _customerManager.EditAsync(model);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return Ok();
        }

        [HttpPost]
        [Route("paged-result")]
        public async Task<IActionResult> GetPagedResult(CustomerJqDataTableRequestModel model)
        {
            var pagedResult = await _customerManager.GetPagedResultAsync(model);
            return Ok(pagedResult);
        }

        [HttpGet]
        [Route("get-select-items")]
        public async Task<IActionResult> GetSelectItems()
        {
            return Ok(await _customerManager.GetSelectItemsAsync());
        }

        [HttpPost]
        [Route("toggle-status/{id}")]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            await _customerManager.ToggleStatusAsync(id);

            return Ok();
        }

        [HttpPost]
        [Route("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _customerManager.DeleteAsync(id);

            return Ok();
        }

        [HttpGet]
        [Route("get-payment-info/{id}")]
        public async Task<IActionResult> GetPaymentInfo(int id)
        {
            return Ok(await _customerManager.GetPaymentInfoAsync(id));
        }

        [HttpPost]
        [Route("get-customer-statement")]
        public async Task<CustomerStatementDto> GetCustomerStatementAsync(CustomerStatementDto model)
        {
            //await _customerManager.SetOverdueStatus(model.CustomerId);
            var pagedResult = await _customerManager.GetCustomerStatementAsync(model);
            return (pagedResult);
        }
        [HttpGet]
        [Route("getDetailsCustomerAndVendor")]
        public async Task<IActionResult> GetDetailsCustomerAndVendorAsync()
        {
            var CustomerAndVendor = await _customerManager.GetDetailsCustomerAndVendorAsync();
            return Ok(CustomerAndVendor);
        }
    }
}