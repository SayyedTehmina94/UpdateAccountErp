import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomerUpsertModel } from '../models';
import { AppSettings } from '../helpers';

@Injectable()
export class CustomerService {
  constructor(private http: HttpClient,
    private appSettings: AppSettings) { }

  add(model: CustomerUpsertModel) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'Customer/Add', model);
  }

  toggleStatus(id: number) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'Customer/toggle-status/' + id, null);
  }

  delete(id: number) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'Customer/delete/' + id, null);
  }

  getForEdit(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'Customer/get-for-edit/' + id);
  }

  edit(model: CustomerUpsertModel) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'Customer/edit', model);
  }

  getDetail(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'Customer/get-detail/' + id);
  }

  getSelectItems() {
    return this.http.get(this.appSettings.ApiBaseUrl + 'Customer/get-select-items');
  }

  getPaymentInfo(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'customer/get-payment-info/' + id);
  }

  getReferenceNumber(customerId: any) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'Customer/get-reference-number/' + customerId);
  }
}
