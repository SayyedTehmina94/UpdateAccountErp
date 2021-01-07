using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AccountErp.Infrastructure.Managers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AccountErp.Api.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class MasterController : ControllerBase
    {
        private readonly IMasterDataManager _masterManager;
        public MasterController(IMasterDataManager masterManager)
        {
            _masterManager = masterManager;
        }

        [HttpGet]
        [Route("get-item-type")]
        public async Task<IActionResult> GetItemType()
        {
            try
            {
                return Ok(await _masterManager.GetItemTypeSelectItemsAsync());
            }
            catch(Exception ex)
            {
                return BadRequest("unable to get data " + ex);
            }
        }

        [HttpGet]
        [Route("get-country")]
        public async Task<IActionResult> GetCountry()
        {
            var countries = await _masterManager.GetCountrySelectItemsAsync();
            if (countries == null)
            {
                BadRequest("unable to fatch countries");
            }
            return Ok(countries);
        }
    }
}