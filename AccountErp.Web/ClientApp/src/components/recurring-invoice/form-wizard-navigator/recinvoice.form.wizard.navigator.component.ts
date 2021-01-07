import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-recinvoice-form-wizard-navigator',
    templateUrl: './recinvoice.form.wizard.navigator.component.html'
})

export class RecInvoiceFromWizarNavigatorComponent {
    @Input() wizardStep: number;
    @Output() moveBackward = new EventEmitter();

    

    prev() {
        this.moveBackward.emit();
    }
}
