import { AttachmentAddModel } from '../';
import { quotationItemAddModel } from './quotation.item.add.model';

export class quotationAddModel {
    public customerId: string;
    public email:string;
    public phone:string;
   // public quotationNumber: string;
    public tax: number;
    public discount: number;
    public totalAmount: number;
    public remark: string;
    public quotationDate:string;
    public expiryDate:string;
    public subTotal:number;
    public lineAmountSubTotal: number;
  

    public items: any;
    public attachments: Array<AttachmentAddModel>;

    constructor() {
        this.customerId = '';
        this.items = new Array<quotationItemAddModel>();
        this.attachments = new Array<AttachmentAddModel>();
        this.lineAmountSubTotal=0;
    }
}

