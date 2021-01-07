import { AttachmentEditModel } from '../';

export class InvoiceEditModel {
    public id: number;
    public customerId: string;
    public phone: string;
    public email: string;
    public invoiceNumber: string;
    public tax: number;
    public discount: number;
    public totalAmount: number;
    public remark: string;
    public poso: number;
    public memo: string;
    public subTotal:number;
    public invoiceDate: string;
    public dueDate: string;
    public lineAmountSubTotal: number;

    public items: any;
    public attachments: Array<AttachmentEditModel>;

    constructor() {
        this.customerId = '';
        this.items = new Array<number>();
        this.attachments = new Array<AttachmentEditModel>();
        this.lineAmountSubTotal=0;
    }
}
