import { Component, Input, Output, EventEmitter } from '@angular/core';

import { VendorModel } from '../../../models';
import { AppUtils } from '../../../helpers';

@Component({
    selector: 'app-vendor-personal-detail',
    templateUrl: './vendor.personal.detail.component.html'
})

export class VendorPersonalInformationComponent {
    @Input() model: VendorModel;
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
