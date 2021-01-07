import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils } from '../../../helpers';
import { BankAccountEditModel } from '../../../models';
import { BankAccountService } from '../../../services';

@Component({
    selector: 'app-bank-account-edit',
    templateUrl: './bank.account.edit.component.html'
})

export class BankAccountEditComponent implements OnInit {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    model: BankAccountEditModel = new BankAccountEditModel();
    constructor(private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private appUtils: AppUtils,
        private bankAccountService: BankAccountService) {
        this.route.params.subscribe((params) => {
            this.model.id = params['id'];
        });
    }

    ngOnInit() {
        this.blockUI.start();
        this.bankAccountService.getForEdit(this.model.id).subscribe(
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
        this.bankAccountService.edit(this.model).subscribe(
            () => {
                this.blockUI.stop();
                setTimeout(() => {
                    this.router.navigate(['/bank-account/manage']);
                }, 100);
                setTimeout(() => {
                    this.toastr.success('Bank account has been updated successfully');
                }, 500);
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }
}

