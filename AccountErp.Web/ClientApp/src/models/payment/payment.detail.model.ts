import { CustomerDetailModel } from '../customer/customer.detail.model';
import { AttachmentDetailModel } from '../attachment/attachment.detail.model';

export class PaymentDetailModel {
    public id: string;
    public refernceNumber: string;
    public customerId: string;
    public paymentDate: string;
    public accountNumber: string;
    public depositTo: string;
    public paymentMethodName: string;
    public paymentReference: string;
    public amount: number;
    public balance: number;
    public remark: string;

    public customer: CustomerDetailModel;
    public attachments: Array<AttachmentDetailModel>;

    constructor() {
        this.customer = new CustomerDetailModel();
        this.attachments = new Array<AttachmentDetailModel>();
    }
}
