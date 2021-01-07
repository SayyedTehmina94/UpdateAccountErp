import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BankAccountAddModel, BankAccountEditModel } from '../models';
import { AppSettings } from '../helpers';

@Injectable()
export class BankAccountService {
  constructor(private http: HttpClient,
    private appSettings: AppSettings) { }

  add(model: BankAccountAddModel) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'bankAccount/Add', model);
  }

  toggleStatus(id: number) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'bankAccount/toggle-status/' + id, null);
  }

  delete(id: number) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'bankAccount/delete/' + id, null);
  }

  getForEdit(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'bankAccount/get-for-edit/' + id);
  }

  edit(model: BankAccountEditModel) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'bankAccount/edit', model);
  }

  getDetail(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'bankAccount/get-detail/' + id);
  }

  getSelectItems() {
    return this.http.get(this.appSettings.ApiBaseUrl + 'bankAccount/get-select-items/');
  }
}
