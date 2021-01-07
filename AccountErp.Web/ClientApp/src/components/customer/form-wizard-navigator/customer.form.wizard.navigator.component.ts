import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-customer-form-wizard-navigator',
    templateUrl: './customer.form.wizard.navigator.component.html'
})

export class CustomerFromWizarNavigatorComponent {
    @Input() wizardStep: number;
    @Output() moveBackward = new EventEmitter();

    

    prev() {
        this.moveBackward.emit();
    }
}
