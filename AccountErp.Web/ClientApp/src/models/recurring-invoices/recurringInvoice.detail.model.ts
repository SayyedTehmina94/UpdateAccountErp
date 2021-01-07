import { AttachmentAddModel } from '..';
import { AttachmentEditModel } from '../attachment/attachment.edit.model';

export class RecurringInvoiceDetailModel {
    public id:number;
    public customerId: string;
    public phone: string;
    public email: string;
    public recInvoiceNumber: string;
    public tax: number;
    public discount: number;
    public totalAmount: number;
    public remark: string;
    public recInvoiceDate:string;
    public recDueDate:string;
    public poSoNumber:string;
    public lineAmountSubTotal: number;
   
  

    public items: any;
    public attachments: Array<AttachmentEditModel>;

    constructor() {
        this.customerId = '';
        this.items = new Array<number>();
        this.attachments = new Array<AttachmentEditModel>();
        this.lineAmountSubTotal=0
    }
}
