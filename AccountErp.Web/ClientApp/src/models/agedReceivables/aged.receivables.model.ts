import { AttachmentDetailModel } from '../attachment/attachment.detail.model';
import { CustomerDetailModel } from '../customer/customer.detail.model';
import { InvoiceItemModel } from '..';

export class AgedReceivablesDetail {
    public id: number;
    public customerName: string;
    public invoiceNumber: string;
    public amount: number;
    public invoiceDate: string;

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

    public countNotYetOverDue: number;
    public countLessThan30: number;
    public countThirtyFirstToSixty: number;
    public countSixtyOneToNinety: number;
    public countMoreThanNinety: number;
    public totalUnpaid: number;
    
    public customerId: string;
    public customer: CustomerDetailModel;
    public agedReceivablesOfDate:string;
    public items: Array<InvoiceItemModel>;

    constructor() {
        this.customer = new CustomerDetailModel();
        this.items = new Array<InvoiceItemModel>();
    }
}
