import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils } from '../../../helpers';
import { BankAccountDetailModel } from '../../../models';
import { BankAccountService } from '../../../services';

@Component({
    selector: 'app-bank-account-detail',
    templateUrl: './bank.account.detail.component.html'
})

export class BankAccountDetailComponent implements OnInit {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    model: BankAccountDetailModel = new BankAccountDetailModel();
    isModelLoaded = false;
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
        this.bankAccountService.getDetail(this.model.id).subscribe(
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
        if (!confirm('Are you sure you want to delete the selected bank account?')) {
            return;
        }
        this.blockUI.start();
        this.bankAccountService.delete(this.model.id).subscribe(
            () => {
                this.blockUI.stop();
                setTimeout(() => {
                    this.router.navigate(['/bank-account/manage']);
                }, 100);
                setTimeout(() => {
                    this.toastr.success('Bank account has been deleted successfully.');
                }, 500);
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }
}

