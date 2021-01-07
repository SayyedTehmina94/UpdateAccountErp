import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/helpers';
import { CustomerStatementDetail } from 'src/models/customerStatement/customer.statement.detail.model';
import { customerAccountModel } from 'src/models/chartofaccount/customeraccount';
import { customerAccountEditModel } from 'src/models/chartofaccount/customeraccountedit';


@Injectable({
  providedIn: 'root'
})
export class ChartOfAccountsService {

  constructor(private http: HttpClient,
    private appSettings: AppSettings) { }

  add(model: customerAccountModel) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'bankAccount/Add', model);
  }

  getAssetAccounts(){
    
  }

  getAllAccountTypes(){
    
   
    return this.http.get(this.appSettings.ApiBaseUrl + 'ChartofAccount/getCOADetails');
  }

  getAccountsByType(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'ChartofAccount/getAccountByTypeId/' + id);
  }

  getAccountsByMasterType(id: number) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'ChartofAccount/getDetailsByMasterId/' + id,null);
  }

  getaccbyledgertype(id:number){
    return this.http.post(this.appSettings.ApiBaseUrl + 'BankAccount/getDetailByLedgerType/?typeId=' + id,null);
  }

  delete(id: number) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'Customer/delete/' + id, null);
  }

  getForEdit(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'bankAccount/get-for-edit/' + id);
  }

  edit(model: customerAccountModel) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'bankAccount/edit', model);
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
