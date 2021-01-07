import { AttachmentEditModel } from '../';

export class PaymentEditModel {
    public id: string;
    public refernceNumber:string;
    public customerId: string;
    public paymentDate: string;
    public accountNumber: string;
    public depositTo: string;
    public paymentMethodId: string;
    public paymentReference: string;
    public amount: number;
    public balance: number;
    public remark: string;

    public attachments: Array<AttachmentEditModel>;

    constructor() {
        this.customerId = '';
        this.paymentMethodId = '';
        this.attachments = new Array<AttachmentEditModel>();
    }
}
