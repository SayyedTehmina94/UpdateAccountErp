import { Injectable } from '@angular/core';
import { RecurringInvoiceEditModel } from 'src/models/recurring-invoices/recurringInvoice.edit.model';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/helpers';
import { InvoiceSendModel } from 'src/models';
import { RecurringInvoiceAddModel } from 'src/models/recurring-invoices/recurringInvoice.add.model';

@Injectable({
  providedIn: 'root'
})
export class RecurringInvoiceService {

  constructor(private http: HttpClient,
    private appSettings: AppSettings) { }

    getNewInvoiceNumber() {
      
      return this.http.get(this.appSettings.ApiBaseUrl + 'RecurringInvoice/get-InvoiceNumber');
    }

  add(model: RecurringInvoiceAddModel) {
    
    return this.http.post(this.appSettings.ApiBaseUrl + 'RecurringInvoice/Add', model);
  }

  toggleStatus(id: number) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'RecurringInvoice/toggle-status/' + id, null);
  }

  delete(id: number) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'RecurringInvoice/delete/' + id, null);
  }

  getForEdit(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'RecurringInvoice/get-for-edit/' + id);
  }

  edit(model: RecurringInvoiceEditModel) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'RecurringInvoice/edit', model);
  }

  getDetail(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'RecurringInvoice/get-detail/' + id);
  }

  uploadAttachmentFile(file: any) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post(this.appSettings.ApiBaseUrl + 'RecurringInvoice/upload-attachment', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
  getRecentInvoices() {
    return this.http.get(this.appSettings.ApiBaseUrl + 'RecurringInvoice/get-recent');
  }
  
  getSummary(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'RecurringInvoice/get-summary/' + id);
  }

  sendInvoice(sendModel:InvoiceSendModel) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'RecurringInvoice/send',sendModel);
  }
}
