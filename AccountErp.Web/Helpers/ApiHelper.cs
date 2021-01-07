using Newtonsoft.Json;
using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;

namespace AccountErp.Web.Helpers
{
    public static class ApiHelper
    {
        public static async Task<ApiResponseModel<T>> ExecuteGetAsync<T>(string url, string authToken)
        {
            var apiResponse = new ApiResponseModel<T>();

            using (var client = new WebClient())
            {
                if (!string.IsNullOrEmpty(authToken))
                {
                    client.Headers.Add("Authorization", authToken);
                }

                try
                {
                    var response = await client.DownloadStringTaskAsync(url);
                    apiResponse.StatusCode = HttpStatusCode.OK;
                    apiResponse.Data = JsonConvert.DeserializeObject<T>(response);
                    return apiResponse;
                }
                catch (WebException ex)
                {
                    apiResponse.StatusCode = ((HttpWebResponse)ex.Response).StatusCode;
                    apiResponse.Error = ex.Message;
                    apiResponse.StackTrace = ex.StackTrace;
                    if (ex.Status != WebExceptionStatus.ProtocolError)
                    {
                        return apiResponse;
                    }

                    var responseStream = ((HttpWebResponse)ex.Response).GetResponseStream();

                    if (responseStream == null)
                    {
                        return apiResponse;
                    }

                    using (var r = new StreamReader(responseStream))
                    {
                        var response = r.ReadToEnd();
                        apiResponse.Error = response;
                    }
                }
                catch (Exception ex)
                {
                    apiResponse.Error = ex.Message;
                    apiResponse.StackTrace = ex.StackTrace;
                }
            }

            return apiResponse;
        }

        public static async Task<ApiResponseModel<T>> ExecutePostAsync<T>(string url, object model, string authToken)
        {
            var apiResponse = new ApiResponseModel<T>();

            using (var client = new WebClient())
            {
                if (!string.IsNullOrEmpty(authToken))
                {
                    client.Headers.Add("Authorization", authToken);
                }

                try
                {
                    client.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    var data = JsonConvert.SerializeObject(model);
                    var response = await client.UploadStringTaskAsync(url, data);
                    apiResponse.StatusCode = HttpStatusCode.OK;
                    if (!string.IsNullOrEmpty(response))
                    {
                        apiResponse.Data = JsonConvert.DeserializeObject<T>(response);
                    }
                    return apiResponse;
                }
                catch (WebException ex)
                {
                    apiResponse.StatusCode = ((HttpWebResponse)ex.Response).StatusCode;
                    apiResponse.Error = ex.Message;
                    apiResponse.StackTrace = ex.StackTrace;
                    if (ex.Status != WebExceptionStatus.ProtocolError)
                    {
                        return apiResponse;
                    }

                    var responseStream = ((HttpWebResponse)ex.Response).GetResponseStream();

                    if (responseStream == null)
                    {
                        return apiResponse;
                    }

                    using (var r = new StreamReader(responseStream))
                    {
                        var response = r.ReadToEnd();
                        apiResponse.Error = !string.IsNullOrEmpty(response)
                            ? response
                            : ((HttpWebResponse)ex.Response).StatusDescription;
                    }
                }
                catch (Exception ex)
                {
                    apiResponse.Error = ex.Message;
                    apiResponse.StackTrace = ex.StackTrace;
                }
            }

            return apiResponse;
        }
    }
}
