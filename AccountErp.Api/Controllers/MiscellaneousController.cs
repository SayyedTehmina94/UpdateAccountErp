using AccountErp.DataLayer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace AccountErp.Api.Controllers
{
    [Route("api/[controller]")]
    [Produces("application/json")]
    [Authorize]
    [ApiController]
    public class MiscellaneousController : ControllerBase
    {
        private readonly IHostingEnvironment _environment;
        private readonly DataContext _dataContext;

        public MiscellaneousController(IHostingEnvironment environment,
            DataContext dataContext)
        {
            _environment = environment;
            _dataContext = dataContext;
        }

        [HttpGet]
        [Route("get-connection-string")]
        public IActionResult GetConnectionString()
        {
            return Ok(_dataContext.Database.GetDbConnection().ConnectionString);
        }

        [HttpGet]
        [Route("validate-database-connection")]
        public IActionResult ValidateDatabaseConnection()
        {
            try
            {
                _dataContext.Database.OpenConnection();
                return Ok("Success!");
            }
            catch (Exception ex)
            {
                return Ok(ex);
            }
            finally
            {
                _dataContext.Database.CloseConnection();
            }
        }

        [HttpGet]
        [Route("is-administrator-exists")]
        public IActionResult IsAdministratorExists()
        {
            try
            {
                return Ok(_dataContext.Users.Any(x => x.UserName.Contains("admin")));
            }
            catch (Exception ex)
            {
                return Ok(ex);
            }
        }

        [HttpGet]
        [Route("has-folder-write-access")]
        public IActionResult HasFolderkWriteAccess()
        {
            try
            {
                var path = Utilities.Utility.GetTempFolder(_environment.WebRootPath);
                return Ok(path);
            }
            catch (Exception ex)
            {
                return Ok(ex);
            }
        }
    }
}