import { AddressModel } from './../address.model';
import { AttachmentDetailModel } from '../attachment/attachment.detail.model';
import { CustomerDetailModel } from '../customer/customer.detail.model';
import { InvoiceItemModel } from '..';

export class CustomerStatementDetail {
    public id: number;
    public customerName: string;
    public invoiceNumber: string;
    public tax: number;
    public discount: number;
    public amount: number;
    public totalAmount: number;
    public remark: string;
    public createdOn: string;
    public customerId: string; ///
    public phone: string;  ///
    public email: string;  ///
    public address: AddressModel; ///
    public startDate: string; ///
    public endDate: string; ///
    public description: string; //
    public status: number; //
    public invoiceDate: string;
    public dueDate: string; //
    public statementType:any;
    public customer: CustomerDetailModel;

    public items: Array<InvoiceItemModel>;
    public attachments: Array<AttachmentDetailModel>;

    constructor() {
        this.customer = new CustomerDetailModel();
        this.items = new Array<InvoiceItemModel>();
        this.attachments = new Array<AttachmentDetailModel>();
    }
}
