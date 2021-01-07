import { AddressModel } from './../address.model';
import { AttachmentDetailModel } from '../attachment/attachment.detail.model';
import { CustomerDetailModel } from '../customer/customer.detail.model';
import { InvoiceItemModel, VendorPersonalInfoModel } from '..';

export class CashFlowDetail {
    public id: number;
    public vendorName: string;
    public invoiceNumber: string;
    public tax: number;
    public discount: number;
    public amount: number;
    public totalAmount: number;
    public allPurchases: number;
    public paidPurchases: number;
    public remark: string;
    public createdOn: string;
    public startDate: string; ///
    public endDate: string; ///
    public description: string; //
    public status: number; //
    public invoiceDate: string;
    public asOfDate: string; //

    public income:number;

    public customer: CustomerDetailModel;
    public vendor: VendorPersonalInfoModel;
    public items: Array<InvoiceItemModel>;
    public attachments: Array<AttachmentDetailModel>;

    constructor() {
        this.customer = new CustomerDetailModel();
        this.vendor = new VendorPersonalInfoModel();
        this.items = new Array<InvoiceItemModel>();
        this.attachments = new Array<AttachmentDetailModel>();
    }
}
