import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreditCardAddModel, CreditCardDetailModel, CreditCardEditModel } from '../models';
import { AppSettings } from '../helpers';

@Injectable()
export class CreditCardService {
  constructor(private http: HttpClient,
    private appSettings: AppSettings) { }

    add(model : CreditCardAddModel){
      return this.http.post(this.appSettings.ApiBaseUrl + 'CreditCard/Add',model);
    }
    toggleStatus(id: number) {
      return this.http.post(this.appSettings.ApiBaseUrl + 'CreditCard/toggle-status/' + id, null);
    }
    delete(id: number) {
      return this.http.post(this.appSettings.ApiBaseUrl + 'CreditCard/delete/' + id, null);
    }
    getForEdit(id: number) {
      return this.http.get(this.appSettings.ApiBaseUrl + 'CreditCard/get-for-edit/' + id);
    }
    edit(model: CreditCardEditModel) {
      return this.http.post(this.appSettings.ApiBaseUrl + 'CreditCard/edit', model);
    }
    getDetail(id: number) {
      return this.http.get(this.appSettings.ApiBaseUrl + 'CreditCard/get-detail/' + id);
    }
    getSelectItems() {
      return this.http.get(this.appSettings.ApiBaseUrl + 'CreditCard/get-select-items');
    }
}