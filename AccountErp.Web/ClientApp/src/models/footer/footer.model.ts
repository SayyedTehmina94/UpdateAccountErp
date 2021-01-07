export class FooterInvoiceOverDueModel {
    public id: number;
    public customerId: number;
    public customerName: string;
    public invoiceNumber: string;
    public amount: number;
    public totalAmount: number;
    public invoiceDate: string;
}

export class FooterInvoiceOverDueMainModel
{
 //   public invoiceListTopTensList : new Array<FooterInvoiceOverDueModel>;
    public invoiceListTopTensList: Array<FooterInvoiceOverDueModel>;
    public count: number;
}

export class FooterRecurringInvoiceMainModel
{
 //   public invoiceListTopTensList : new Array<FooterInvoiceOverDueModel>;
    public recListTopTenDtos: Array<FooterRecurringInvoiceModel>;
    public count: number;
}

export class FooterRecurringInvoiceModel {
    public id: number;
    public customerId: number;
    public customerName: string;
    public invoiceNumber: string;
    public amount: number;
    public totalAmount: number;
    public recInvoiceDate: string;
}