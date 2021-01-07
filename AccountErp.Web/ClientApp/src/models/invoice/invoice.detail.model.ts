import { AttachmentDetailModel } from '../attachment/attachment.detail.model';
import { CustomerDetailModel } from '../customer/customer.detail.model';
import { InvoiceItemModel } from './invoice.item.model';

export class InvoiceDetailModel {
    public id: number;
    public customerName: string;
    public invoiceNumber: string;
    public tax: number;
    public discount: number;
    public amount: number;
    public totalAmount: number;
    public remark: string;
    public createdOn: string;

    public description: string; //
    public status: number; //
    public invoiceDate: string;
    public dueDate: string; //
    public poSoNumber: number; //

    public customer: CustomerDetailModel;
    public lineAmountSubTotal: number;

    public items: Array<InvoiceItemModel>;
    public attachments: Array<AttachmentDetailModel>;

    constructor() {
        this.customer = new CustomerDetailModel();
        this.items = new Array<InvoiceItemModel>();
        this.attachments = new Array<AttachmentDetailModel>();
    }
}
