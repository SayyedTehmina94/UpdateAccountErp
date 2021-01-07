import { Component, ViewChild, OnInit, AfterViewInit, Input } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils, AppSettings } from '../../../../helpers';
import { DataTableResponseModel, InvoiceFilterModel } from '../../../../models';

@Component({
    selector: 'app-invoice-payment-list',
    templateUrl: './invoice.payment.list.component.html'
})

export class InvoicePaymentListComponent implements OnInit, AfterViewInit {
    @BlockUI('container-blockui-invoice-payment') blockUI: NgBlockUI;
    @Input() customerId: string;
    @ViewChild(DataTableDirective, { static: false })
    datatableElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtInstance: DataTables.Api;
    rowIndex = 0;
    pageLength = 10;
    search: any = null;
    filterModel: InvoiceFilterModel = new InvoiceFilterModel();

    constructor(private http: HttpClient,
        private router: Router,
        private appUtils: AppUtils,
        private appSettings: AppSettings) { }

    ngOnInit(): void {
        this.filterModel.customerId = this.customerId;
        const self = this;
        this.dtOptions = {
            dom: '<"top">rt<"bottom"lip><"clear">',
            
            serverSide: true,
            processing: true,
            language: {
                loadingRecords: '<"/br"> &nbsp;',
                processing: '<div class="block-ui-spinner"><div class="loader"></div></div>',
                searchPlaceholder: 'Filter Payments...',
                paginate: {
                    first: '<i class="fa fa-angle-double-left ">',
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

                dataTablesParameters.customerId = self.filterModel.customerId;
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

    doFilter() {
        this.dtInstance.ajax.reload();
    }

    resetFilter() {
        this.filterModel.filterKey = '';
        this.doFilter();
    }
}
