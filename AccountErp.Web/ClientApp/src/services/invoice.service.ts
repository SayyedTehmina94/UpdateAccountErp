import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InvoiceAddModel, InvoiceEditModel } from '../models';
import { AppSettings } from '../helpers';
import { InvoiceSendModel } from 'src/models/invoice/invoice.send.model';

@Injectable()
export class InvoiceService {
  constructor(private http: HttpClient,
    private appSettings: AppSettings) { }

    getNewInvoiceNumber() {
      
      return this.http.get(this.appSettings.ApiBaseUrl + 'Invoice/get-InvoiceNumber');
    }

  add(model: InvoiceAddModel) {
    
    return this.http.post(this.appSettings.ApiBaseUrl + 'Invoice/Add', model);
  }

  toggleStatus(id: number) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'Invoice/toggle-status/' + id, null);
  }

  delete(id: number) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'Invoice/delete/' + id, null);
  }

  getForEdit(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'Invoice/get-for-edit/' + id);
  }

  edit(model: InvoiceEditModel) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'Invoice/edit', model);
  }

  getDetail(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'Invoice/get-detail/' + id);
  }

  uploadAttachmentFile(file: any) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post(this.appSettings.ApiBaseUrl + 'Invoice/upload-attachment', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
  getRecentInvoices() {
    return this.http.get(this.appSettings.ApiBaseUrl + 'invoice/get-recent');
  }
  
  getSummary(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'invoice/get-summary/' + id);
  }

  sendInvoice(sendModel:InvoiceSendModel) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'invoice/send',sendModel);
  }
}
