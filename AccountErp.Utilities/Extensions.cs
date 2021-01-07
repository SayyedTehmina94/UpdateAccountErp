using System.Linq;
using System.Security.Claims;
using System.Security.Principal;

namespace AccountErp.Utilities
{
    public static class Extensions
    {
        public static string GetUserId(this IPrincipal principal)
        {
            var claimsIdentity = (ClaimsIdentity)principal.Identity;
            var claim = claimsIdentity.FindFirst(ClaimTypes.NameIdentifier);
            return claim?.Value;
        }

        public static string GetUserName(this IPrincipal principal)
        {
            var claimsIdentity = (ClaimsIdentity)principal.Identity;
            var claim = claimsIdentity.FindFirst(ClaimTypes.Name);
            return claim?.Value;
        }

        public static string RemovePhoneMask(this string value)
        {
            return !string.IsNullOrEmpty(value)
                ? value.Replace("(", "")
                    .Replace(")", "")
                    .Replace(" ", "")
                    .Replace("-", "")
                : value;
        }

        public static string ApplyPhoneMask(this string value)
        {
            return !string.IsNullOrEmpty(value) && value.Length == 10
                ? value.Insert(0, "(")
                    .Insert(4, ")")
                    .Insert(5, " ")
                    .Insert(9, "-")
                : value;
        }

        public static bool IsAnyNullOrEmpty(this object myObject)
        {
            return myObject.GetType().GetProperties()
                .Where(pi => pi.PropertyType == typeof(string))
                .Select(pi => (string)pi.GetValue(myObject))
                .Any(string.IsNullOrEmpty);
        }


        public static bool IsAllNullOrEmpty(this object myObject)
        {
            return myObject.GetType().GetProperties()
                .Where(pi => pi.PropertyType == typeof(string))
                .Select(pi => (string)pi.GetValue(myObject))
                .All(string.IsNullOrEmpty);
        }
    }
}
