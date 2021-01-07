import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/helpers';
import { ProfitLossDetail } from 'src/models/profitAndLoss/profit.loss.model';

@Injectable({
  providedIn: 'root'
})
export class ProfitLossService {

  constructor(private http: HttpClient,
    private appSettings: AppSettings) { }

    add(model: ProfitLossDetail) {
      return this.http.post(this.appSettings.ApiBaseUrl + 'Report/Add', model);
    }
  
  
    getProfitLoss(profitLossSummary){
      
  
      return this.http.post(this.appSettings.ApiBaseUrl + 'Report/profit_and_loss_details_report', profitLossSummary);
    }
  
    getProfitDetail(profitLossDetail){
      
  
      return this.http.post(this.appSettings.ApiBaseUrl + 'Report/profit_and_loss_details_report', profitLossDetail);
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
  
    getReferenceNumber(vendorId: any) {
      return this.http.get(this.appSettings.ApiBaseUrl + 'Report/get-reference-number/' + vendorId);
    }
}
