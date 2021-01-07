import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { VendorModel } from '../../../models';

@Component({
    selector: 'app-vendor-discount-detail',
    templateUrl: './vendor.discount.detail.component.html'
})

export class VendorDiscountDetailComponent {
    @Input() model: VendorModel;
    @Output() moveForward = new EventEmitter();
    @Output() moveBackward = new EventEmitter();
    @BlockUI('conatiner-blockui') blockUI: NgBlockUI;
    wizardStep = 6;

    next() {
        this.moveForward.emit();
    }

    prev() {
        this.moveBackward.emit();
    }
}
