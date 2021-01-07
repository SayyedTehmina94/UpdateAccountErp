import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-vendor-form-wizard-navigator',
    templateUrl: './vendor.form.wizard.navigator.component.html'
})

export class VendorFromWizarNavigatorComponent {
    @Input() wizardStep: number;
    @Output() moveBackward = new EventEmitter();

    prev() {
        this.moveBackward.emit();
    }
}
