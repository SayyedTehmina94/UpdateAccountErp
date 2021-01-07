using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace AccountErp.Utilities
{
    public class Utility
    {
        public static TimeZoneInfo GetTimeZone(string timeZoneName)
        {
            return TimeZoneInfo.GetSystemTimeZones().SingleOrDefault(x => x.StandardName.Equals(timeZoneName));
        }

        public static DateTime GetDateTime()
        {
            return DateTime.UtcNow;
        }

        public static DateTime GetDateTime(DateTime dateTime, string timeZoneName)
        {
            //return if timezone name is empty
            if (string.IsNullOrEmpty(timeZoneName))
            {
                dateTime = DateTime.SpecifyKind(dateTime, DateTimeKind.Utc);

                return dateTime.ToLocalTime();
            }

            //return converted date time
            var timeZone = GetTimeZone(timeZoneName);
            return timeZone != null
                ? TimeZoneInfo.ConvertTime(dateTime, TimeZoneInfo.Utc, timeZone)
                : dateTime.ToLocalTime();
        }

        public static string GetFormattedDate(DateTime? dateTime)
        {
            return dateTime?.ToString(Constants.DateFormat);
        }

        public static string DefaultErrorMessage()
        {
            return "Something went wrong. Please try again after some time";
        }

        public static string GetUniqueFileName(string originalFileName)
        {
            return $"{Guid.NewGuid():N}{Path.GetExtension(originalFileName)}";
        }

        public static void CreateFolder(string path)
        {
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
        }

        public static string GetTempFolder(string basePath)
        {
            var path = $"{basePath}\\temp\\";
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            return path;
        }

        public static string GetInvoiceFolder(string basePath)
        {
            var path = $"{basePath}\\invoice\\";
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            return path;
        }

        public static string GetTempFileUrl(string baseUrl, string fileName)
        {
            return $"{baseUrl}/temp/{fileName}";
        }

        public static string GetEmailTemplateFolder(string basePath, string templateName)
        {
            return $"{basePath}\\templates\\email\\{templateName}";
        }

        public static bool IsValidImage(string extension)
        {
            var imageExtensions = new List<string> { ".JPG", ".JPEG", ".PNG" };
            return imageExtensions.Contains(extension.ToUpper());
        }
    }
}
