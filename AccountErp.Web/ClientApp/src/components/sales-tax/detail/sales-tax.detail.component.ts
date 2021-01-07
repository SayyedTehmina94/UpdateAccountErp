import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils } from '../../../helpers';
import { SalesTaxDetailModel } from '../../../models';
import { SalesTaxService } from '../../../services';

@Component({
    selector: 'app-sales-tax-detail',
    templateUrl: './sales-tax.detail.component.html'
})

export class SalesTaxDetailComponent implements OnInit {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    model: SalesTaxDetailModel = new SalesTaxDetailModel();
    isModelLoaded = false;
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
        this.blockUI.start();
        this.salesTaxService.getDetail(this.model.id).subscribe(
            (data: any) => {
                this.blockUI.stop();
                Object.assign(this.model, data);
                this.isModelLoaded = true;
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }

    delete(): void {
        if (!confirm('Are you sure you want to delete the selected Sales & Tax?')) {
            return;
        }
        this.blockUI.start();
        this.salesTaxService.delete(this.model.id).subscribe(
            () => {
                this.blockUI.stop();
                setTimeout(() => {
                    this.router.navigate(['/sales-tax/manage']);
                }, 100);
                setTimeout(() => {
                    this.toastr.success('sales & tax has been deleted successfully.');
                }, 500);
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }
}

