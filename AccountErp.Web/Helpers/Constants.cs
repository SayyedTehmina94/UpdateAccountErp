namespace AccountErp.Web.Helpers
{
    public class Constants
    {
        public const string DateFormat = "MM/dd/yyyy";

        public enum BillPaymentMode { Cash, Transfer, Cheque, CreditCard }

        public enum PaymentMode { Cash, Transfer, Check }

        public enum InvoiceStatus { Pending, Paid, Deleted }

        public enum BillStatus { Pending, Paid, Deleted }
    }
}
