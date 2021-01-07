export class InvoiceItemModel {
    public id: number;
    public itemTypeName: number;
    public name: string;
    public rate: number;
    public price:number;
    public quantity:number;
    public lineAmount:number;

    public taxCode:string;
    public taxPercentage:number;
    public taxId:number;

    public description: string;
}
