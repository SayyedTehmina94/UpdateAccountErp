using System.Collections.Generic;
using System.Linq;

namespace AccountErp.Utilities
{
    public class JqDataTableRequest
    {
        public int Draw { get; set; }

        public int Start { get; set; }

        public int Length { get; set; }

        public JqDataTableSearch Search { get; set; }

        public List<JqDataTableSort> Order { get; set; }

        public List<JqDataTableColumn> Columns { get; set; }

        public string GetSortExpression()
        {
            var columnIndex = Order.FirstOrDefault()?.Column ?? 0;
            var sortDir = Order.FirstOrDefault()?.Dir ?? "asc";
            var columnName = Columns[columnIndex].Data;
            return $"{columnName} {sortDir}";
        }
    }
}
