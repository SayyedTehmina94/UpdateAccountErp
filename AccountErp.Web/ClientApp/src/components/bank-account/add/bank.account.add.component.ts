import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils } from '../../../helpers';
import { BankAccountAddModel } from '../../../models'
import { BankAccountService } from '../../../services';

@Component({
    selector: 'app-bank-account-add',
    templateUrl: './bank.account.add.component.html'
})

export class BankAccountAddComponent {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    model: BankAccountAddModel = new BankAccountAddModel();
    constructor(private router: Router,
        private toastr: ToastrService,
        private appUtils: AppUtils,
        private bankAccountService: BankAccountService) {
    }

    submit() {
        this.blockUI.start();
        this.bankAccountService.add(this.model).subscribe(
            () => {
                this.blockUI.stop();
                setTimeout(() => {
                    this.router.navigate(['/bank-account/manage']);
                }, 100);
                setTimeout(() => {
                    this.toastr.success('Bank account has been added successfully');
                }, 500);
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }
}

