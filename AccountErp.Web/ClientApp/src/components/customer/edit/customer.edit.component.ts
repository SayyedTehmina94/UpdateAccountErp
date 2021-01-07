import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils } from '../../../helpers';
import { CustomerUpsertModel } from '../../../models';
import { CustomerService } from '../../../services';
@Component({
    selector: 'app-customer-edit',
    templateUrl: './customer.edit.component.html'
})

export class CustomerEditComponent implements OnInit {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    model: CustomerUpsertModel = new CustomerUpsertModel();
    // @Input() model: CustomerUpsertModel;
    @Output() moveForward = new EventEmitter();
    @Output() moveBackward = new EventEmitter();
    wizardStep = 1;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService,
        private appUtils: AppUtils,
        private customerService: CustomerService) {
        this.route.params.subscribe((params) => {
            this.model.id = params['id'];
        });
    }

    ngOnInit() {
        this.loadCustomer();
    }

    loadCustomer() {
        
        this.blockUI.start();
        this.customerService.getForEdit(this.model.id)
            .subscribe(
                (data) => {
                    this.blockUI.stop();
                    Object.assign(this.model, data);
                    console.log(this.model, data)
                    if (this.model.address
                        && !this.model.address.countryId) {
                        this.model.address.countryId = '';
                    }
                },
                error => {
                    this.blockUI.stop();
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
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

    next() {
        this.updateCustomer();
            // this.moveForward.emit();
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
    prev() {
        if (this.wizardStep !== 1) {
            this.wizardStep -= 1;
            setTimeout(() => {
                this.appUtils.scrollToTop();
            }, 100);
        }
    }

    // prev() {
    //     this.moveBackward.emit();
    // }
    setWizardStep(step: number) {
        this.wizardStep = step;
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

