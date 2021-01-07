import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VendorModel } from '../models';
import { AppSettings } from '../helpers';

@Injectable()
export class VendorService {
  constructor(private http: HttpClient,
    private appSettings: AppSettings) { }

  add(model: VendorModel) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'Vendor/Add', model);
  }

  toggleStatus(id: number) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'Vendor/toggle-status/' + id, null);
  }

  delete(id: number) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'Vendor/delete/' + id, null);
  }

  getForEdit(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'Vendor/get-for-edit/' + id);
  }

  edit(model: VendorModel) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'Vendor/edit', model);
  }

  getDetail(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'Vendor/get-detail/' + id);
  }

  getPersonalInfo(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'vendor/get-personal-info/' + id);
  }

  getPaymentInfo(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'vendor/get-payment-info/' + id);
  }

  getSelectItems() {
    return this.http.get(this.appSettings.ApiBaseUrl + 'Vendor/get-select-items');
  }
}
