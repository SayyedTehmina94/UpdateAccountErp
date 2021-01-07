using System.Net;

namespace AccountErp.Web.Helpers
{
    public class ApiResponseModel
    {
        public object Data { get; set; }

        public HttpStatusCode StatusCode { get; set; }
        public object Error { get; set; }
        public string StackTrace { get; set; }
    }

    public class ApiResponseModel<T>
    {
        public T Data { get; set; }

        public HttpStatusCode StatusCode { get; set; }
        public object Error { get; set; }
        public string StackTrace { get; set; }
    }
}
