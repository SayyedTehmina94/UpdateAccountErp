import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ItemAddModel, ItemDetailModel, ItemEditModel } from '../models';
import { AppSettings } from '../helpers';

@Injectable()
export class ItemService {
  constructor(private http: HttpClient,
    private appSettings: AppSettings) { }

  add(model: ItemAddModel) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'Item/Add', model);
  }

  toggleStatus(id: number) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'Item/toggle-status/' + id, null);
  }

  delete(id: number) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'Item/delete/' + id, null);
  }

  getForEdit(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'Item/get-for-edit/' + id);
  }

  edit(model: ItemEditModel) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'Item/edit', model);
  }

  getDetail(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'Item/get-detail/' + id);
  }

  getAllActiveOnly() {
    return this.http.get(this.appSettings.ApiBaseUrl + 'Item/get-all-active-only');
  }

  getSelectItems() {
    return this.http.get(this.appSettings.ApiBaseUrl + 'Item/get-select-items');
  }
}
