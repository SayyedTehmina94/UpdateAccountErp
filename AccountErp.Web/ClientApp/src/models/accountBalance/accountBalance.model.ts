import { AddressModel } from './../address.model';
import { AttachmentDetailModel } from '../attachment/attachment.detail.model';
import { CustomerDetailModel } from '../customer/customer.detail.model';
import { InvoiceItemModel, VendorPersonalInfoModel } from '..';

export class AccountBalanceDetail {
    public id: number;
    public vendorName: string;
    public invoiceNumber: string;
    public tax: number;
    public discount: number;
    public amount: number;

    public totalAmount: number;
    public allStartingBalance: number;
    public allCreditBalance: number;
    public allDebitBalance: number;
    public allNetMovementBalance: number;
    public allEndingBalance: number;
  
    public allStartingBalanceLiabilites: number;
    public allDebitLiabilites: number;
    public allCreditLiabilites: number;
    public allNetMovementLiabilites: number;
    public allEndingLiabilites: number;
  
    public allStartingBalanceEquity: number;
    public allDebitEquity: number;
    public allCreditEquity: number;
    public allNetMovementEquity: number;
    public allEndingEquity: number;
  
    public allDebitIncome: number;
    public allCreditIncome: number;
    public allNetMovementIncome: number;
  
    public allDebitExpense: number;
    public allCreditExpense: number;
    public allNetMovementExpense: number;

    public allDebitExpTotal: number;
    public allCreditExpTotal: number; 

    public description: string; //
    public status: number; //
    public invoiceDate: string;
    public dueDate: string; //
    public  fromDate: string;

    
    public startDate: string;
    public  endDate: string;
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
