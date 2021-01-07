import { Component, ViewChild, OnInit, AfterViewInit, Input } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils, AppSettings } from '../../../helpers';
import { DataTableResponseModel } from '../../../models';

@Component({
    selector: 'app-invoice-list',
    templateUrl: './invoice.list.component.html'
})

export class InvoiceListComponent implements OnInit, AfterViewInit {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    @Input() customerId: number;
    @ViewChild(DataTableDirective, { static: false })
    datatableElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtInstance: DataTables.Api;
    rowIndex = 0;
    pageLength = 10;
    search: any = null;
    break:string;
    constructor(private http: HttpClient,
        private appSettings: AppSettings,
        private router: Router,
        private appUtils: AppUtils, ) { }

    ngOnInit(): void {
        const self = this;
        this.dtOptions = {
            dom: '<"top">rt<"bottom"lip><"clear">',
            serverSide: true,
            processing: true,
            language: {
                loadingRecords: '&nbsp;',
                processing: '<div class="block-ui-spinner"><div class="loader"></div></div>',
                searchPlaceholder: 'Filter Invoice...',
                paginate: {
                    first: '<i class="fa fa-angle-double-left ">',
                    last: '<i class="fa fa-angle-double-right">',
                    previous: '<i class="fa fa-angle-left">',
                    next: '<i class="fa fa-angle-right">'
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

                dataTablesParameters.customerId = self.customerId;

                self.http
                    .post<DataTableResponseModel>(this.appSettings.ApiBaseUrl + 'invoice/paged-result', dataTablesParameters, {})
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
                    data: 'id',
                    title: 'Invoice#',
                    width: '10%',
                    render: function (data, type, row) {
                        return `<a href='javascript:;' action-type='view-detail'>${data}</a>`;
                    }
                },
                {
                    className: 'text-right',
                    data: 'amount',
                    title: 'Amount',
                    width: '10%',
                    render: function (data, type, row) {
                        return `<span class="m-r-15">${self.appUtils.toMoney(data)}</span>`;
                    }
                },
                {
                    className: 'text-right',
                    data: 'discount',
                    title: 'Discount',
                    width: '10%',
                    render: function (data, type, row) {
                        return `<span class="m-r-15">${self.appUtils.toMoney(data)}</span>`;
                    }
                },
                {
                    className: 'text-right',
                    data: 'tax',
                    title: 'Tax',
                    width: '10%',
                    render: function (data, type, row) {
                        return `<span class="m-r-15">${self.appUtils.toMoney(data)}</span>`;
                    }
                },
                {
                    className: 'text-right',
                    data: 'totalAmount',
                    title: 'Payable Amount',
                    width: '16%',
                    render: function (data, type, row) {
                        return `<span class="m-r-15">${self.appUtils.toMoney(data)}</span>`;
                    }
                },
                {
                    data: 'createdOn',
                    title: 'Date',
                    width: '14%',
                    render: function (data) {
                        return self.appUtils.getFormattedDate(data, null);
                    }
                },
                {
                    data: 'description',
                    title: 'Description',
                    width: '20%'
                },
                {
                    data: 'status',
                    title: 'Status',
                    width: '10%',
                    render: function (data, type, row) {
                        return data === 0
                            ? `<span class='badge badge-dark'>Pending</span>`
                            : data === 1 ?
                                `<span class='badge badge-success'>Paid</span>`
                                : `<span class='inactiveStatus badge'>Deleted</span>`;
                    }
                },
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
}

