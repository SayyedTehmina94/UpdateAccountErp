import { Directive, ElementRef, HostListener } from '@angular/core';

// START: AlphabatesOnlyDirective

@Directive({
    selector: '[appAlphabatesOnly]'
})

export class AlphabatesOnlyDirective {
    regexStr = '^[a-zA-Z]*$';

    constructor(private el: ElementRef) { }

    @HostListener('keypress', ['$event']) onKeyPress(event) {
        return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
        this.validateFields(event);
    }

    @HostListener('drop', ['$event']) blockDrop(event: KeyboardEvent) {
        this.validateFields(event);
    }

    @HostListener('blur', ['$event']) blockBlur(event: KeyboardEvent) {
        this.validateFields(event);
    }

    validateFields(event: any) {
        setTimeout(() => {
            event.preventDefault();
            const validtedValue = this.el.nativeElement.value.replace(/[^a-zA-Z]/g, '');
            this.el.nativeElement.value = validtedValue.toString().trim();
            this.el.nativeElement.dispatchEvent(new Event('input'));
        }, 100);
    }
}

// END: AlphabatesOnlyDirective

// START: AlphabatesWithSpaceOnlyDirective

@Directive({
    selector: '[appAlphabatesWithSpaceOnly]'
})

export class AlphabatesWithSpaceOnlyDirective {
    regexStr = '^[a-zA-Z ]*$';

    constructor(private el: ElementRef) { }

    @HostListener('keypress', ['$event']) onKeyPress(event) {
        return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
        this.validateFields(event);
    }

    @HostListener('drop', ['$event']) blockDrop(event: KeyboardEvent) {
        this.validateFields(event);
    }

    @HostListener('blur', ['$event']) blockBlur(event: KeyboardEvent) {
        this.validateFields(event);
    }

    validateFields(event: any) {
        setTimeout(() => {
            event.preventDefault();
            const validtedValue = this.el.nativeElement.value.replace(/[^a-zA-Z ]/g, '');
            this.el.nativeElement.value = validtedValue.toString().trim();
            this.el.nativeElement.dispatchEvent(new Event('input'));
        }, 100);
    }
}

// END: AlphabatesOnlyDirective

// START: AlphabatesALevelOneDirective

@Directive({
    selector: '[appAlphabatesLevelOne]'
})

export class AlphabatesALevelOneDirective {
    regexStr = '^[a-zA-Z-_. ]*$';

    constructor(private el: ElementRef) { }

    @HostListener('keypress', ['$event']) onKeyPress(event) {
        return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
        this.validateFields(event);
    }

    @HostListener('drop', ['$event']) blockDrop(event: KeyboardEvent) {
        this.validateFields(event);
    }

    @HostListener('blur', ['$event']) blockBlur(event: KeyboardEvent) {
        this.validateFields(event);
    }

    validateFields(event: any) {
        setTimeout(() => {
            event.preventDefault();
            const validtedValue = this.el.nativeElement.value.replace(/[^a-zA-Z-_. ]/g, '');
            this.el.nativeElement.value = validtedValue.toString().trim();
            this.el.nativeElement.dispatchEvent(new Event('input'));
        }, 100);
    }
}

// END: AlphabatesALevelOneDirective


// START: AlphabatesALevelTwoDirective

@Directive({
    selector: '[appAlphabatesLevelTwo]'
})

export class AlphabatesALevelTwoDirective {
    regexStr = '^[a-zA-Z-_./ ]*$';

    constructor(private el: ElementRef) { }

    @HostListener('keypress', ['$event']) onKeyPress(event) {
        return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
        this.validateFields(event);
    }

    @HostListener('drop', ['$event']) blockDrop(event: KeyboardEvent) {
        this.validateFields(event);
    }

    @HostListener('blur', ['$event']) blockBlur(event: KeyboardEvent) {
        this.validateFields(event);
    }

