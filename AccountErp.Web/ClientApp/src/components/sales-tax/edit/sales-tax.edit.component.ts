import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils } from '../../../helpers';
import { SalesTaxEditModel } from '../../../models';
import { SalesTaxService } from '../../../services';

@Component({
    selector: 'app-sales-tax-edit',
    templateUrl: './sales-tax.edit.component.html'
})

export class SalesTaxEditComponent implements OnInit {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    model: SalesTaxEditModel = new SalesTaxEditModel();
    constructor(private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private appUtils: AppUtils,
        private salesTaxService: SalesTaxService) {
        this.route.params.subscribe((params) => {
            this.model.id = params['id'];
        });
    }

    ngOnInit() {
        this.loadSalesTax();
    }

    loadSalesTax(){
        this.blockUI.start();
        this.salesTaxService.getForEdit(this.model.id).subscribe(
            (data: any) => {
                this.blockUI.stop();
                Object.assign(this.model, data);
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }

    submit() {
        this.blockUI.start();
        this.salesTaxService.edit(this.model).subscribe(
            () => {
                this.blockUI.stop();
                setTimeout(() => {
                    this.router.navigate(['/sales-tax/manage']);
                }, 100);
                setTimeout(() => {
                    this.toastr.success('Sales Tax has been updated successfully');
                }, 500);
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }
}

