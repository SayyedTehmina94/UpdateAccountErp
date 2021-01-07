import { Component, Input, Output, EventEmitter } from '@angular/core';

import { VendorModel } from '../../../models';

@Component({
    selector: 'app-vendor-payment-detail',
    templateUrl: './vendor.payment.detail.component.html'
})

export class VendorPaymentDetailComponent {
    @Input() model: VendorModel;
    @Output() moveForward = new EventEmitter();
    @Output() moveBackward = new EventEmitter();
    wizardStep = 5;

    next() {
        this.moveForward.emit();
    }

    prev() {
        this.moveBackward.emit();
    }
}
