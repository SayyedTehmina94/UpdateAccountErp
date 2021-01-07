using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace AccountErp.Models.Account
{
    public class ChangePasswordModel
    {
        [Required]
        [MinLength(6)]
        [MaxLength(50)]
        public string CurrentPassword { get; set; }

        [Required]
        [MinLength(6)]
        [MaxLength(50)]
        public string NewPassword { get; set; }

        [Required]
        [Compare("NewPassword")]
        public string ConfirmPassword { get; set; }
    }
}
