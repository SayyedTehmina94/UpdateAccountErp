using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Models.Account
{
    public class AccountAddModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string RoleId { get; set; }
    }
}
