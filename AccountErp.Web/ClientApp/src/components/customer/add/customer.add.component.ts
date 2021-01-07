import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

import { AppUtils } from '../../../helpers';
import { CustomerUpsertModel } from '../../../models';
import { CustomerService } from '../../../services';

@Component({
    selector: 'app-customer-add',
    templateUrl: './customer.add.component.html'
})

export class CustomerAddComponent {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    model: CustomerUpsertModel = new CustomerUpsertModel();
    wizardStep = 1;

    constructor(private router: Router,
        private toastr: ToastrService,
        private appUtils: AppUtils,
        private customerService: CustomerService) { }

    next() {
        switch (this.wizardStep) {
            case 1:
                if (this.model.id) {
                    this.updateCustomer();
                } else {
                    this.addCustomer();
                }
                break;
            case 2:
            case 3:
            case 4:
            case 5:
                this.updateCustomer();
                break;
        }
    }

    prev() {
        if (this.wizardStep !== 1) {
            this.wizardStep -= 1;
            setTimeout(() => {
                this.appUtils.scrollToTop();
            }, 100);
        }
    }

    increaseWizard() {
        if (this.wizardStep < 5) {
            this.wizardStep += 1;
            setTimeout(() => {
                this.appUtils.scrollToTop();
            }, 100);
            return;
        } else {
            this.router.navigate(['/customer/manage']);
        }
    }

    setWizardStep(step: number) {
        this.wizardStep = step;
        // alert(this.wizardStep);
        if (this.model.id) {
            this.wizardStep = step;
        } else {
            this.toastr.warning('Please save the customer profile');
            this.wizardStep = 1;
        }
    }

    addCustomer() {
        this.blockUI.start();
        this.customerService.add(this.model).subscribe(
            (data: any) => {
                this.model.id = data;
                this.blockUI.stop();
                this.toastr.success('Customer has been added successfully');
                this.increaseWizard();
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }

    updateCustomer() {
        this.blockUI.start();
        this.customerService.edit(this.model).subscribe(
            () => {
                this.blockUI.stop();
                this.toastr.success('Customer has been updated successfully');
                this.increaseWizard();
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }
}