    validateFields(event: any) {
        setTimeout(() => {
            event.preventDefault();
            const validtedValue = this.el.nativeElement.value.replace(/[^a-zA-Z-_./ ]/g, '');
            this.el.nativeElement.value = validtedValue.toString().trim();
            this.el.nativeElement.dispatchEvent(new Event('input'));
        }, 100);
    }
}

// END: AlphabatesALevelTwoDirective


// START: NumbersOnlyDirective

@Directive({
    selector: '[appNumbersOnly]'
})

export class NumbersOnlyDirective {
    regexStr = '^[0-9]*$';

    constructor(private el: ElementRef) { }

    @HostListener('keypress', ['$event']) onKeyPress(event) {
        return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
        this.validateFields(event);
    }

    @HostListener('drop', ['$event']) blockDrop(event: KeyboardEvent) {
        this.validateFields(event);
    }

    @HostListener('blur', ['$event']) blockBlur(event: KeyboardEvent) {
        this.validateFields(event);
    }

    validateFields(event: any) {
        setTimeout(() => {
            event.preventDefault();
            const validtedValue = this.el.nativeElement.value.replace(/[^0-9]/g, '');
            this.el.nativeElement.value = validtedValue.toString().trim();
            this.el.nativeElement.dispatchEvent(new Event('input'));
        }, 100);
    }
}

// END: NumbersOnlyDirective


// START: DecimalNumbersOnlyDirective

@Directive({
    selector: '[appDecimalNumbersOnly]'
})

export class DecimalNumbersOnlyDirective {
    regexStr = '^[0-9.]*$';

    constructor(private el: ElementRef) { }

    @HostListener('keypress', ['$event']) onKeyPress(event) {
        console.log(new RegExp(this.regexStr).test(event.key));
        return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
        this.validateFields(event);
    }

    @HostListener('drop', ['$event']) blockDrop(event: KeyboardEvent) {
        this.validateFields(event);
    }

    @HostListener('blur', ['$event']) blockBlur(event: KeyboardEvent) {
        this.validateFields(event);
    }

    validateFields(event: any) {
        setTimeout(() => {
            event.preventDefault();
            const validtedValue = this.el.nativeElement.value.replace(/[^0-9.]/g, '');
            this.el.nativeElement.value = validtedValue.toString().trim();
            this.el.nativeElement.dispatchEvent(new Event('input'));
        }, 100);
    }
}

// END: NumbersOnlyDirective

// START: AlphaNumericsOnlyDirective

@Directive({
    selector: '[appAlphaNumericsOnly]'
})

export class AlphaNumericsOnlyDirective {
    regexStr = '^[a-zA-Z0-9]*$';

    constructor(private el: ElementRef) { }

    @HostListener('keypress', ['$event']) onKeyPress(event) {
        return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
        this.validateFields(event);
    }

    @HostListener('drop', ['$event']) blockDrop(event: KeyboardEvent) {
        this.validateFields(event);
    }

    @HostListener('blur', ['$event']) blockBlur(event: KeyboardEvent) {
        this.validateFields(event);
    }

    validateFields(event: any) {
        setTimeout(() => {
            event.preventDefault();
            const validtedValue = this.el.nativeElement.value.replace(/[^a-zA-Z0-9]/g, '');
            this.el.nativeElement.value = validtedValue.toString().trim();
            this.el.nativeElement.dispatchEvent(new Event('input'));
        }, 100);
    }
}

// END: AlphaNumericsOnlyDirective


// START: AlphaNumericsLevelOneDirective

@Directive({
    selector: '[appAlphaNumericsLevelOne]'
})

export class AlphaNumericsLevelOneDirective {
    regexStr = '^[a-zA-Z0-9-_.& ]*$';

    constructor(private el: ElementRef) { }

    @HostListener('keypress', ['$event']) onKeyPress(event) {
        return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
        this.validateFields(event);
    }

    @HostListener('drop', ['$event']) blockDrop(event: KeyboardEvent) {
        this.validateFields(event);
    }

    @HostListener('blur', ['$event']) blockBlur(event: KeyboardEvent) {
        this.validateFields(event);
    }

