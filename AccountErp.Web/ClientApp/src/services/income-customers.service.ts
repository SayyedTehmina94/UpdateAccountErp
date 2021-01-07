
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/helpers';
import { IncomeCustomerDetail } from 'src/models/incomeByCustomers/income.customer.model';

@Injectable({
  providedIn: 'root'
})
export class IncomeCustomersService {

  constructor(private http: HttpClient,
    private appSettings: AppSettings) { }

    add(model: IncomeCustomerDetail) {
      return this.http.post(this.appSettings.ApiBaseUrl + 'Report/Add', model);
    }
  
  getIncomeCustomer(incCustomerDetail){
    
    return this.http.post(this.appSettings.ApiBaseUrl + 'Report/customer_report_details', incCustomerDetail);
  }

  toggleStatus(id: number) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'Report/toggle-status/' + id, null);
  }

  delete(id: number) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'Report/delete/' + id, null);
  }

  getForEdit(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'Report/get-for-edit/' + id);
  }

  getDetail(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'Report/get-detail/' + id);
  }

  getSelectItems() {
    return this.http.get(this.appSettings.ApiBaseUrl + 'Report/get-select-items');
  }

  getPaymentInfo(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'Report/get-payment-info/' + id);
  }

  getReferenceNumber(customerId: any) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'Report/get-reference-number/' + customerId);
  }
}
