import { AddressModel } from '../address.model';

export class ContactModel {
    public id: number;
    public firstName: string;
    public middleName: string;
    public lastName: string;
    public jobTitle: string;
    public phone: string;
    public address: AddressModel;
    public email: string;
    constructor() {
        this.address = new AddressModel();
    }
}
