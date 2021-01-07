import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils } from '../../helpers';
import { SettingEditModel, ChangePasswordModel } from '../../models';
import { AccountService } from '../../services';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html'
})

export class SettingComponent implements OnInit {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    model: SettingEditModel = new SettingEditModel();
    changePasswordModel : ChangePasswordModel = new ChangePasswordModel();
    constructor(private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private appUtils: AppUtils,
        private accountService: AccountService) {
    }

    ngOnInit() {
        this.blockUI.start();
        this.accountService.getForEdit().subscribe(
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
        this.accountService.edit(this.model).subscribe(
            () => {
                this.blockUI.stop();
                setTimeout(() => {
                    this.router.navigate(['/setting']);
                }, 100);
                setTimeout(() => {
                    this.toastr.success('Your account detail updated successfully');
                }, 500);
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }

    changePassword(){
        this.blockUI.start();
        this.accountService.changePassword(this.changePasswordModel).subscribe(
            () => {
                this.blockUI.stop();
                setTimeout(() => {
                    this.router.navigate(['/setting']);
                }, 100);
                setTimeout(() => {
                    this.toastr.success('Your password updated successfully');
                    this.changePasswordModel = new ChangePasswordModel();
                }, 500);
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }
}

