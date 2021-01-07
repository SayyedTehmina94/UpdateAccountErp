import { AddressModel } from '../address.model';
import { ContactModel } from './contact.model';

export class VendorDetailModel {
    public id: number;
    public registrationNumber:string;
    public name: string;
    public phone:string;
    public fax:string;
    public email:string;
    public website:string;
    public billingAddress:AddressModel;
    public shippingAddress:AddressModel;

    public contacts : Array<ContactModel>;

    public accountNumber : string;
    public bankName :string;
    public branchName:string;
    public ifsc:string;

    public discount:number;

    constructor(){
        this.billingAddress = new AddressModel();
        this.shippingAddress = new AddressModel();
        this.contacts = new Array<ContactModel>();
    }
}
