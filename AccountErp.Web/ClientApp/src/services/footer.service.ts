import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/helpers';

@Injectable()
export class FooterService {

  constructor(private http: HttpClient,
    private appSettings: AppSettings) { }

 

  getInvoiceOverDue() {
    return this.http.get(this.appSettings.ApiBaseUrl + 'Invoice/getTopTenInvoice');
  }

  getRecurringInvoice() {
    return this.http.get(this.appSettings.ApiBaseUrl + 'RecurringInvoice/getTopTenRecurringInvoices');
  }

  
}
