using AccountErp.Api.Helpers;
using AccountErp.Infrastructure.Managers;
using AccountErp.Models.Invoice;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AccountErp.Api.Controllers
{
    [Route("api/[controller]")]
    [Produces("application/json")]
    [Authorize]
    [ApiController]
    public class InvoicePaymentController : ControllerBase
    {
        private readonly IInvoicePaymentManager _invoicePaymentManager;

        public InvoicePaymentController(IInvoicePaymentManager invoicePaymentManager)
        {
            _invoicePaymentManager = invoicePaymentManager;
        }

        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> Add(InvoicePaymentAddModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.GetErrorList());
            }
            await _invoicePaymentManager.AddAsync(model);

            return Ok();
        }

        [HttpPost]
        [Route("paged-result")]
        public async Task<IActionResult> PagedResult(InvoiceJqDataTableRequestModel model)
        {
            return Ok(await _invoicePaymentManager.GetPagedResultAsync(model));
        }
    }
}