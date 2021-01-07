import { AttachmentDetailModel } from '../attachment/attachment.detail.model';
import { CustomerDetailModel } from '../customer/customer.detail.model';
import { QuotationItemModel } from './QuotationItemModel';

export class QuotationDetailModel {
    public id: number;
    public customerName: string;
    public invoiceNumber: string;
    public tax: number;
    public discount: number;
    public amount: number;
    public totalAmount: number;
    public remark: string;
    public createdOn: string;

    public customer: CustomerDetailModel;

    public items: Array<QuotationItemModel>;
    public attachments: Array<AttachmentDetailModel>;
    public quotationDate:string;
    public expiryDate:string;
    public lineAmountSubTotal: number;

    constructor() {
        this.customer = new CustomerDetailModel();
        this.items = new Array<QuotationItemModel>();
        this.attachments = new Array<AttachmentDetailModel>();
    }
}
