using AccountErp.Web.Helpers;
using AccountErp.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;

namespace AccountErp.Web.Controllers
{
    public class PrintController : Controller
    {
        private readonly IConfiguration _configuration;

        public PrintController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<IActionResult> Invoice(int id)
        {
            try
            {
                var apiResponse =
                    await ApiHelper.ExecuteGetAsync<InvoiceDetailModel>(
                        _configuration["BaseUrlApi"] + "/api/invoice/get-detail/" + id, null);

                if (apiResponse.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    return View(apiResponse.Data);
                }

                return View("Error", apiResponse.StackTrace);
            }

            catch (Exception ex)
            {
                return View("Error", ex.StackTrace);
            }
        }

        [HttpGet]
        public async Task<IActionResult> Bill(int id)
        {
            try
            {
                var apiResponse =
                    await ApiHelper.ExecuteGetAsync<BillDetailModel>(
                        _configuration["BaseUrlApi"] + "/api/bill/get-detail/" + id, null);

                if (apiResponse.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    return View(apiResponse.Data);
                }

                return View("Error", apiResponse.StackTrace);
            }

            catch (Exception ex)
            {
                return View("Error", ex.StackTrace);
            }
        }
    }
}