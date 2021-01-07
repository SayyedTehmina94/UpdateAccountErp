import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils } from '../../../helpers';
import { AccountAddModel , SelectListItemModel} from '../../../models'
import { AccountService } from '../../../services';

@Component({
    selector: 'app-account-add',
    templateUrl: './account.add.component.html'
})

export class  AccountAddComponent{
    @BlockUI('container-blockui-main') blockUI: NgBlockUI;
    model: AccountAddModel = new AccountAddModel();
    roles: Array<SelectListItemModel> = new Array<SelectListItemModel>();
    constructor(private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private appUtils: AppUtils,
        private accountService : AccountService) {

    }

    ngOnInit() {
        this.loadRoles();
        this.model.roleId = '';
    }

    loadRoles(){
        this.blockUI.start();
        this.accountService.getRoleSelectItems()
            .subscribe((data) => {
                this.blockUI.stop();
                Object.assign(this.roles, data);
            },
                error => {
                    this.blockUI.stop();
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
    }

    submit() {
        this.blockUI.start();
        this.accountService.add(this.model).subscribe(
            ()=>{
                this.blockUI.stop();
                this.router.navigate(['/account/manage']);
                setTimeout(() => {
                    this.toastr.success('account add successfully');
                }, 100);
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }
}

