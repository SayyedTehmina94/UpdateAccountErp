import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils, AppSettings } from '../../../helpers';
import { InvoiceService } from 'src/services';
import { InvoiceDetailModel } from 'src/models';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-invoice-recent',
    templateUrl: './invoice.recent.component.html'
})

export class InvoiceRecentComponent implements OnInit {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    invoiceRecents: Array<InvoiceDetailModel> = new Array<InvoiceDetailModel>();

    constructor(private http: HttpClient,
        private appSettings: AppSettings,
        private toastr: ToastrService,
        private router: Router,
        private appUtils: AppUtils,
        private invoiceService : InvoiceService) { }

    ngOnInit(): void {
        this.blockUI.start();
        this.invoiceService.getRecentInvoices()
            .subscribe((data) => {
                this.blockUI.stop();
                Object.assign(this.invoiceRecents, data);
                this.invoiceRecents.forEach(element => {
                    element.createdOn =  this.appUtils.getFormattedDate(element.createdOn, null);
                });
                
            },
                error => {
                    this.blockUI.stop();
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
    }
}

