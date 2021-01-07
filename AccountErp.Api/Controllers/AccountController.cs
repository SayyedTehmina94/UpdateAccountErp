using AccountErp.Api.Helpers;
using AccountErp.DataLayer;
using AccountErp.Dtos;
using AccountErp.Dtos.User;
using AccountErp.Models.Account;
using AccountErp.Models.Setting;
using AccountErp.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace AccountErp.Api.Controllers
{
    [Route("api/[controller]")]
    [Produces("application/json")]
   // [Authorize]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AccountController(IConfiguration configuration,
            UserManager<AppUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            _configuration = configuration;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> Add([FromBody]AccountAddModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.GetErrorList());
            }
            if (await _userManager.Users.AnyAsync(x => x.UserName.Equals(model.Email)))
            {
                return BadRequest("User already exists");
            }

            var user = new AppUser
            {
                UserName = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email,
                CreatedOn = Utilities.Utility.GetDateTime(),
                Status = Constants.RecordStatus.Active,
                EmailConfirmed = true,
                Role = model.RoleId
            };

            try
            {
                IdentityResult identityResult = await _userManager.CreateAsync(user, model.Password);
                var role = await _roleManager.FindByIdAsync(model.RoleId);
                identityResult = await _userManager.AddToRoleAsync(user, role.Name);
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest("unable to add user");
            }

        }


        [HttpPost]
        [Route("token")]
        public async Task<IActionResult> Login([FromBody]LoginModel model)
        {
            var user = await _userManager.Users.SingleOrDefaultAsync(x => x.UserName.Equals(model.UserName, StringComparison.InvariantCultureIgnoreCase)
            && x.Status != Constants.RecordStatus.Deleted);

            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            {
                return BadRequest("Invalid Credential");
            }
            if (!user.EmailConfirmed)
            {
                return StatusCode((int)HttpStatusCode.ExpectationFailed, user.Id);
            }
            if (user.Status == Constants.RecordStatus.Inactive)
            {
                return BadRequest("Your account is inactive.");
            }
            var roles = await _userManager.GetRolesAsync(user);

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration.GetValue<string>("Jwt:secret"));
            var tokenDescription = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]{
                    new Claim(ClaimTypes.NameIdentifier , user.Id),
                    new Claim(ClaimTypes.Name , user.UserName),
                    new Claim(ClaimTypes.GivenName , user.FirstName + " " + user.LastName),
                    new Claim(ClaimTypes.Role , string.Join(",",roles))
                }),
                Audience = _configuration.GetValue<string>("Jwt:Audience"),
                Issuer = _configuration.GetValue<string>("Jwt:Issuer"),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescription);

            return Ok(tokenHandler.WriteToken(token));
        }

        [HttpPost]
        [Authorize]
        [Route("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody]ChangePasswordModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.GetErrorList());
            }
            var user = await _userManager.FindByIdAsync(User.GetUserId());

            var result =
                await _userManager.ChangePasswordAsync(user, model.CurrentPassword.Trim(), model.NewPassword.Trim());

            if (result.Succeeded)
            {
                return Ok();
            }

            return BadRequest(result.Errors.Select(x => x.Description));
        }

        [HttpGet]
        [Authorize]
        [Route("get-role-select-item")]
        public async Task<IActionResult> GetRoleSelectItem()
        {
            var roles = await _roleManager.Roles.
                Select(x => new SelectListItemDto
                {
                    KeyString = x.Id,
                    Value = x.Name
                }).ToListAsync();

            return Ok(roles);
        }

        [HttpPost]
        //[Authorize]
        [Route("paged-result")]
        public async Task<IActionResult> PagedResult(JqDataTableRequest model)
        {
            if(model.Length == 0)
            {
                model.Length = Constants.DefaultPageSize;
            }

            var filterKey = model.Search.Value;

            var linqStmt = (from u in _userManager.Users
                            where u.Status != Constants.RecordStatus.Deleted && (filterKey == null || EF.Functions.Like(u.FirstName, "%" + filterKey + "%"))
                            select new UserListItemDto
                            {
                                Id = u.Id,
                                FirstName = u.FirstName,
                                LastName = u.LastName,
                                Email = u.Email,
                                PhoneNumber = u.PhoneNumber,
                                Status = u.Status
                            })
                            .AsNoTracking();
            var sortExpression = model.GetSortExpression();

            var pagedResult = new JqDataTableResponse<UserListItemDto>
            {
                RecordsTotal = await _userManager.Users.CountAsync(x => x.Status != Constants.RecordStatus.Deleted),
                RecordsFiltered = await linqStmt.CountAsync(),
                Data = await linqStmt.OrderBy(sortExpression).Skip(model.Start)
                .Take(model.Length)
                .ToListAsync()
            };
            return Ok(pagedResult);
        }

        [HttpGet]
        [Authorize]
        [Route("get-for-edit")]
        public async Task<IActionResult> GetForEdit()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            return Ok(new SettingEditModel
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber
            });
        }

        [HttpPost]
        [Authorize]
        [Route("edit")]
        public async Task<IActionResult> Edit([FromBody]SettingEditModel model)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.Email = model.Email;
            user.PhoneNumber = model.PhoneNumber;
            await _userManager.UpdateAsync(user);
            return Ok();
        }

        [HttpPost]
        [Route("delete/{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var user = _userManager.Users.Where(x => x.Id == id).FirstOrDefault();
            user.Status = Constants.RecordStatus.Deleted;
            await _userManager.UpdateAsync(user);
            return Ok();
        }

        [HttpPost]
        [Route("toggle-status/{id}")]
        public async Task<IActionResult> ToggleStatus(string id)
        {
            var user = _userManager.Users.Where(x => x.Id == id).FirstOrDefault();
            if(user.Status == Constants.RecordStatus.Inactive)
            {
                user.Status = Constants.RecordStatus.Active;
            }
            else
            {
                user.Status = Constants.RecordStatus.Inactive;
            }

            await _userManager.UpdateAsync(user);
            return Ok();
        }
    }
}