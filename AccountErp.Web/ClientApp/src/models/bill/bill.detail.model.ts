import { AttachmentDetailModel } from '../attachment/attachment.detail.model';
import { VendorPersonalInfoModel } from '../vendor/vendor.personal.info.model';
import { SalesTaxDetailModel } from '../sales-tax/sales.tax.detail.model';

export class BillDetailModel {
    public id: number;
    public vendorId: string;
    public name:string;
    public phone: string;
    public email: string;
    public referenceNumber: string;
    public dueDate: string;
    public tax: number;
    public discount: number;
    public totalAmount: number;
    public remark: string;
    public status: number;
    public lineAmountSubTotal: number;

    public vendor: VendorPersonalInfoModel;

    public items: any;
    public attachments: Array<AttachmentDetailModel>;

    constructor() {
        this.vendor = new VendorPersonalInfoModel();

        this.items = new Array<number>();
        this.attachments = new Array<AttachmentDetailModel>();
    }
}
