import { AddressModel } from '../address.model';
import { ShippingAddressModel } from '../shippingAddress.model';

export class CustomerUpsertModel {
    public id: number;
    public firstName: string;
    public middleName: string;
    public lastName: string;
    public email: string;
    public phone: string;
    public address: AddressModel;
    public shippingAddress:ShippingAddressModel;

    public accountNumber: string;
    public bankName: string;
    public branchName: string;
    public ifsc: string;
    public countryName:string;

    public discount: number;

    constructor() {
        this.address = new AddressModel();
        this.shippingAddress = new ShippingAddressModel();

    }
}
