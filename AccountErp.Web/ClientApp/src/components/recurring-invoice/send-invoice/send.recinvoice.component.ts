import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CustomerUpsertModel } from '../../../models';

import { AppUtils } from '../../../helpers';

@Component({
    selector: 'app-send-recinvoice',
    templateUrl: './send.recinvoice.component.html'
})

export class SendRecinvoiceComponent {
    @Input() model: CustomerUpsertModel;
    @Output() moveForward = new EventEmitter();
    @Output() moveBackward = new EventEmitter();
    wizardStep = 4;

    constructor(public appUtils: AppUtils) { }

    next() {
        this.moveForward.emit();
    }

    prev() {
        this.moveBackward.emit();
    }
}
