using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AccountErp.Api.Helpers;
using AccountErp.Infrastructure.Managers;
using AccountErp.Models.RecurringInvoice;
using AccountErp.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Internal;

namespace AccountErp.Api.Controllers
{
    [Route("api/[controller]")]
    [Produces("application/json")]
    [Authorize]
    [ApiController]
    public class RecurringInvoiceController : ControllerBase
    { 
   private readonly IRecurringInvoiceManager _recInvoiceManager;
    private readonly IHostingEnvironment _environment;
    private readonly IEmailManager _emailManager;
    public RecurringInvoiceController(IRecurringInvoiceManager recInvoiceManager,
        IHostingEnvironment environment, IEmailManager emailManager)
    {
            _recInvoiceManager = recInvoiceManager;
        _environment = environment;
        _emailManager = emailManager;
    }

    [HttpPost]
    [Route("add")]
    public async Task<IActionResult> Add([FromBody] RecInvoiceAddModel model)
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
            await _recInvoiceManager.AddAsync(model);
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
        var recInvoice = await _recInvoiceManager.GetDetailAsync(id);

        if (recInvoice == null)
        {
            return NotFound();
        }

        if (recInvoice.Attachments == null)
        {
            return Ok(recInvoice);
        }

            recInvoice.Attachments = recInvoice.Attachments.ToList();

        foreach (var attachment in recInvoice.Attachments)
        {
            attachment.FileUrl = Utility.GetTempFileUrl(Request.GetBaseUrl(), attachment.FileName);
        }

        return Ok(recInvoice);
    }

    [HttpGet]
    [Route("get-for-edit/{id}")]
    public async Task<IActionResult> GetForEdit(int id)
    {
        var recInvoice = await _recInvoiceManager.GetForEditAsync(id);
        if (recInvoice == null)
        {
            return NotFound();
        }
        return Ok(recInvoice);
    }

    [HttpPost]
    [Route("edit")]
    public async Task<IActionResult> Edit([FromBody] RecInvoiceEditModel model)
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
            await _recInvoiceManager.EditAsync(model);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
        return Ok();
    }

    [HttpPost]
    [Route("paged-result")]
    public async Task<IActionResult> GetPagedResult(RecInvoiceJqDataTableRequestModel model)
    {
        var pagedResult = await _recInvoiceManager.GetPagedResultAsync(model);

        return Ok(pagedResult);
    }

    [HttpGet]
    [Route("get-recent")]
    public async Task<IActionResult> GetRecent()
    {
        var pagedResult = await _recInvoiceManager.GetRecentAsync();
        return Ok(pagedResult);
    }

    [HttpPost]
    [Route("delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _recInvoiceManager.DeleteAsync(id);

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
        return Ok(await _recInvoiceManager.GetSummaryAsunc(id));
    }

    [HttpPost]
    [Route("send")]
    public async Task<IActionResult> SendInvoice(RecInvoiceSendModel model)
    {
        var recInvoice = await _recInvoiceManager.GetDetailAsync(model.Id);
        if (recInvoice.Customer.Email == null)
        {
            BadRequest("Customer doesn't have email address");
        }

        var dirPath = Utility.GetInvoiceFolder(_environment.WebRootPath);
        var completePath = dirPath + recInvoice.Id + "_" + ".pdf";
        if (!System.IO.File.Exists(completePath))
        {
            var renderer = new IronPdf.HtmlToPdf();
            renderer.RenderHtmlAsPdf(model.Html).SaveAs(completePath);
        }
        await _emailManager.SendInvoiceAsync(recInvoice.Customer.Email, completePath);
        return Ok();
    }

    [HttpGet]
    [Route("get-InvoiceNumber")]
    public async Task<IActionResult> GetInvoiceNumber()
    {
        return Ok(await _recInvoiceManager.GetRecInvoiceNumber());
    }

    [HttpGet]
    [Route("getTopTenRecurringInvoices")]
    public async Task<IActionResult> GetTopTenRecurringInvoices()
    {
        var pagedResult = await _recInvoiceManager.GetTopTenRecurringInvoicesAsync();

        return Ok(pagedResult);
    }
    }
}
