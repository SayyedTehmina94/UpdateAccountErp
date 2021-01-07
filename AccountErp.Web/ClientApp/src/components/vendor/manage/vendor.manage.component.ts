import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils, AppSettings } from '../../../helpers';
import { BillFilterModel, DataTableResponseModel, SelectListItemModel } from '../../../models';
import { VendorService } from '../../../services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-vendor-manage',
    templateUrl: './vendor.manage.component.html'
})

export class VendorManageComponent implements OnInit, AfterViewInit {
    @BlockUI('container-blockui-main') blockUI: NgBlockUI;
    @ViewChild('deleteModal', { static: false }) deleteModal: any;
    @ViewChild(DataTableDirective, { static: false })
    datatableElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtInstance: DataTables.Api;
    rowIndex = 0;
    pageLength = 10;
    search: any = null;
    vendors: Array<SelectListItemModel> = new Array<SelectListItemModel>();
    filterModel: BillFilterModel = new BillFilterModel();
    modalReference: any;
    deleteId;

    constructor(private http: HttpClient,
        private router: Router,
        private toastr: ToastrService,
        private vendorService: VendorService,
        private appUtils: AppUtils,
        private appSettings: AppSettings,
        private modalService: NgbModal) { }

    ngOnInit(): void {
        this.loadVendors();
        const self = this;
        this.dtOptions = {
            dom: '<"top">rt<"bottom"lip><"clear">',
            serverSide: true,
            processing: true,
            language: {
                loadingRecords: '&nbsp;',
                processing: '<div class="block-ui-spinner"><div class="loader"></div></div>',
                searchPlaceholder: 'Filter vendor',
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
                
                dataTablesParameters.vendorId = self.filterModel.vendorId;
                dataTablesParameters.filterKey = self.filterModel.filterKey;

                self.http
                    .post<DataTableResponseModel>(this.appSettings.ApiBaseUrl + 'Vendor/paged-result', dataTablesParameters, {})
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
                        return `<a href='javascript:;' action-type='view-detail'>${row.name} </a>`;
                    }
                },
                {
                    data: 'hstNumber',
                    title: 'HST#',
                    width: '15%'
                },
                {
                    data: 'email',
                    title: 'Email',
                    width: '25%'
                },
                {
                    data: 'phone',
                    title: 'Phone',
                    width: '15%',
                    render: function (data) {
                        return self.appUtils.applyPhoneMask(data);
                    }
                },
                {
                    data: 'status',
                    title: 'Status',
                    width: '10%',
                    render: function (data) {
                        return data === 1
                            ? '<span class="badge badge-success">Active</span>'
                            : '<span class="badge badge-danger">Inactive</span>';
                    }
                },
                {
                    data: null,
                    title: 'Action',
                    width: '10%',
                    orderable: false,
                    className: 'text-center',
                    render: function (data, type, row) {
                        const htmlString = 
                        ` <button type="button" class="btn btn-outline-success btn-sm dropdown-toggle"
                        data-toggle="dropdown">
                        Action
                    </button>
                    <div class="dropdown-menu dropdown-menu-fit dropdown-menu-right action-ul">
                        <ul class="manageList table-hover">
                            <li class="list">
                                <a class="navigationLink">
                                    <em class=" fa fa-credit-card"></em>
                                    <span class="" action-type = 'make-bill'>Create Bill</span>
                                </a>
                            </li>`
                            const htmlStatus=
                            row.status === 1
                            ?`<li class="list">
                            <a class="navigationLink">
                                <em class=" fa fa-ban"></em>
                                <span class="" action-type = 'toggle-status'>Deactivate</span>
                            </a>
                        </li>`
                        :`<li class="list">
                                <a  class="navigationLink">
                                    <em class="fa fa-check"></em>
                                    <span class="" action-type = 'toggle-status'>Activate</span>
                                </a>
                            </li>`

                            const htmlString2=htmlString +htmlStatus
                            
                            +`<li class="list">
                                <a class="navigationLink">
                                    <em class=" fa fa-edit"></em>
                                    <span class="" action-type='edit'> Edit</span>
                                </a>
                            </li>
                            <li class="list">
                                <a class="navigationLink">
                                    <em class=" fa fa-file"></em>
                                    <span class="" action-type='view-detail'>
                                        View Detail
                                    </span>
                                </a>
                            </li>
                            <li class="list">
                            <a class="navigationLink">
                                <em class=" fa fa-trash"></em>
                                <span class="" action-type='delete'>
                                    Delete
                                </span>
                            </a>
                        </li>
                        </ul>
                    </div>`
                        // const statusHtml =
                        //     row.status === 1
                        //         ? `<em class='fa fa-ban cursor-pointer m-r-5' title='Deactivate' action-type='toggle-status'></em>`
                        //         : row.status === 2
                        //             ? `<em class='fa fa-check cursor-pointer m-r-5' title='Activate' action-type='toggle-status'></em>`
                        //             : '';

                        // const htmlString = statusHtml
                        //     + `<em class='fa fa-edit cursor-pointer m-r-3' title='Edit' action-type='edit'></em>`
                        //     + `<em class='fa fa-trash cursor-pointer' title='Delete' action-type='delete'></em>`;

                        return htmlString2;
                    }
                }
            ],
            rowCallback: function (row, data: any) {
                const toggleStatusElem = $(row).find('[action-type = "toggle-status"]');
                $(toggleStatusElem).unbind('click');
                $(toggleStatusElem).on('click', function () {
                    self.toggleStatus(data.id, data.status);
                });

                const editElem = $(row).find('[action-type = "edit"]');
                $(editElem).unbind('click');
                $(editElem).on('click', function () {
                    self.router.navigate(['/vendor/edit', data.id]);
                });

                const delElem = $(row).find('[action-type = delete]');
                $(delElem).unbind('click');
                $(delElem).on('click', function () {
                    self.opendelmodal(data.id);
                });

                const detailElem = $(row).find('[action-type = view-detail]');
                $(detailElem).unbind('click');
                $(detailElem).on('click', function () {
                    self.router.navigate(['/vendor/detail', data.id]);
                });

                const billElem = $(row).find('[action-type = make-bill]');
                $(billElem).unbind('click');
                $(billElem).on('click', function () {
                    self.router.navigate(['/bill/add', data.id]);
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

    opendelmodal(id){
        this.deleteId = id
        this.openDeleteModal(this.deleteModal);
    }

    openDeleteModal(content :any){
        
        this.modalReference = this.modalService.open(content,
          {
              backdrop: 'static',
              keyboard: false,
              size: 'lg'
          });
      }

      closeDeleteModal() {
        this.modalReference.close();
    }


    toggleStatus(id: number, status: number): void {
        this.blockUI.start();
        this.vendorService.toggleStatus(id).subscribe(
            () => {
                this.blockUI.stop();
                setTimeout(() => {
                    this.dtInstance.ajax.reload();
                });
                this.toastr.success(`Vendor has been ${(status === 1 ? 'deactivated' : 'activated')} successfully.`);
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }

    delete(): void {
        this.closeDeleteModal();
        this.blockUI.start();
        this.vendorService.delete(this.deleteId).subscribe(
            () => {
                this.blockUI.stop();
                setTimeout(() => {
                    this.dtInstance.ajax.reload();
                });
                this.toastr.success('Vendor has been deleted successfully.');
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
        this.filterModel.vendorId = '';
        this.filterModel.filterKey = null;
        this.doFilter();
    }
    loadVendors() {
        this.vendorService.getSelectItems()
            .subscribe(
                data => {
                    Object.assign(this.vendors, data);
                },
                error => {
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
    }

}

