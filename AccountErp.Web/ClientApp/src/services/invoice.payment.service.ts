import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InvoicePaymentModel } from '../models';
import { AppSettings } from '../helpers';

@Injectable()
export class InvoicePaymentService {
    constructor(private http: HttpClient,
        private appSettings: AppSettings) { }

    add(model: InvoicePaymentModel) {
        
        return this.http.post(this.appSettings.ApiBaseUrl + 'invoicePayment/add', model);
    }
    
    getUnpaidInvoice(){
        return this.http.get(this.appSettings.ApiBaseUrl + 'Invoice/get-AllUnPaid');
    }
}
