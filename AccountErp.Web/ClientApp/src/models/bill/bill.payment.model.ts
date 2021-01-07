export class BillPaymentModel {
    public id: number;
    public billId: number;
    public paymentMode:string;
    public paymentDate : string;
    public creditCardId:string;
    public bankAccountId: string;
    public depositTo: string;
    public chequeNumber:string;
    public description:string;
    public vendorId:string;
    public paymentType:number;
    public amount: number;
    public debitBankAccountId: string;

    constructor() {
        this.paymentMode = '';
        this.creditCardId = '';
        this.bankAccountId = '';
        this.depositTo = '';
        this.billId=0;
    }
}
