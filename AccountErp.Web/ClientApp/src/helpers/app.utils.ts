import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as jwt_decode from 'jwt-decode';
import { SelectListItemModel } from 'src/models';

@Injectable()
export class AppUtils {

    public emailRegexPattern = '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';

    // tslint:disable-next-line:max-line-length
    public urlRegexPattern = '^(?:(?:http(?:s)?|ftp)://)(?:\\S+(?::(?:\\S)*)?@)?(?:(?:[a-z0-9\u00a1-\uffff](?:-)*)*(?:[a-z0-9\u00a1-\uffff])+)(?:\\.(?:[a-z0-9\u00a1-\uffff](?:-)*)*(?:[a-z0-9\u00a1-\uffff])+)*(?:\\.(?:[a-z0-9\u00a1-\uffff]){2,})(?::(?:\\d){2,5})?(?:/(?:\\S)*)?$';


    constructor(private router: Router) { }

    public ProcessErrorResponse(toastr: any, response: any) {
        const error = response.error;
        if (response.status === 400) {
            if (error instanceof Array) {
                error.forEach(function (item) {
                    toastr.error(item);
                });
            } else {
                toastr.error(error);
            }
        } else if (response.status === 401) {
            this.router.navigate(['/account/logout']);
            setTimeout(() => {
                toastr.error('Please login to continue');
            }, 100);
        } else {
            toastr.error('Internal server error.');
        }
    }

    public getFormattedDate(date: any, format: string) {
        if (typeof date !== 'string') {
            date = `${date.month}/${date.day}/${date.year}`;
        }
        if (!format) {
            format = 'MM/DD/YYYY';
        }
        return date ? moment(date).format(format) : null;
    }

    public isUserAuthenticated() {
        if (localStorage.getItem('AuthToken')) {
            return true;
        }
        return false;
    }

    public getUserRole() {
        
      //("zx");
        console.log("admisd");
        const authToken = localStorage.getItem('AuthToken');
        if (!authToken) {
            return '';
        }
        const decodedToken = jwt_decode(authToken);
        return decodedToken
            .role
            .toString()
            .toUpperCase();
    }

    public getDateForNgDatePicker(date: string): any {
        const m = date ? moment(date) : moment();
        return { year: m.year(), month: (m.month() + 1), day: m.date() };
    }

    public getBase64Image(img: HTMLImageElement) {
        // We create a HTML canvas object that will create a 2d image
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        // This will draw image
        ctx.drawImage(img, 0, 0);
        console.log(canvas);
        // Convert the drawn image to Data URL
        const dataURL = canvas.toDataURL('image/png');
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
    }

    public getFileNameFromUrl(Url: string) {
        const fileName = Url.slice(Url.lastIndexOf('/') + 1, Url.length);
        return fileName;
    }

    public getPaymentModesSelectList() {
        const modes = new Array<SelectListItemModel>();
        let mode = new SelectListItemModel();
        mode.keyInt = 0;
        mode.value = 'Cash';
        modes.push(mode);
        mode = new SelectListItemModel();
        mode.keyInt = 1;
        mode.value = 'Bank Transfer';
        modes.push(mode);
        mode = new SelectListItemModel();
        mode.keyInt = 2;
        mode.value = 'Cheque';
        modes.push(mode);
        mode = new SelectListItemModel();
        mode.keyInt = 3;
        mode.value = 'Credit Card';
        modes.push(mode);
        return modes;
    }

    public getInvoicePaymentModesSelectList() {
        const modes = new Array<SelectListItemModel>();
        let mode = new SelectListItemModel();
        mode.keyInt = 0;
        mode.value = 'Cash';
        modes.push(mode);
        mode = new SelectListItemModel();
        mode.keyInt = 1;
        mode.value = 'Bank Transfer';
        modes.push(mode);
        mode = new SelectListItemModel();
        mode.keyInt = 2;
        mode.value = 'Cheque';
        modes.push(mode);
        return modes;
    }

    public getWithPercentageSign(data) {
        return data + '%';
    }

    public getCurrencySign() {
        return '$';
    }

    public toMoney(amount: number) {
        if (!amount) {
            return '$0.00';
        }
        return '$' + amount.toFixed(2);
    }

    public applyPhoneMask(value: string) {
        if (!value || value.length < 10) {
            return value;
        }

        const firstPart = value.substring(0, 3);
        const secondPart = value.substring(3, 6);
        const thirdPart = value.substring(6, 10);

        return `${firstPart}-${secondPart}-${thirdPart}`;
    }

    public scrollToTop() {
        $('html, body').animate({ scrollTop: 0 }, 'slow');
    }
}
