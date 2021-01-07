using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.Dtos.ChartofAccount
{
    public class COADetailDto
    {
        public int Id { get; set; }
        public String AccountMasterName { get; set; }
        public IEnumerable<AccountTypeDetailDto> AccountTypes { get; set; }
    }
}
