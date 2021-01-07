using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace AccountErp.Models.ChartOfAccount
{
    public class COA_AccountEditModel
    {
        public int Id { get; set; }
        [Required]
        public int COA_AccountTypeId { get; set; }
        [Required]
        public string AccountName { get; set; }
        public string AccountCode { get; set; }
        public string Description { get; set; }
    }
}
