import { AttachmentEditModel } from '..';

export class BillEditModel {
    public id:number;
    public vendorId: string;
    public phone: string;
    public email: string;
    public referenceNumber: string;
    public billDate:string;
    public dueDate: string;
    public tax: number;
    public discount: number;
    public totalAmount: number;
    public remark: string;
    public billNumber:string;
    public subTotal:number;
    public lineAmountSubTotal: number;

    public items: any;
    public attachments: Array<AttachmentEditModel>;

    constructor() {
        this.vendorId = '';
        this.items = new Array<number>();
        this.attachments = new Array<AttachmentEditModel>();
        this.lineAmountSubTotal=0;
    }
}
