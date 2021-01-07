import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-customer-form-wizard-aside',
    templateUrl: './customer.form.wizard.aside.component.html'
})

export class CustomerFromWizardAsideComponent {
    @Input() wizardStep: number;
    @Output() setWizardStep = new EventEmitter();
}
