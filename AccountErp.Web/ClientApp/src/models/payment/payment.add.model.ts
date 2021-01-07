import { AttachmentAddModel } from '../';

export class PaymentAddModel {
    public referenceNumber:string;
    public customerId: string;
    public paymentDate: string;
    public accountNumber: string;
    public depositTo: string;
    public paymentMethodId: string;
    public paymentReference: string;
    public amount: number;
    public balance: number;
    public remark: string;

    public attachments: Array<AttachmentAddModel>;

    constructor() {
        this.customerId = '';
        this.paymentMethodId = '';
        this.attachments = new Array<AttachmentAddModel>();
    }
}
