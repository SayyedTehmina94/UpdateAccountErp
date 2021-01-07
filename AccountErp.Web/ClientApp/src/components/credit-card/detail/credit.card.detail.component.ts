import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils } from '../../../helpers';
import { CreditCardDetailModel } from '../../../models/credit-card/credit.card.detail.model';
import { CreditCardService } from '../../../services/credit.card.service';

@Component({
    selector: 'app-credit-card-detail',
    templateUrl: './credit.card.detail.component.html'
})

export class CreditCardDetailComponent implements OnInit {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    model: CreditCardDetailModel = new CreditCardDetailModel();
    isModelLoaded = false;
    constructor(private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private appUtils: AppUtils,
        private creditCardService: CreditCardService) {
        this.route.params.subscribe((params) => {
            this.model.id = params['id'];
        });
    }
    ngOnInit() {
        this.blockUI.start();
        this.creditCardService.getDetail(this.model.id).subscribe(
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
        if (!confirm('Are you sure you want to delete the selected credit card?')) {
            return;
        }
        this.blockUI.start();
        this.creditCardService.delete(this.model.id).subscribe(
            () => {
                this.blockUI.stop();
                setTimeout(() => {
                    this.router.navigate(['/credit-card/manage']);
                }, 100);
                setTimeout(() => {
                    this.toastr.success('Credit card has been deleted successfully.');
                }, 500);
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }

}

