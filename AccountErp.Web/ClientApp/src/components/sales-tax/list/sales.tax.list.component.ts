import { Component, ViewChild, OnInit, AfterViewInit, Input } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppSettings } from '../../../helpers';
import { DataTableResponseModel } from '../../../models';

@Component({
    selector: 'app-sales-tax-list',
    templateUrl: './sales.tax.list.component.html'
})

export class SalesTaxListComponent implements OnInit, AfterViewInit {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    @Input() vendorId: number;
    @ViewChild(DataTableDirective, { static: false })
    datatableElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtInstance: DataTables.Api;
    rowIndex = 0;
    pageLength = 10;
    search: any = null;

    constructor(private http: HttpClient,
        private appSettings: AppSettings) { }

    ngOnInit(): void {
        const self = this;
        this.dtOptions = {
            serverSide: true,
            processing: true,
            language: {
                loadingRecords: '&nbsp;',
                processing: '<div class="block-ui-spinner"><div class="loader"></div></div>',
                searchPlaceholder: 'Filter sales taxes...',
                paginate: {
                    first: '<i class="la la-angle-double-left ">',
                    last: '<i class="la la-angle-double-right ">',
                    previous: '<i class="la la-angle-left ">',
                    next: '<i class="la la-angle-right ">'
                }
            },
            search: { search: self.search },
            displayStart: self.rowIndex,
            paging: true,
            pagingType: 'full_numbers',
            pageLength: self.pageLength,
            lengthMenu: [10, 15, 25, 50, 100],
            ajax: (dataTablesParameters: any, callback) => {

                dataTablesParameters.vendorId = self.vendorId;

                self.http
                    .post<DataTableResponseModel>(this.appSettings.ApiBaseUrl + 'salesTax/paged-result', dataTablesParameters, {})
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
                    data: 'code',
                    title: 'Sales Tax Code',
                    width: '25%'
                },
                {
                    data: 'class',
                    title: 'Class',
                    width: '25%'
                },
                {
                    data: 'description',
                    title: 'Description',
                    width: '25%'
                },
                {
                    data: 'isTaxable',
                    title: 'Tax Applicability',
                    width: '20%',
                    render: function (data) {
                        return data === true ? 'Taxable' : 'Non-Taxable';
                    }
                }

            ],
            rowCallback: function (row, data: any) {

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

