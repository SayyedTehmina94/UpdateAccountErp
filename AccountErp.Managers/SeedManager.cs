using AccountErp.DataLayer;
using AccountErp.Entities;
using AccountErp.Infrastructure.DataLayer;
using AccountErp.Infrastructure.Managers;
using AccountErp.Infrastructure.Repositories;
using AccountErp.Utilities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace AccountErp.Managers
{
    public class SeedManager : ISeedManager
    {
        private readonly ILogger _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IItemTypeRepository _itemTypeRepository;
        private readonly IPaymentMethodRepository _paymentMethodRepository;
        private readonly ICountryRepository _countryRepository;
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public SeedManager(ILogger<SeedManager> logger,
            IUnitOfWork unitOfWork,
            IItemTypeRepository itemTypeRepository,
            IPaymentMethodRepository paymentMethodRepository,
            ICountryRepository countryRepository,
            RoleManager<IdentityRole> roleManager,
            UserManager<AppUser> userManager)
        {
            _logger = logger;
            _unitOfWork = unitOfWork;
            _itemTypeRepository = itemTypeRepository;
            _paymentMethodRepository = paymentMethodRepository;
            _roleManager = roleManager;
            _userManager = userManager;
            _countryRepository = countryRepository;
        }

        public async Task InitializeAsync()
        {
            await SeedRolesAsync();
            await SeedAdminAsync();
            await SeedItemTypesAsync();
            await SeedPaymentMethodsAsync();
            await SeedCountryAsync();
        }

        private async Task SeedRolesAsync()
        {
            try
            {
                IdentityResult identityResult;

                if (!await _roleManager.Roles.AnyAsync(x => x.Name.Equals(Constants.UserType.Admin)))
                {
                    identityResult = await _roleManager.CreateAsync(new IdentityRole(Constants.UserType.Admin));
                    _logger.LogInformation($"Role ({Constants.UserType.Admin}) seed result: {identityResult}");
                }

                if (!await _roleManager.Roles.AnyAsync(x => x.Name.Equals(Constants.UserType.Employee)))
                {
                    identityResult = await _roleManager.CreateAsync(new IdentityRole(Constants.UserType.Employee));
                    _logger.LogInformation($"Role ({Constants.UserType.Employee}) seed result: {identityResult}");
                }

                _logger.LogInformation("Role seeding done.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in Role seeding {ex}");
            }
        }

        private async Task SeedAdminAsync()
        {
            try
            {
                if (!await _roleManager.Roles.AnyAsync())
                {
                    _logger.LogError("Administrator seed failed, no role found");
                }

                var user = await _userManager.FindByNameAsync("admin");

                if (user != null)
                {
                    return;
                }

                user = new AppUser
                {
                    FirstName = "Administrator",
                    UserName = "admin",
                    Email = "admin@maplenet.com",
                    EmailConfirmed = true
                };

                var result = await _userManager.CreateAsync(user, "Password@123");

                if (!result.Succeeded)
                {
                    _logger.LogError("Administrator seed failed");
                    _logger.LogError(string.Join(",", result.Errors.Select(x => x.Description)));
                    return;
                }

                result = await _userManager.AddToRoleAsync(user, Constants.UserType.Admin);

                if (result.Succeeded)
                {
                    _logger.LogInformation("Administrator seed completed");
                    return;
                }

                _logger.LogError("Administrator seed failed");
                _logger.LogError(string.Join(",", result.Errors.Select(x => x.Description)));

                await _userManager.DeleteAsync(user);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in administrator seeding {ex}");
            }
        }

        private async Task SeedItemTypesAsync()
        {

            if (await _itemTypeRepository.HasItemsAsync())
            {
                return;
            }
            try
            {
                await _itemTypeRepository.AddAsync(new ItemType
                {
                    Id = 1,
                    Name = "Application Development",
                    Status = Constants.RecordStatus.Active
                });
                await _itemTypeRepository.AddAsync(new ItemType
                {
                    Id = 2,
                    Name = "Application Hosting",
                    Status = Constants.RecordStatus.Active
                });
                await _itemTypeRepository.AddAsync(new ItemType
                {
                    Id = 3,
                    Name = "Consulting",
                    Status = Constants.RecordStatus.Active
                });

                await _unitOfWork.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in item types seeding {ex}");
            }
        }

        private async Task SeedCountryAsync()
        {
            if (await _countryRepository.HasItemsAsync())
            {
                return;
            }
            try
            {
                await _countryRepository.AddAsync(new Country
                {
                    Id = 1,
                    Name = "Canada",
                    IsoCode = "CAN",
                    Status = Constants.RecordStatus.Active
                });

                await _unitOfWork.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in country seeding {ex}");
            }
        }

        private async Task SeedPaymentMethodsAsync()
        {
            if (await _paymentMethodRepository.HasItemsAsync())
            {
                return;
            }

            try
            {

                await _paymentMethodRepository.AddAsync(new PaymentMethod
                {
                    // Id = 1,
                    Name = "Bank Transfer",
                    Status = Constants.RecordStatus.Active
                });

                await _paymentMethodRepository.AddAsync(new PaymentMethod
                {
                    //   Id = 2,
                    Name = "Cash",
                    Status = Constants.RecordStatus.Active
                });

                await _paymentMethodRepository.AddAsync(new PaymentMethod
                {
                    // Id = 3,
                    Name = "Cheque",
                    Status = Constants.RecordStatus.Active
                });

                await _unitOfWork.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in payment methods seeding {ex}");
            }
        }
    }
}
