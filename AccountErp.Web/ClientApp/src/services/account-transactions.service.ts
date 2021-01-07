import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/helpers';
import { AccountTransactionDetail } from 'src/models/accountTransaction/accountTransaction.model';

@Injectable({
  providedIn: 'root'
})
export class AccountTransactionsService {

  constructor(private http: HttpClient,
    private appSettings: AppSettings) { }


    add(model: AccountTransactionDetail) {
      return this.http.post(this.appSettings.ApiBaseUrl + 'Report/Add', model);
    }
  
    getAllaccounts(){
      return this.http.get(this.appSettings.ApiBaseUrl + 'ChartofAccount/getCOADetailsWithAccount');
    }
  
    getAccountTransaction(accountTransactionDetail){
      
      return this.http.post(this.appSettings.ApiBaseUrl + 'Report/Account_Transaction', accountTransactionDetail);
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
  
    // edit(model: CustomerStatementDetail) {
    //   return this.http.post(this.appSettings.ApiBaseUrl + 'Customer/edit', model);
    // }
  
    getDetail(id: number) {
      return this.http.get(this.appSettings.ApiBaseUrl + 'Report/get-detail/' + id);
    }
  
    getSelectItems() {
      return this.http.get(this.appSettings.ApiBaseUrl + 'Report/get-select-items');
    }
  
    getPaymentInfo(id: number) {
      return this.http.get(this.appSettings.ApiBaseUrl + 'Report/get-payment-info/' + id);
    }
  
    getReferenceNumber(salesId: any) {
      return this.http.get(this.appSettings.ApiBaseUrl + 'Report/get-reference-number/' + salesId);
    }
}
