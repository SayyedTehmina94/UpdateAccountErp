import { Component, ViewChild, OnInit, AfterViewInit, Input } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { ItemListItemModel } from '../../../models';
import { AppSettings } from '../../../helpers';
import { DataTableResponseModel } from '../../../models';

@Component({
    selector: 'app-item-selector',
    templateUrl: './item.selector.component.html'
})

export class ItemSelectorComponent implements OnInit, AfterViewInit {
    @BlockUI('container-blockui-items') blockUI: NgBlockUI;
    @Input() selectedItems: Array<ItemListItemModel>;
    @Input() testVariable;
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
                searchPlaceholder: 'Filter item & services...',
                paginate: {
                    first: '<i class="fa fa-angle-double-left ">',
                    last: '<i class="fa fa-angle-double-right ">',
                    previous: '<i class="fa fa-angle-left ">',
                    next: '<i class="fa fa-angle-right ">'
                }
            },
            search: { search: self.search },
            displayStart: self.rowIndex,
            paging: true,
            pagingType: 'full_numbers',
            pageLength: self.pageLength,
            lengthMenu: [10, 15, 25, 50, 100],
            ajax: (dataTablesParameters: any, callback) => {
                self.http
                    .post<DataTableResponseModel>(this.appSettings.ApiBaseUrl + 'item/paged-result', dataTablesParameters, {})
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
                    data: 'name',
                    title: 'Name',
                    width: '25%',
                    render: function (data, type, row) {
                        const item = self.selectedItems.find(x => x.id === row.id);
                        if (item) {
                            return `<label class=""><input type="checkbox" action-type='select-record' checked>
                            <span></span> ${data}</label>`;
                        } else {
                            return `<label class=""><input type="checkbox" action-type='select-record'>
                            <span></span> ${data}</label>`;
                        }
                    }
                },
                {
                    data: 'itemTypeName',
                    title: 'Type',
                    width: '25%'
                },
                {
                    data: 'rate',
                    title: 'Rate ',
                    width: '25%'
                },
                {
                    data: 'taxCode',
                    title: 'Tax',
                    width: '25%',
                    render: function (data, type, row) {
                        if (row.taxCode != null || row.taxPercentage != null) {
                            return `${row.taxCode} (${row.taxPercentage}%)`;
                        }
                        return `non-taxable`;
                    }
                },
                {
                    data: 'description',
                    title: 'Description',
                    width: '20%'
                }
            ],
            rowCallback: function (row, data: any) {
                const detailElem = $(row).find('[action-type = select-record]');
                $(detailElem).unbind('change');
                $(detailElem).on('change', function (e: any) {
                    const checkedStatus = $(this).prop('checked');
                    self.updateSelectedList(data, checkedStatus);
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

    updateSelectedList(selectedItem: ItemListItemModel, checkedStatus: boolean) {
        const item = this.selectedItems.find(x => x.id === selectedItem.id);
        if (checkedStatus === true) {
            if (!item) {
                this.selectedItems.push(selectedItem);
            }
        } else {
            if (item) {
                const itemIndex = this.selectedItems.indexOf(item);
                this.selectedItems.splice(itemIndex, 1);
            }
        }
    }
}

