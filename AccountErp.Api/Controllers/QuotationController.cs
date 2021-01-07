using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AccountErp.Api.Helpers;
using AccountErp.Infrastructure.Managers;
using AccountErp.Models.Invoice;
using AccountErp.Models.Quotation;
using AccountErp.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Internal;

namespace AccountErp.Api.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class QuotationController : ControllerBase
    {
        private readonly IQuotationManager _quotationManager;
        private readonly IHostingEnvironment _environment;
        private readonly IEmailManager _emailManager;
        public QuotationController(IQuotationManager quotationManager,
            IHostingEnvironment environment, IEmailManager emailManager)
        {
            _quotationManager = quotationManager;
            _environment = environment;
            _emailManager = emailManager;
        }

        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> Add([FromBody] QuotationAddModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.GetErrorList());
            }

            if (!EnumerableExtensions.Any(model.Items))
            {
                return BadRequest("Please select items/services to continue");
            }

            try
            {
                await _quotationManager.AddAsync(model);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            return Ok();
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("get-detail/{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var quotation = await _quotationManager.GetDetailAsync(id);

            if (quotation == null)
            {
                return NotFound();
            }

            if (quotation.Attachments == null)
            {
                return Ok(quotation);
            }

            quotation.Attachments = quotation.Attachments.ToList();

            foreach (var attachment in quotation.Attachments)
            {
                attachment.FileUrl = Utility.GetTempFileUrl(Request.GetBaseUrl(), attachment.FileName);
            }

            return Ok(quotation);
        }

        [HttpGet]
        [Route("get-for-edit/{id}")]
        public async Task<IActionResult> GetForEdit(int id)
        {
            var quotation = await _quotationManager.GetForEditAsync(id);
            if (quotation == null)
            {
                return NotFound();
            }
            return Ok(quotation);
        }

        [HttpPost]
        [Route("edit")]
        public async Task<IActionResult> Edit([FromBody] QuotationEditModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.GetErrorList());
            }

            if (!EnumerableExtensions.Any(model.Items))
            {
                return BadRequest("Please select items/services to continue");
            }

            try
            {
                await _quotationManager.EditAsync(model);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            return Ok();
        }

        [HttpPost]
        [Route("paged-result")]
        public async Task<IActionResult> GetPagedResult(QuotationJqDataTableRequestModel model)
        {
            var pagedResult = await _quotationManager.GetPagedResultAsync(model);

            return Ok(pagedResult);
        }

        [HttpGet]
        [Route("get-recent")]
        public async Task<IActionResult> GetRecent()
        {
            var pagedResult = await _quotationManager.GetRecentAsync();
            return Ok(pagedResult);
        }

        [HttpPost]
        [Route("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _quotationManager.DeleteAsync(id);

            return Ok();
        }

        [HttpPost]
        [Route("upload-attachment")]
        public async Task<IActionResult> UploadAttachment([FromForm] IFormFile file)
        {
            var dirPath = Utility.GetTempFolder(_environment.WebRootPath);

            var fileName = Utility.GetUniqueFileName(file.FileName);

            using (var fileStream = new FileStream(dirPath + fileName, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return Ok(new
            {
                fileName,
                fileUrl = Utility.GetTempFileUrl(Request.GetBaseUrl(), fileName)
            });
        }

        [HttpGet]
        [Route("get-summary/{id}")]
        public async Task<IActionResult> GetSummary(int id)
        {
            return Ok(await _quotationManager.GetSummaryAsunc(id));
        }

        [HttpPost]
        [Route("send")]
        public async Task<IActionResult> SendInvoice(QuotationSendModel model)
        {
            var quotation = await _quotationManager.GetDetailAsync(model.Id);
            if (quotation.Customer.Email == null)
            {
                BadRequest("Customer doesn't have email address");
            }

            var dirPath = Utility.GetInvoiceFolder(_environment.WebRootPath);
            var completePath = dirPath + quotation.Id + "_" + ".pdf";
            if (!System.IO.File.Exists(completePath))
            {
                var renderer = new IronPdf.HtmlToPdf();
                renderer.RenderHtmlAsPdf(model.Html).SaveAs(completePath);
            }
            await _emailManager.SendInvoiceAsync(quotation.Customer.Email, completePath);
            return Ok();
        }

        [HttpGet]
        [Route("get-QuotationNumber")]
        public async Task<IActionResult> GetQuotationNumber()
        {
            return Ok(await _quotationManager.GetQuotationNumber());
        }
    }
}
