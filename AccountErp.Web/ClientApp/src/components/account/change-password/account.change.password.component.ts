import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ChangePasswordModel } from '../../../models';
import { AccountService } from '../../../services';
import { AppUtils } from '../../../helpers';

@Component({
    selector: 'app-change-password',
    templateUrl: './account.change.password.component.html'
})

export class ChangePasswordComponent {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    model: ChangePasswordModel = new ChangePasswordModel();

    constructor(private toastr: ToastrService,
        private appUtils: AppUtils,
        private accountService: AccountService) { }

    submit(form: NgForm) {
        this.blockUI.start();
        this.accountService.changePassword(this.model).subscribe(
            () => {
                this.blockUI.stop();
                this.model = new ChangePasswordModel();
                form.resetForm();
                this.toastr.success('Password has been changed successfully');
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }

}
