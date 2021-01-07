import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils, AppSettings } from '../../../../helpers';
import { DataTableResponseModel, SelectListItemModel, InvoiceFilterModel } from '../../../../models';
import { InvoiceService, CustomerService } from '../../../../services';

@Component({
    selector: 'app-invoice-payment-manage',
    templateUrl: './invoice.payment.manage.component.html'
})

export class InvoicePaymentManageComponent implements OnInit, AfterViewInit {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    @ViewChild(DataTableDirective, { static: false })
    datatableElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtInstance: DataTables.Api;
    rowIndex = 0;
    pageLength = 10;
    search: any = null;
    customers: Array<SelectListItemModel> = new Array<SelectListItemModel>();
    filterModel: InvoiceFilterModel = new InvoiceFilterModel();

    constructor(private http: HttpClient,
        private router: Router,
        private toastr: ToastrService,
        private invoiceService: InvoiceService,
        private appUtils: AppUtils,
        private appSettings: AppSettings,
        private customerService: CustomerService) { }

    ngOnInit(): void {
        this.loadCustomers();
        const self = this;
        this.dtOptions = {
            dom: '<"top">rt<"bottom"lip><"clear">',
            serverSide: true,
            processing: true,
            language: {
                loadingRecords: '&nbsp;',
                processing: '<div class="block-ui-spinner"><div class="loader"></div></div>',
                searchPlaceholder: 'Filter sales tax...',
                paginate: {
                    first: '<i class="fa fa-angle-double-left">',
                    last: '<i class="fa fa-angle-double-right ">',
                    previous: '<i class="fa fa-angle-left">',
                    next: '<i class="fa fa-angle-right ">'
                }
            },
            search: { search: self.search },
            displayStart: self.rowIndex,
            paging: true,
            pagingType: 'full_numbers',
            pageLength: self.pageLength,
            lengthMenu: [10, 15, 25, 50, 100],
            order: [[0, 'asc']],
            stateSave: true,
            ajax: (dataTablesParameters: any, callback) => {

                // dataTablesParameters.customerId = self.filterModel.customerId;
                dataTablesParameters.customerId = null;
                dataTablesParameters.filterKey = self.filterModel.filterKey;

                self.http
                    .post<DataTableResponseModel>(this.appSettings.ApiBaseUrl + 'invoicePayment/paged-result', dataTablesParameters, {})
                    .subscribe(resp => {
                        callback({
                            recordsTotal: resp.recordsTotal,
                            recordsFiltered: resp.recordsFiltered,
                            data: resp.data
                        });
                    });
            },
            columns: [
                {
                    data: 'invoiceNumber',
                    title: 'Invoice#',
                    width: '15%',
                    render: function (data, type, row) {
                        return `<a href='javascript:;' action-type='view-detail'>${row.invoiceNumber}</a>`;
                    }
                },
                {
                    data: 'firstName',
                    title: 'Customer Name',
                    width: '15%',
                    render: function (data, type, row) {
                        if (!row.middleName) {
                            row.middleName = '';
                        }
                        if (!row.lastName) {
                            row.lastName = '';
                        }
                        return row.firstName + ' ' + row.middleName + ' ' + row.lastName;
                    }
                },
                {
                    data: 'paymentMode',
                    title: 'Payment Mode',
                    width: '15%',
                    render: function (data, type, row) {

                        switch (data) {
                            case 0:
                                return 'Cash';
                            case 1:
                                return 'Bank Transfer';
                            case 2:
                                return 'Cheque';
                            case 3:
                                return 'Credit Card';
                        }
                    }
                },
                {
                    data: 'createdOn',
                    title: 'Created On',
                    width: '15%',
                    render: function (data, type, row) {
                        return self.appUtils.getFormattedDate(data, null);
                    }
                },
                {
                    className: 'text-right',
                    data: 'amount',
                    title: 'Amount',
                    width: '10%',
                    render: function (data, type, row) {
                        return `<span class='m-r-15'>${self.appUtils.toMoney(data)}</span>`;
                    }
                },
                {
                    data: 'depositFrom',
                    title: 'Deposit From',
                    width: '15%'
                },
                {
                    data: 'depositTo',
                    title: 'Deposit To',
                    width: '15%'
                }
            ],
            rowCallback: function (row, data: any) {
                const detailElem = $(row).find('[action-type = view-detail]');
                $(detailElem).unbind('click');
                $(detailElem).on('click', function () {
                    self.router.navigate(['/invoice/detail', data.id]);
                });
            },
            drawCallback: function () {
                if ($('.pagination li').length <= 5) {
                    $('.pagination').hide();
                }
            }
        };
    }

    ngAfterViewInit(): void {
        this.datatableElement.dtInstance
            .then((dtInstance: DataTables.Api) => this.dtInstance = dtInstance);
    }

    loadCustomers() {
        this.customerService.getSelectItems()
            .subscribe(
                data => {
                    Object.assign(this.customers, data);
                },
                error => {
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
    }

    delete(id: number): void {
        if (!confirm('Are you sure you want to delete the selected invoice?')) {
            return;
        }
        this.blockUI.start();
        this.invoiceService.delete(id).subscribe(
            () => {
                this.blockUI.stop();
                setTimeout(() => {
                    this.dtInstance.ajax.reload();
                });
                this.toastr.success('Invoice has been deleted successfully.');
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }

    doFilter() {
        this.dtInstance.ajax.reload();
    }

    resetFilter() {
        this.filterModel.customerId = '';
        this.filterModel.filterKey = '';
        this.doFilter();
    }

}