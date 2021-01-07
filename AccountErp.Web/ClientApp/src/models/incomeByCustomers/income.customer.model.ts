import { AttachmentDetailModel } from '../attachment/attachment.detail.model';
import { CustomerDetailModel } from '../customer/customer.detail.model';
import { InvoiceItemModel } from '..';

export class IncomeCustomerDetail {
    public id: number;
    public customerName: string;
    public invoiceNumber: string;
    public amount: number;
    public totalAmount: number;
    public allPurchases: number;
    public paidPurchases: number;
    public startDate: string; ///
    public endDate: string; ///
    public invoiceDate: string;
    public dueDate: string; //
    public customerId: string;
    public customer: CustomerDetailModel;
    public items: Array<InvoiceItemModel>;

    constructor() {
        this.customer = new CustomerDetailModel();
        this.items = new Array<InvoiceItemModel>();
    }
}
