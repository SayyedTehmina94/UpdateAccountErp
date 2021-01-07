using AccountErp.Api.Helpers;
using AccountErp.Infrastructure.Managers;
using AccountErp.Models.Bill;
using AccountErp.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Internal;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace AccountErp.Api.Controllers
{
    [Route("api/[controller]")]
    [Produces("application/json")]
    [Authorize]
    [ApiController]
    public class BillController : ControllerBase
    {
        private readonly IBillManager _manager;
        private readonly IHostingEnvironment _environment;

        public BillController(IBillManager manager,
            IHostingEnvironment environment)
        {
            _manager = manager;
            _environment = environment;
        }

        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> Add([FromBody]BillAddModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.GetErrorList());
            }

            if(!EnumerableExtensions.Any(model.Items))
            {
                return BadRequest("Please select items to continue");
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
        public async Task<IActionResult> Edit([FromBody]BillEditModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.GetErrorList());
            }

            if(!EnumerableExtensions.Any(model.Items))
            {
                return BadRequest("Please select item to continue");
            }

            try
            {
                await _manager.Editsync(model);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return Ok();
        }
        
        [HttpGet]
        [Route("get-select-items")]
        public async Task<IActionResult> GetSelectItems()
        {
            return Ok(await _manager.GetSelectItemsAsync());
        }

        [HttpPost]
        [Route("paged-result")]
        public async Task<IActionResult> PagedResult(BillJqDataTableRequestModel model)
        {
            return Ok(await _manager.GetPagedResultAsync(model));
        }

        [HttpPost]
        [Route("getTopFiveBills")]
        public async Task<IActionResult> getTopFiveBills(BillJqDataTableRequestModel model)
        {
            return Ok(await _manager.getTopFiveBillsAsync(model));
        }

        [HttpGet]
        [Route("get-recent")]
        public async Task<IActionResult> GetRecent()
        {
            return Ok(await _manager.GetRecentAsync());
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("get-detail/{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var bill = await _manager.GetDetailAsync(id);
            if (bill == null)
            {
                return NotFound();
            }
            return Ok(bill);
        }

        [HttpGet]
        [Route("get-detail-for-edit/{id}")]
        public async Task<IActionResult> GetDetailForEdit(int id)
        {
            var bill = await _manager.GetDetailForEditAsync(id);

            if (bill == null)
            {
                return NotFound();
            }

            bill.Attachments = bill.Attachments.ToList();

            if (!bill.Attachments.Any())
            {
                return Ok(bill);
            }

            foreach (var attachment in bill.Attachments)
            {
                attachment.FileUrl = Utility.GetTempFileUrl(Request.GetBaseUrl(), attachment.FileName);
            }

            return Ok(bill);
        }

        [HttpGet]
        [Route("get-summary/{id}")]
        public async Task<IActionResult> GetSummary(int id)
        {
            return Ok(await _manager.GetSummaryAsunc(id));
        }

        [HttpPost]
        [Route("upload-attachment")]
        public async Task<IActionResult> UploadAttachment([FromForm]IFormFile file)
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

        [HttpPost]
        [Route("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _manager.DeleteAsync(id);

            return Ok();
        }
        [HttpGet]
        [Route("get-BillNumber")]
        public async Task<IActionResult> GetBillNumber()
        {
            return Ok(await _manager.GetBillNumber());
        }
        [HttpGet]
        [Route("get-AllUnpaidBills")]
        public async Task<IActionResult> GetAllUnpaidBills()
        {
            return Ok(await _manager.GetAllUnpaidAsync());
        }
    }
}