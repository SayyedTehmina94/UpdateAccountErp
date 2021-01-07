import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CustomerUpsertModel } from '../../../models';

@Component({
    selector: 'app-customer-payment-detail',
    templateUrl: './customer.payment.detail.component.html'
})

export class CustomerPaymentDetailComponent {
    @Input() model: CustomerUpsertModel;
    @Output() moveForward = new EventEmitter();
    @Output() moveBackward = new EventEmitter()
    wizardStep = 4;

    next() {
        this.moveForward.emit();
    }

    prev() {
        this.moveBackward.emit();
    }
}
