import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppSettings } from '../helpers';

@Injectable()
export class MasterDataService {
    constructor(private http: HttpClient,
        private appSettings: AppSettings) { }

    getCountries() {
        return this.http.get(this.appSettings.ApiBaseUrl + 'master/get-country');
    }

    getItemType() {
        return this.http.get(this.appSettings.ApiBaseUrl + 'master/get-item-type');
    }

    getVendorTaxType() {
        return this.http.get(this.appSettings.ApiBaseUrl + 'master/get-vendor-tax');
    }

    getIncomeAccounts(){
return null;
    }

    getExpenseAccounts(){
        return null;
    }
}