    validateFields(event: any) {
        setTimeout(() => {
            event.preventDefault();
            const validtedValue = this.el.nativeElement.value.replace(/[^a-zA-Z0-9-_.& ]/g, '');
            this.el.nativeElement.value = validtedValue.toString().trim();
            this.el.nativeElement.dispatchEvent(new Event('input'));
        }, 100);
    }
}

// START: AlphaNumericsLevelTwoDirective

@Directive({
    selector: '[appAlphaNumericsLevelTwo]'
})

export class AlphaNumericsLevelTwoDirective {
    regexStr = '^[a-zA-Z0-9-_./ ]*$';

    constructor(private el: ElementRef) { }

    @HostListener('keypress', ['$event']) onKeyPress(event) {
        return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
        this.validateFields(event);
    }

    @HostListener('drop', ['$event']) blockDrop(event: KeyboardEvent) {
        this.validateFields(event);
    }

    @HostListener('blur', ['$event']) blockBlur(event: KeyboardEvent) {
        this.validateFields(event);
    }

    validateFields(event: any) {
        setTimeout(() => {
            event.preventDefault();
            const validtedValue = this.el.nativeElement.value.replace(/[^a-zA-Z0-9-_./ ]/g, '');
            this.el.nativeElement.value = validtedValue.toString().trim();
            this.el.nativeElement.dispatchEvent(new Event('input'));
        }, 100);
    }
}

// END: AlphaNumericsLevelTwoDirective

// START: AlphaNumericsLevelThreeDirective

@Directive({
    selector: '[appAlphaNumericsLevelThree]'
})

export class AlphaNumericsLevelThreeDirective {
    regexStr = '^[a-zA-Z0-9-_. ]*$';

    constructor(private el: ElementRef) { }

    @HostListener('keypress', ['$event']) onKeyPress(event) {
        return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
        this.validateFields(event);
    }

    @HostListener('drop', ['$event']) blockDrop(event: KeyboardEvent) {
        this.validateFields(event);
    }

    @HostListener('blur', ['$event']) blockBlur(event: KeyboardEvent) {
        this.validateFields(event);
    }

    validateFields(event: any) {
        setTimeout(() => {
            event.preventDefault();
            const validtedValue = this.el.nativeElement.value.replace(/[^a-zA-Z0-9-_. ]/g, '');
            this.el.nativeElement.value = validtedValue.toString().trim();
            this.el.nativeElement.dispatchEvent(new Event('input'));
        }, 100);
    }
}

// END: AlphaNumericsLevelThreeDirective

// START: AlphaNumericsLevelFourDirective

@Directive({
    selector: '[appAlphaNumericsLevelFour]'
})

export class AlphaNumericsLevelFourDirective {
    regexStr = '^[a-zA-Z0-9_ ]*$';

    constructor(private el: ElementRef) { }

    @HostListener('keypress', ['$event']) onKeyPress(event) {
        return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
        this.validateFields(event);
    }

    @HostListener('drop', ['$event']) blockDrop(event: KeyboardEvent) {
        this.validateFields(event);
    }

    @HostListener('blur', ['$event']) blockBlur(event: KeyboardEvent) {
        this.validateFields(event);
    }

    validateFields(event: any) {
        setTimeout(() => {
            event.preventDefault();
            const validtedValue = this.el.nativeElement.value.replace(/[^a-zA-Z0-9_ ]/g, '');
            this.el.nativeElement.value = validtedValue.toString().trim();
            this.el.nativeElement.dispatchEvent(new Event('input'));
        }, 100);
    }
}

// END: AlphaNumericsLevelFourDirective

// START AnythingButWhiteSpaceDirective

@Directive({
    selector: '[appAnythingButWhiteSpace]'
})

export class AnythingButWhiteSpaceDirective {
    regexStr = '[^\ ]';

    constructor(private el: ElementRef) { }

    @HostListener('keypress', ['$event']) onKeyPress(event) {
        return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
        event.preventDefault();
    }

