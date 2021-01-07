import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../helpers';
import { SalesTaxAddModel, SalesTaxEditModel } from 'src/models';

@Injectable()
export class SalesTaxService {

  constructor(private http: HttpClient,
    private appSettings: AppSettings) { }

  add(model: SalesTaxAddModel) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'salesTax/Add', model);
  }

  getSelectListItems() {
    return this.http.get(this.appSettings.ApiBaseUrl + 'salesTax/get-select-list-items');
  }

  getActiveOnly() {
    return this.http.get(this.appSettings.ApiBaseUrl + 'salesTax/get-active-only');
  }

  delete(id: number) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'salesTax/delete/' + id, null);
  }
  getForEdit(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'salesTax/get-for-edit/' + id);
  }
  edit(model: SalesTaxEditModel) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'salesTax/edit', model);
  }
  getDetail(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'salesTax/get-detail/' + id);
  }
  toggleStatus(id: string) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'salesTax/toggle-status/' + id, null);
  }
}
