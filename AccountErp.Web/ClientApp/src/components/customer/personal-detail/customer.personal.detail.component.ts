import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CustomerUpsertModel } from '../../../models';

import { AppUtils } from '../../../helpers';

@Component({
    selector: 'app-customer-personal-detail',
    templateUrl: './customer.personal.detail.component.html'
})

export class CustomerPersonalInformationComponent {
    @Input() model: CustomerUpsertModel;
    @Output() moveForward = new EventEmitter();
    @Output() moveBackward = new EventEmitter();
    wizardStep = 1;

    constructor(public appUtils: AppUtils) { }

    next() {
        this.moveForward.emit();
    }

    prev() {
        this.moveBackward.emit();
    }
}
