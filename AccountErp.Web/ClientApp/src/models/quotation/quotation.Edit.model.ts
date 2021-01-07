import { AttachmentAddModel, AttachmentEditModel } from '../';
import { quotationItemAddModel } from './quotation.item.add.model';

export class quotationEditModel {
    public id:number;
    public customerId: string;
    public email:string;
    public phone:string;
    public  quotationNumber: string;
    public tax: number;
    public discount: number;
    public totalAmount: number;
    public remark: string;
    public quotationDate:string;
    public expiryDate:string;
    public posoNumber:string;
    public subTotal:number;
    public lineAmountSubTotal: number;
  

    public items: any;
    public attachments: Array<AttachmentEditModel>;

    constructor() {
        this.customerId = '';
        this.items = new Array<quotationItemAddModel>();
        this.attachments = new Array<AttachmentEditModel>();
        this.lineAmountSubTotal=0;
    }
}