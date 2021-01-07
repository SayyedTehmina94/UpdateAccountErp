import { AddressModel } from '../address.model';

export class CustomerDetailModel {
    public id: number;
    public firstName: string;
    public middleName: string;
    public lastName: string;
    public email: string;
    public phone: string;
    public address: AddressModel;
    public discount: number;

    public accountNumber: string;
    public bankName: string;
    public branchName: string;
    public ifsc: string;
}
