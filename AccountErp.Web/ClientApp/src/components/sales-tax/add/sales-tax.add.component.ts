import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils } from '../../../helpers';
import { SalesTaxAddModel } from '../../../models'
import { SalesTaxService } from '../../../services';

@Component({
    selector: 'app-sales-tax-add',
    templateUrl: './sales-tax.add.component.html'
})

export class SalesTaxAddComponent implements OnInit{
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    model: SalesTaxAddModel = new SalesTaxAddModel();
    constructor(private router: Router,
        private toastr: ToastrService,
        private appUtils: AppUtils,
        private salesTaxService: SalesTaxService) {
    }

    ngOnInit() {
    }

    submit() {
        this.blockUI.start();
        this.salesTaxService.add(this.model).subscribe(
            () => {
                this.blockUI.stop();
                setTimeout(() => {
                    this.router.navigate(['/sales-tax/manage']);
                }, 100);
                setTimeout(() => {
                    this.toastr.success('Sales Tax has been added successfully');
                }, 500);
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }
}

