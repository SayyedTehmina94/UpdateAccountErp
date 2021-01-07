import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-vendor-form-wizard-aside',
    templateUrl: './vendor.form.wizard.aside.component.html'
})

export class VendorFromWizardAsideComponent {
    @Input() wizardStep: number;
    @Output() setWizardStep = new EventEmitter();
}
