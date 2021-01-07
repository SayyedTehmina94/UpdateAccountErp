using System;
using System.Text;

namespace AccountErp.Web.Helpers
{
    public static class Utility
    {
        public static string GetFullName(string firstName, string middleName, string lastName)
        {
            if (!string.IsNullOrEmpty(middleName) && !string.IsNullOrEmpty(lastName))
            {
                return $"{firstName} {middleName} {lastName}";
            }

            if (string.IsNullOrEmpty(middleName) && !string.IsNullOrEmpty(lastName))
            {
                return $"{firstName} {lastName}";
            }

            if (string.IsNullOrEmpty(lastName))
            {
                return $"{firstName} {middleName}";
            }

            return firstName;
        }

        public static string GetFullAddress(string streetNumber, string streetName, string city, string state, string postalCode)
        {
            var completeAddress = new StringBuilder();

            if (!string.IsNullOrEmpty(streetNumber))
            {
                completeAddress.Append(streetNumber);
            }

            if (!string.IsNullOrEmpty(streetName))
            {
                completeAddress.Append(
                    string.IsNullOrEmpty(completeAddress.ToString()) ? streetName : " " + streetName);
            }

            if (!string.IsNullOrEmpty(city))
            {
                completeAddress.Append(
                    string.IsNullOrEmpty(completeAddress.ToString()) ? city : ", " + city);
            }

            if (!string.IsNullOrEmpty(state))
            {
                completeAddress.Append(
                    string.IsNullOrEmpty(completeAddress.ToString()) ? state : ", " + state);
            }

            if (!string.IsNullOrEmpty(postalCode))
            {
                completeAddress.Append(
                    string.IsNullOrEmpty(completeAddress.ToString()) ? postalCode : "- " + postalCode);
            }

            return completeAddress.ToString();
        }

        public static string NumberToWords(decimal number)
        {
            return NumberToWords(Convert.ToInt32(number));
        }

        public static string NumberToWords(int number)
        {
            if (number == 0)
            {
                return "Zero";
            }

            if (number < 0)
            {
                return "Minus " + NumberToWords(Math.Abs(number));
            }

            var words = "";

            if (number / 1000000 > 0)
            {
                words += NumberToWords(number / 1000000) + " Million ";
                number %= 1000000;
            }

            if (number / 1000 > 0)
            {
                words += NumberToWords(number / 1000) + " Thousand ";
                number %= 1000;
            }

            if (number / 100 > 0)
            {
                words += NumberToWords(number / 100) + " Hundred ";
                number %= 100;
            }

            if (number <= 0)
            {
                return words;
            }

            if (words != "")
            {
                words += "and ";
            }

            var unitsMap = new[] { "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen" };
            var tensMap = new[] { "Zero", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety" };

            if (number < 20)
            {
                words += unitsMap[number];
            }
            else
            {
                words += tensMap[number / 10];
                if ((number % 10) > 0)
                {
                    words += "-" + unitsMap[number % 10];
                }
            }

            return words;
        }

    }
}
