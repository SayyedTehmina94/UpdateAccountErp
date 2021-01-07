import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaymentAddModel, PaymentEditModel } from '../models';
import { AppSettings } from '../helpers';

@Injectable()
export class PaymentService {
    constructor(private http: HttpClient,
        private appSettings: AppSettings) { }

    getPaymentMethodSelectItems() {
        return this.http.get(this.appSettings.ApiBaseUrl + 'payment/get-payment-method-select-items');
    }

    add(model: PaymentAddModel) {
        return this.http.post(this.appSettings.ApiBaseUrl + 'payment/add', model);
    }

    edit(model: PaymentEditModel) {
        return this.http.post(this.appSettings.ApiBaseUrl + 'payment/edit', model);
      }

    getDetail(id: string) {
        return this.http.get(this.appSettings.ApiBaseUrl + 'payment/get-detail/' + id);
    }

    getDetailForEdit(id: string) {
        return this.http.get(this.appSettings.ApiBaseUrl + 'payment/get-detail-for-edit/' + id);
    }

    delete(id: any) {
        return this.http.post(this.appSettings.ApiBaseUrl + 'payment/delete/' + id, id);
    }

    uploadAttachmentFile(file: any) {
        const formData: FormData = new FormData();
        formData.append('file', file);
        return this.http.post(this.appSettings.ApiBaseUrl + 'payment/upload-attachment', formData, {
            reportProgress: true,
            observe: 'events'
        });
    }

    getRecentPayments() {
        return this.http.get(this.appSettings.ApiBaseUrl + 'payment/get-recent');
    }
}
