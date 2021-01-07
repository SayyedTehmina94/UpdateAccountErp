export class ExpenseSummaryModel {
    public id: number;
    public vendorId: number;
    public vendorName: string;
    public referenceNumber: string;
    public dueDate: string;
    public tax: number;
    public discount: number;
    public totalAmount: number;
    public description: string;
}
