export class ItemAddModel {
    public itemTypeId: string;
    public name: string;
    public rate: number;
    public discription: string;
    public isTaxable: string;
    public salesTaxId: string;
    public bankAccountId:string;
    public isForSell:string;

    constructor() {
        this.itemTypeId = '';
        this.salesTaxId = '';
        this.isTaxable = '0';
        this.bankAccountId='';
        this.isForSell='1';
    }
}
