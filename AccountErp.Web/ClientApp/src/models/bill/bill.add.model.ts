import { AttachmentAddModel } from '..';

export class BillAddModel {
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
    public subTotal:number;
    public lineAmountSubTotal: number;

    public items: any;
    public attachments: Array<AttachmentAddModel>;

    constructor() {
        this.vendorId = '';
        this.items = new Array<number>();
        this.attachments = new Array<AttachmentAddModel>();
        this.lineAmountSubTotal=0;
    }
}
