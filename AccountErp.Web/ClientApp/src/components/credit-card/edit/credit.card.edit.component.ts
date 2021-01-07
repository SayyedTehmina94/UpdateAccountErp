import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils } from '../../../helpers';
import { CreditCardEditModel } from '../../../models/credit-card/credit.card.edit.model';
import { CreditCardService } from '../../../services/credit.card.service';

@Component({
    selector: 'app-credit-card-edit',
    templateUrl: './credit.card.edit.component.html'
})

export class CreditCardEditComponent implements OnInit {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    model: CreditCardEditModel = new CreditCardEditModel();
    constructor(private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private appUtils: AppUtils,
        private craditCardService: CreditCardService) {
        this.route.params.subscribe((params) => {
            this.model.id = params['id'];
        });
    }

    ngOnInit() {
        this.blockUI.start();
        this.craditCardService.getForEdit(this.model.id).subscribe(
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
        this.craditCardService.edit(this.model).subscribe(
            () => {
                this.blockUI.stop();
                setTimeout(() => {
                    this.router.navigate(['/credit-card/manage']);
                }, 100);

                setTimeout(() => {
                    this.toastr.success('Credit card has been updated successfully');
                }, 500);
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }
}

