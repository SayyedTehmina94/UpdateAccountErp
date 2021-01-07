import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LoginModel, ChangePasswordModel , AccountAddModel , SettingEditModel} from '../models';
import { AppSettings } from '../helpers';

@Injectable()
export class AccountService {
    constructor(private http: HttpClient,
        private appSettings: AppSettings) { }

    login(model: LoginModel) {
        return this.http.post(this.appSettings.ApiBaseUrl + 'account/token', model);
    }

    changePassword(model: ChangePasswordModel) {
        return this.http.post(this.appSettings.ApiBaseUrl + 'account/change-password', model);
    }
    
    add(model : AccountAddModel){
        return this.http.post(this.appSettings.ApiBaseUrl + 'account/Add',model);
    }
    getRoleSelectItems() {
        return this.http.get(this.appSettings.ApiBaseUrl + 'account/get-role-select-item');
    }
    getForEdit() {
        return this.http.get(this.appSettings.ApiBaseUrl + 'Account/get-for-edit');
      }
    
      edit(model: SettingEditModel) {
        return this.http.post(this.appSettings.ApiBaseUrl + 'Account/edit', model);
      }

      toggleStatus(id: string) {
        return this.http.post(this.appSettings.ApiBaseUrl + 'Account/toggle-status/' + id, null);
      }
      delete(id: string) {
        return this.http.post(this.appSettings.ApiBaseUrl + 'Account/delete/' + id, null);
      }
}
