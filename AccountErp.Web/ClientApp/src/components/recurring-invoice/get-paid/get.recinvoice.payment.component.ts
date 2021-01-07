import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { CustomerUpsertModel } from '../../../models';

@Component({
    selector: 'app-get-recinvoice-payment',
    templateUrl: './get.recinvoice.payment.component.html'
})

export class GetRecInvoicePaymentComponent {
    @Input() model: CustomerUpsertModel;
    @Output() moveForward = new EventEmitter();
    @Output() moveBackward = new EventEmitter();
    @BlockUI('conatiner-blockui') blockUI: NgBlockUI;
    wizardStep = 3;

    next() {
        this.moveForward.emit();
    }

    prev() {
        this.moveBackward.emit();
    }
}
