export class AddressModel {
    public id: number;
    public countryId: string;
    public streetNumber: string;
    public streetName: string;
    public city: string;
    public state: string;
    public postalCode: string;
    public countryName: string;

    constructor() {
        this.countryId = '';
    }
}
