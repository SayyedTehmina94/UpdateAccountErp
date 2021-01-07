import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/helpers';
import { SalesTAxReportDetail } from 'src/models/sales-tax-report/sales.tax.report.model';

@Injectable({
  providedIn: 'root'
})
export class SalesTaxReportService {

  constructor(private http: HttpClient,
    private appSettings: AppSettings) { }


    add(model: SalesTAxReportDetail) {
      return this.http.post(this.appSettings.ApiBaseUrl + 'Report/Add', model);
    }
  
  
    getSalesTaxStatement(salesTaxReportDetail){
      
  
      return this.http.post(this.appSettings.ApiBaseUrl + 'Report/sales_tax_report_details', salesTaxReportDetail);
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
   
    getSelectItems() {
      return this.http.get(this.appSettings.ApiBaseUrl + 'Report/get-select-items');
    }
  
    getPaymentInfo(id: number) {
      return this.http.get(this.appSettings.ApiBaseUrl + 'Report/get-payment-info/' + id);
    }
  
    getReferenceNumber(salesId: any) {
      return this.http.get(this.appSettings.ApiBaseUrl + 'Report/get-reference-number/' + salesId);
    }

    getDetail(model: any) {
      return this.http.post(this.appSettings.ApiBaseUrl + 'Report/sales_tax_report_details', model);
    }

}
