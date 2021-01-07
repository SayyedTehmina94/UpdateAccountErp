import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/helpers';
import { CashFlowDetail } from 'src/models/cashFlow/cash.flow.model';

@Injectable({
  providedIn: 'root'
})
export class CashFlowService {

  constructor(private http: HttpClient,
    private appSettings: AppSettings) { }

    add(model: CashFlowDetail) {
      return this.http.post(this.appSettings.ApiBaseUrl + 'Report/Add', model);
    }
  
  
    getCashFlowSummary(cashFlowDetail){
      
  
      return this.http.post(this.appSettings.ApiBaseUrl + 'Report/cash_fLow_report_Summary', cashFlowDetail);
    }


    getCashFlowDetails(cashFlowDetail){
      
  
      return this.http.post(this.appSettings.ApiBaseUrl + 'Report/cash_fLow_report_Detail', cashFlowDetail);
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
