import { AddressModel } from './../address.model';
import { AttachmentDetailModel } from '../attachment/attachment.detail.model';
import { CustomerDetailModel } from '../customer/customer.detail.model';
import { InvoiceItemModel, VendorPersonalInfoModel } from '..';

export class AgedPayablesDetail {
    public id: number;
    public vendorName: string;
    public invoiceNumber: string;
    public tax: number;
    public discount: number;
    public amount: number;

    public totalAmount: number;
    public totalLessThan30: number;
    public totalThirtyFirstToSixty: number;
    public totalSixtyOneToNinety:number;
    public totalMoreThanNinety:number;
    public createdOn: string;

    public allNotYetOverdue: number;
    public all30OrLess: number;
    public all31To60: number;
    public all61To90: number;
    public all91OrMore: number;
    public allTotalUnpaid: number;
    public allTotalAmount: number;
    public asOfDate: string;
    public agedPayableasOfDate:string;
    public countNotYetOverDue: number;
    public countLessThan30: number;
    public countThirtyFirstToSixty: number;
    public countSixtyOneToNinety: number;
    public countMoreThanNinety: number;
    public totalUnpaid: number;

    public description: string; //
    public status: number; //
    public invoiceDate: string;
    public dueDate: string; //
    public vendorId: string;
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
