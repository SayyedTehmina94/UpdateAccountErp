import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-recinvoice-form-wizard-aside',
    templateUrl: './recinvoice.form.wizard.aside.component.html'
})

export class RecInvoiceFromWizardAsideComponent {
    @Input() wizardStep: number;
    @Output() setWizardStep = new EventEmitter();
}
