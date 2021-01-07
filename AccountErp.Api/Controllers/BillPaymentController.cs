using AccountErp.Api.Helpers;
using AccountErp.Infrastructure.Managers;
using AccountErp.Models.Bill;
using AccountErp.Models.Expense;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AccountErp.Api.Controllers
{
    [Route("api/[controller]")]
    [Produces("application/json")]
    [Authorize]
    [ApiController]
    public class BillPaymentController : ControllerBase
    {
        private readonly IBillPaymentManager _manager;

        public BillPaymentController(IBillPaymentManager manager)
        {
            _manager = manager;
        }

        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> Add([FromBody]BillPaymentAddModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.GetErrorList());
            }

            await _manager.AddAsync(model);

            return Ok();
        }

        [HttpPost]
        [Route("paged-result")]
        public async Task<IActionResult> PagedResult(ExpensePaymentJqDataTableRequestModel model)
        {
            return Ok(await _manager.GetPagedResultAsync(model));
        }
    }
}