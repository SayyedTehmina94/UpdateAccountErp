import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils } from '../../../../helpers';
import { SelectListItemModel, InvoiceSummaryModel, CustomerPaymentInfoModel, InvoicePaymentModel } from '../../../../models';
import { InvoiceService, BankAccountService, CustomerService, InvoicePaymentService } from '../../../../services';

@Component({
    selector: 'app-invoice-payment-add',
    templateUrl: './invoice.payment.add.component.html'
})

export class InvoicePaymentAddComponent implements OnInit {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    model: InvoicePaymentModel = new InvoicePaymentModel();
    invoicePaymentModes: Array<SelectListItemModel> = new Array<SelectListItemModel>();
    bankAccounts: Array<SelectListItemModel> = new Array<SelectListItemModel>();
    depositFromAccounts: Array<SelectListItemModel> = new Array<SelectListItemModel>();
    customerPaymentInfoModel: CustomerPaymentInfoModel = new CustomerPaymentInfoModel();
    invoiceSummaryModel: InvoiceSummaryModel = new InvoiceSummaryModel();

    constructor(private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private appUtils: AppUtils,
        private invoiceService: InvoiceService,
        private bankAccountService: BankAccountService,
        private customerService: CustomerService,
        private invoicePaymentService: InvoicePaymentService) {
        this.route.params.subscribe((params) => {
            this.model.invoiceId = params['id'];
        });
    }

    ngOnInit() {
        this.invoicePaymentModes = this.appUtils.getInvoicePaymentModesSelectList();
        this.loadBankAccounts();
        this.loadInvoiceSummary();
        this.model.paymentDate = this.appUtils.getDateForNgDatePicker(null);
    }

    loadBankAccounts() {
        this.bankAccountService.getSelectItems()
            .subscribe(
                data => {
                    Object.assign(this.bankAccounts, data);
                },
                error => {
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
    }

    loadInvoiceSummary() {
        this.blockUI.start();
        this.invoiceService.getSummary(this.model.invoiceId)
            .subscribe(
                (data) => {
                    this.blockUI.stop();
                    Object.assign(this.invoiceSummaryModel, data);
                    setTimeout(() => {
                        this.loadCustomerPaymentInfo();
                    }, 100);
                },
                error => {
                    this.blockUI.stop();
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
    }

    loadCustomerPaymentInfo() {
        this.blockUI.start();
        this.customerService.getPaymentInfo(this.invoiceSummaryModel.customerId)
            .subscribe(
                data => {
                    this.blockUI.stop();
                    Object.assign(this.customerPaymentInfoModel, data);

                    if (this.customerPaymentInfoModel.accountNumber != null) {
                        const selectListItem = new SelectListItemModel();
                        selectListItem.keyString = this.customerPaymentInfoModel.accountNumber;
                        selectListItem.value = this.customerPaymentInfoModel.accountNumber;
                        this.depositFromAccounts.push(selectListItem);
                    }
                },
                error => {
                    this.blockUI.stop();
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
    }

    chengePaymentMode() {
        if (this.model.paymentMode !== '2') {
            this.model.chequeNumber = '';
        }
    }

    submit() {
        this.blockUI.start();
        if (this.model.paymentDate) {
            this.model.paymentDate = this.appUtils.getFormattedDate(this.model.paymentDate, null);
        }
        this.invoicePaymentService.add(this.model)
            .subscribe(
                data => {
                    this.blockUI.stop();
                    setTimeout(() => {
                        this.router.navigate(['/invoice/payments']);
                    }, 100);
                    setTimeout(() => {
                        this.toastr.success('Payment has been done successfully');
                    }, 500);
                },
                error => {
                    this.blockUI.stop();
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
    }
}
