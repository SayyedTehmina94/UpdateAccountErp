using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AccountErp.Api.Helpers;
using AccountErp.Infrastructure.Managers;
using AccountErp.Models.ChartOfAccount;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AccountErp.Api.Controllers
{
    [Route("api/[controller]")]
    [Produces("application/json")]
    [Authorize]
    [ApiController]
    public class ChartofAccountController : ControllerBase
    {
        private readonly IChartofAccountManager _manager;

        public ChartofAccountController(IChartofAccountManager Manager)
        {
            _manager = Manager;
        }

        //[HttpPost]
        //[Route("add")]
        //public async Task<IActionResult> Add([FromBody] COA_AccountAddModel model)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState.GetErrorList());
        //    }

        //    try
        //    {
        //        var accountId = await _manager.AddAsync(model);

        //        return Ok(accountId);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}

        //[HttpGet]
        //[Route("get-detail/{id}")]
        //public async Task<IActionResult> GetDetail(int id)
        //{

        //    var account = await _manager.GetDetailAsync(id);
        //    if (account == null)
        //    {
        //        return NotFound();
        //    }
        //    return Ok(account);

        //}

        //[HttpGet]
        //[Route("get-for-edit/{id}")]
        //public async Task<IActionResult> GetForEdit(int id)
        //{
        //    var account = await _manager.GetForEditAsync(id);
        //    if (account == null)
        //    {
        //        return NotFound();
        //    }
        //    return Ok(account);
        //}

        //[HttpPost]
        //[Route("edit")]
        //public async Task<IActionResult> Edit([FromBody] COA_AccountEditModel model)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState.GetErrorList());
        //    }

        //    try
        //    {
        //        await _manager.EditAsync(model);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }

        //    return Ok();
        //}

        [HttpGet]
        [Route("getCOADetails")]
        public async Task<IActionResult> GetCOADetailAsync()
        {

            var COA_Details = await _manager.GetCOADetailAsync();

            return Ok(COA_Details);
        }
        [HttpGet]
        [Route("getCOADetailsWithAccount")]
        public async Task<IActionResult> GetCOADetailAccountAsync()
        {

            var COA_Details = await _manager.GetDetailForAccountAsync();

            return Ok(COA_Details);
        }
        [HttpPost]
        [Route("getAccountByTypeId/{id}")]
        public async Task<IActionResult> getAccountByTypeId(int id)
        {

            var accountList = await _manager.getAccountByTypeId(id);

            return Ok(accountList);
        }
        [HttpPost]
        [Route("getDetailsByMasterId/{id}")]
        public async Task<IActionResult> getDetailsByMasterId(int id)
        {

            var COA_Details = await _manager.GetDetailByMarterIdAsync(id);

            return Ok(COA_Details);
        }
        [HttpGet]
        [Route("getCOAWithAccountDetails")]
        public async Task<IActionResult> GetCOAAccountDetailsaAsync()
        {

            var COA_Details = await _manager.GetCOAAccountDetailsaAsync();

            return Ok(COA_Details);
        }
    }
}
