using System.Collections.Generic;

namespace AccountErp.Utilities
{
    public class JqDataTableResponse<T> where T : class
    {
        public int Draw { get; set; }

        public int RecordsTotal { get; set; }

        public int RecordsFiltered { get; set; }

        public IEnumerable<T> Data { get; set; }

        public string Error { get; set; }
    }
}
