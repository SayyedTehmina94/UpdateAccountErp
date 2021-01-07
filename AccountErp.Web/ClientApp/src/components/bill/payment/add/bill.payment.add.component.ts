import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils } from '../../../../helpers';
import { SelectListItemModel, ExpenseSummaryModel, VendorPaymentInfoModel, BillPaymentModel } from '../../../../models';
import { BillService, BankAccountService, VendorService, BillPaymentService, CreditCardService } from '../../../../services';

@Component({
    selector: 'app-bill-payment',
    templateUrl: './bill.payment.add.component.html'
})

export class BillPaymentAddComponent implements OnInit {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    model: BillPaymentModel = new BillPaymentModel();
    paymentModes: Array<SelectListItemModel> = new Array<SelectListItemModel>();
    bankAccounts: Array<SelectListItemModel> = new Array<SelectListItemModel>();
    creditCards: Array<SelectListItemModel> = new Array<SelectListItemModel>();
    depositToAccounts: Array<SelectListItemModel> = new Array<SelectListItemModel>();
    vendorPaymentInfoModel: VendorPaymentInfoModel = new VendorPaymentInfoModel();
    expenseSummaryModel: ExpenseSummaryModel = new ExpenseSummaryModel();

    constructor(private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private appUtils: AppUtils,
        private billService: BillService,
        private bankAccountService: BankAccountService,
        private vendorService: VendorService,
        private billPaymentService: BillPaymentService,
        private creditCardService: CreditCardService) {
        this.route.params.subscribe((params) => {
            this.model.billId = params['id'];
        });
    }

    ngOnInit() {
        this.paymentModes = this.appUtils.getPaymentModesSelectList();
        this.loadBankAccounts();
        this.loadCreditCards();
        this.loadExpenseSummary();
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

    loadCreditCards() {
        this.creditCardService.getSelectItems()
            .subscribe(
                data => {
                    Object.assign(this.creditCards, data);
                },
                error => {
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
    }

    loadExpenseSummary() {
        this.blockUI.start();
        this.billService.getSummary(this.model.billId)
            .subscribe(
                (data) => {
                    this.blockUI.stop();
                    Object.assign(this.expenseSummaryModel, data);
                    setTimeout(() => {
                        this.loadVendorPaymentInfo();
                    }, 100);
                },
                error => {
                    this.blockUI.stop();
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
    }

    loadVendorPaymentInfo() {
        this.blockUI.start();
        this.vendorService.getPaymentInfo(this.expenseSummaryModel.vendorId)
            .subscribe(
                data => {
                    this.blockUI.stop();
                    Object.assign(this.vendorPaymentInfoModel, data);

                    if (this.vendorPaymentInfoModel.accountNumber != null) {
                        const selectListItem = new SelectListItemModel();
                        selectListItem.keyString = this.vendorPaymentInfoModel.accountNumber;
                        selectListItem.value = this.vendorPaymentInfoModel.accountNumber;
                        this.depositToAccounts.push(selectListItem);
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
        this.billPaymentService.add(this.model)
            .subscribe(
                data => {
                    this.blockUI.stop();
                    setTimeout(() => {
                        this.router.navigate(['/bill/payments']);
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
