import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils } from '../../../helpers';
import { CreditCardAddModel } from '../../../models'
import { CreditCardService } from '../../../services';

@Component({
    selector: 'app-credit-card-add',
    templateUrl: './credit.card.add.component.html'
})

export class CreditCardAddComponent {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    model: CreditCardAddModel = new CreditCardAddModel();
    constructor(private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private appUtils: AppUtils,
        private creditCardService: CreditCardService) {
    }

    submit() {
        this.blockUI.start();
        this.creditCardService.add(this.model).subscribe(
            () => {
                this.blockUI.stop();
                setTimeout(() => {
                    this.router.navigate(['/credit-card/manage']);
                }, 100);

                setTimeout(() => {
                    this.toastr.success('Credit card has been added successfully');
                }, 500);
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }
}