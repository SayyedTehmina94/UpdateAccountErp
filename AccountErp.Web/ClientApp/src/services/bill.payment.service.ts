import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BillPaymentModel } from '../models';
import { AppSettings } from '../helpers';

@Injectable()
export class BillPaymentService {
    constructor(private http: HttpClient,
        private appSettings: AppSettings) { }

    add(model: BillPaymentModel) {
        return this.http.post(this.appSettings.ApiBaseUrl + 'billPayment/add', model);
    }
    getUnpaidBills(){
        return this.http.get(this.appSettings.ApiBaseUrl + 'Bill/get-AllUnpaidBills');
    }
    
}
