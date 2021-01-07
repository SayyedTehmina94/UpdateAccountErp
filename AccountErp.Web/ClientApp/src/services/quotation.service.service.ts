import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/helpers';
import { quotationAddModel } from 'src/models/quotation/quotation.add.model';
import { quotationEditModel } from 'src/models/quotation/quotation.Edit.model';
import { QuotationSendModel } from 'src/models/quotation/quotation.send.model';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {

  constructor(private http: HttpClient,
    private appSettings: AppSettings) { }

    getNewQuotationNumber(){
      
      return this.http.get(this.appSettings.ApiBaseUrl + 'Quotation/get-QuotationNumber');
    }

  add(model: quotationAddModel) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'Quotation/add', model);
  }

  getAllItemsActive() {
    return this.http.get(this.appSettings.ApiBaseUrl + 'item/get-all-active-only');
  }
  getAllItemsActiveForSale() {
    return this.http.get(this.appSettings.ApiBaseUrl + 'item/get-all-forSales');
  }

  loadItemsForExpense() {
    return this.http.get(this.appSettings.ApiBaseUrl + 'item/get-all-forExpense');
  }

  

  

  getAllTaxes(){
    return this.http.get(this.appSettings.ApiBaseUrl + 'SalesTax/get-select-list-items');
  }

  toggleStatus(id: number) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'Quotation/toggle-status/' + id, null);
  }

  delete(id: number) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'Quotation/delete/' + id, null);
  }

  getForEdit(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'Quotation/get-for-edit/' + id);
  }

  edit(model: quotationEditModel) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'Quotation/edit', model);
  }

  getDetail(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'Quotation/get-detail/' + id);
  }

  uploadAttachmentFile(file: any) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post(this.appSettings.ApiBaseUrl + 'Quotation/upload-attachment', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
  getRecentQuotations() {
    return this.http.get(this.appSettings.ApiBaseUrl + 'Quotation/get-recent');
  }
  
  getSummary(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'Quotation/get-summary/' + id);
  }

  sendQuotation(sendModel:QuotationSendModel) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'Quotation/send',sendModel);
  }
}
