import { AttachmentAddModel } from '../';

export class InvoiceAddModel {
    public customerId: string;
    public phone: string;
    public email: string;
    public invoiceNumber: string;
    public tax: number;
    public discount: number;
    public totalAmount: number;
    public remark: string;
    public invoiceDate:string;
    public dueDate:string;
    public poSoNumber:string;
    public subTotal:number;
    public lineAmountSubTotal: number;
   
  

    public items: any;
    public attachments: Array<AttachmentAddModel>;

    constructor() {
        this.customerId = '';
        this.items = new Array<number>();
        this.attachments = new Array<AttachmentAddModel>();
        this.lineAmountSubTotal=0;
    }
}