    @HostListener('drop', ['$event']) blockDrop(event: KeyboardEvent) {
        event.preventDefault();
    }
}

// END AnythingButWhiteSpaceDirective

// START EmailAddressOnlyDirective

@Directive({
    selector: '[appEmailAddressOnly]'
})

export class EmailAddressOnlyDirective {
    regexStr = '^[a-zA-Z0-9-_@.]*$';

    constructor(private el: ElementRef) { }

    @HostListener('keypress', ['$event']) onKeyPress(event) {
        return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
        this.validateFields(event);
    }

    @HostListener('drop', ['$event']) blockDrop(event: KeyboardEvent) {
        this.validateFields(event);
    }

    @HostListener('blur', ['$event']) blockBlur(event: KeyboardEvent) {
        this.validateFields(event);
    }

    validateFields(event: any) {
        setTimeout(() => {
            event.preventDefault();
            const validtedValue = this.el.nativeElement.value.replace(/[^a-zA-Z0-9-_@.]/g, '');
            this.el.nativeElement.value = validtedValue.toString().trim();
            this.el.nativeElement.dispatchEvent(new Event('input'));
        }, 100);
    }
}

// END EmailAddressOnlyDirective


// START: AlphaNumericsLevelOneDirective

@Directive({
    selector: '[appPhoneNumberOnly]'
})

export class PhoneNumberOnlyDirective {
    regexStr = '^[0-9+]*$';

    constructor(private el: ElementRef) { }

    @HostListener('keypress', ['$event']) onKeyPress(event) {
        if (event.key !== '+') {
            return new RegExp(this.regexStr).test(event.key);
        }

        if (this.el.nativeElement.value
            && this.el.nativeElement.value.length !== 0) {
            return false;
        }
    }

    @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
        event.preventDefault();
    }

    @HostListener('drop', ['$event']) blockDrop(event: KeyboardEvent) {
        event.preventDefault();
    }
}

// START WebUrlOnlyDirective

@Directive({
    selector: '[appWebUrlOnly]'
})

export class WebUrlOnlyDirective {
    regexStr = '^[a-zA-Z0-9-_/.:]*$';

    constructor(private el: ElementRef) { }

    @HostListener('keypress', ['$event']) onKeyPress(event) {
        return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
        this.validateFields(event);
    }

    @HostListener('drop', ['$event']) blockDrop(event: KeyboardEvent) {
        this.validateFields(event);
    }

    @HostListener('blur', ['$event']) blockBlur(event: KeyboardEvent) {
        this.validateFields(event);
    }

    validateFields(event: any) {
        setTimeout(() => {
            event.preventDefault();
            const validtedValue = this.el.nativeElement.value.replace(/[^a-zA-Z0-9-_/.:]/g, '');
            this.el.nativeElement.value = validtedValue.toString().trim();
            this.el.nativeElement.dispatchEvent(new Event('input'));
        }, 100);
    }
}

// END WebUrlOnlyDirective

// START ZipCodeOnlyDirective

@Directive({
    selector: '[appZipCodeOnly]'
})

export class ZipCodeOnlyDirective {
    regexStr = '^[a-zA-Z0-9-]*$';

    constructor(private el: ElementRef) { }

    @HostListener('keypress', ['$event']) onKeyPress(event) {
        return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
        event.preventDefault();
    }

    @HostListener('drop', ['$event']) blockDrop(event: KeyboardEvent) {
        this.validateFields(event);
    }

    @HostListener('blur', ['$event']) blockBlur(event: KeyboardEvent) {
        this.validateFields(event);
    }

    validateFields(event: any) {
        setTimeout(() => {
            event.preventDefault();
            const validtedValue = this.el.nativeElement.value.replace(/[^a-zA-Z0-9-]/g, '');
            this.el.nativeElement.value = validtedValue.toString().trim();
            this.el.nativeElement.dispatchEvent(new Event('input'));
        }, 100);
    }
}

// END WebUrlOnlyDirective

