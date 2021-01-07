import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { CustomerUpsertModel } from '../../../models';

@Component({
    selector: 'app-customer-discount-detail',
    templateUrl: './customer.discount.detail.component.html'
})

export class CustomerDiscountDetailComponent {
    @Input() model: CustomerUpsertModel;
    @Output() moveForward = new EventEmitter();
    @Output() moveBackward = new EventEmitter();
    @BlockUI('conatiner-blockui') blockUI: NgBlockUI;
    wizardStep = 5;

    next() {
        this.moveForward.emit();
    }

    prev() {
        this.moveBackward.emit();
    }
}
