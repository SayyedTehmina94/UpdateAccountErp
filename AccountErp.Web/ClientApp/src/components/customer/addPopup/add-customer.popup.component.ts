import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CustomerUpsertModel } from 'src/models';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppUtils } from 'src/helpers';
import { CustomerService } from 'src/services';

@Component({
  selector: 'app-add-customer-popup',
  templateUrl: './add-customer.popup.component.html'
 
})
export class AddCustomerPopupComponent{

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
           
        }
    }

    setWizardStep(step: number) {
        this.wizardStep = step;
        // alert(this.wizardStep);
        // if (this.model.id) {
        //     this.wizardStep = step;
        // } else {
        //     this.toastr.warning('Please save the customer profile');
        //     this.wizardStep = 1;
        // }
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
