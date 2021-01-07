import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils } from '../../../helpers';
import { VendorModel, AddressModel, ContactModel } from '../../../models';
import { VendorService } from '../../../services';

@Component({
    selector: 'app-vendor-add',
    templateUrl: './vendor.add.component.html'
})

export class VendorAddComponent {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    model: VendorModel = new VendorModel();
    wizardStep = 1;

    constructor(private router: Router,
        private toastr: ToastrService,
        private appUtils: AppUtils,
        private vendorService: VendorService) {
    }

    next() {
        switch (this.wizardStep) {
            case 1:
                if (this.model.id) {
                    this.updateVendor();
                } else {
                    this.addVendor();
                }
                break;
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                this.updateVendor();
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
        if (this.wizardStep < 6) {
            this.wizardStep += 1;
            setTimeout(() => {
                this.appUtils.scrollToTop();
            }, 100);
            return;
        } else {
            this.router.navigate(['/vendor/manage']);
        }
    }

    setWizardStep(step: number) {
        if (this.model.id) {
            this.wizardStep = step;
        } else {
            this.toastr.warning('Please save the vendor personal information');
            this.wizardStep = 1;
        }
    }

    addVendor() {
        this.blockUI.start();
        console.log("venADD",this.model);
        this.vendorService.add(this.model).subscribe(
            (data: any) => {
                this.blockUI.stop();
                this.model.id = data;
                this.toastr.success('Vendor has been added successfully');
                this.increaseWizard();
                this.loadVendor();
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }

    updateVendor() {
        this.blockUI.start();
        console.log("venEDD",this.model);
        this.vendorService.edit(this.model).subscribe(
            () => {
                this.blockUI.stop();
                this.toastr.success('Vendor has been updated successfully');
                this.increaseWizard();
                this.loadVendor();
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }

    loadVendor() {
        this.blockUI.start();
        this.vendorService.getForEdit(this.model.id).subscribe(
            (data: any) => {
                this.blockUI.stop();
                Object.assign(this.model, data);

                if (this.model.billingAddress.id == null) {
                    this.model.billingAddress = new AddressModel();
                }
                if (!this.model.billingAddress.countryId) {
                    this.model.billingAddress.countryId = '';
                }

                if (this.model.shippingAddress.id == null) {
                    this.model.shippingAddress = new AddressModel();
                }

                if (!this.model.shippingAddress.countryId) {
                    this.model.shippingAddress.countryId = '';
                }

                if (this.model.contacts.length === 0) {
                    const contact = new ContactModel();
                    this.model.contacts.push(contact);
                } else {
                    this.model.contacts.forEach(element => {
                        if (element.address.id == null) {
                            element.address = new AddressModel();
                        }
                        element.address.countryId = '';
                    });
                }


            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }
}

