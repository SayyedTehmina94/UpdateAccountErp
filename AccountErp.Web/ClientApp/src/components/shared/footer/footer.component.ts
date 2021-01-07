import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { AppUtils } from 'src/helpers';
import { FooterInvoiceOverDueMainModel, FooterInvoiceOverDueModel, FooterRecurringInvoiceMainModel, FooterRecurringInvoiceModel } from 'src/models/footer/footer.model';
import { FooterService } from 'src/services/footer.service';
import * as $ from 'jquery';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html'
})

export class FooterComponent implements OnInit{
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    overDueInvoiceModel: Array<FooterInvoiceOverDueMainModel> = new Array<FooterInvoiceOverDueMainModel>();
    recurringInvoiceModel: Array<FooterRecurringInvoiceMainModel> = new Array<FooterRecurringInvoiceMainModel>();
    constructor(private http: HttpClient,
        private footerService:FooterService,
        private appUtils: AppUtils,
        private toastr: ToastrService){

    }
    ngOnInit(){
        this.getOverDueInvoice();
        this.getRecurringInvoice();
    }

    getOverDueInvoice(){
        
        this.blockUI.start();
        this.footerService.getInvoiceOverDue()
            .subscribe((data) => {
                this.blockUI.stop();
                Object.assign(this.overDueInvoiceModel, data);
                console.log("footer data",this.overDueInvoiceModel)
            },
                error => {
                    this.blockUI.stop();
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
    }
    getRecurringInvoice(){
        this.blockUI.start();
        this.footerService.getRecurringInvoice()
            .subscribe((data) => {
                this.blockUI.stop();
                Object.assign(this.recurringInvoiceModel, data);
            },
                error => {
                    this.blockUI.stop();
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
    }
 }

