export class ShippingAddressModel {
    public id: number;
    public countryId: string;
    public shipTo: string;
    public addressLine1: string;
    public addressLine2:string;
    public city: string;
    public state: string;
    public postalCode: string;
    public deliveryInstruction: string;

   

    constructor() {
        this.countryId = '';
    }
}