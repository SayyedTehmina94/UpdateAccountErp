import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BillAddModel, BillDetailModel, BillEditModel } from '../models';
import { AppSettings } from '../helpers';

@Injectable()
export class BillService {
  constructor(private http: HttpClient,
    private appSettings: AppSettings) { }

  add(model: BillAddModel) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'Bill/add', model);
  }

  edit(model: BillEditModel) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'Bill/edit', model);
  }

  delete(id: number) {
    return this.http.post(this.appSettings.ApiBaseUrl + 'Bill/delete/' + id, null);
  }

  getDetail(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'Bill/get-detail/' + id);
  }

  getDetailForEdit(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'Bill/get-detail-for-edit/' + id);
  }

  getSummary(id: number) {
    return this.http.get(this.appSettings.ApiBaseUrl + 'Bill/get-summary/' + id);
  }

  uploadAttachmentFile(file: any) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post(this.appSettings.ApiBaseUrl + 'Bill/upload-attachment', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getRecentBills() {
    return this.http.get(this.appSettings.ApiBaseUrl + 'Bill/get-recent');
}

getNewBillNumber(){
  return this.http.get(this.appSettings.ApiBaseUrl + 'Bill/get-BillNumber');
  
}
}
