using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AccountErp.Infrastructure.Managers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AccountErp.Api.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardManager _manager;
        private readonly IHostingEnvironment _environment;
        private readonly IEmailManager _emailManager;
        public DashboardController(IDashboardManager dashboardManager,
            IHostingEnvironment environment, IEmailManager emailManager)
        {
            _manager = dashboardManager;
            _environment = environment;
            _emailManager = emailManager;
        }

        [HttpGet]
        [Route("get-sales-expense")]
        public async Task<IActionResult> GetAllActiveOnly()
        {
            return Ok(await _manager.GetSalesAndExpenceAmountAsync());
        }
    }

  
}
