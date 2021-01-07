import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils, AppSettings } from '../../../helpers';
import { DataTableResponseModel, SelectListItemModel, BillFilterModel } from '../../../models';
import { BillService, VendorService } from '../../../services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-bill-manage',
    templateUrl: './bill.manage.component.html'
})

export class BillManageComponent implements OnInit, AfterViewInit {
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
        private billService: BillService,
        private appUtils: AppUtils,
        private appSettings: AppSettings,
        private vendorService: VendorService,
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
                searchPlaceholder: 'Filter sales tax...',
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

                dataTablesParameters.vendorId = self.filterModel.vendorId;
                dataTablesParameters.filterKey = self.filterModel.filterKey;

                self.http
                    .post<DataTableResponseModel>(this.appSettings.ApiBaseUrl + 'bill/paged-result', dataTablesParameters, {})
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
                    data: 'billNumber',
                    title: 'Bill#',
                    width: '15%',
                    render: function (data, type, row) {
                        return `<a href='javascript:;' action-type='view-detail'>${data} </a>`;
                    }
                },
                {
                    data: 'vendorName',
                    title: 'Vendor Name',
                    width: '30%'
                },
                {
                    data: 'totalAmount',
                    title: 'Amount',
                    width: '15%',
                    render: function (data, type, row) {
                        return `<span class="m-r-15">${self.appUtils.toMoney(data)}</span>`;
                    }
                },
                {
                    data: 'status',
                    title: 'Status',
                    width: '15%',
                    render: function (data, type, row) {
                        return data === 0
                            ? `<span class='badge badge-dark'>Pending</span>`
                            : data === 1 ?
                                `<span class='badge badge-success'>Paid</span>`
                            : data === 2 ?
                                `<span class='badge badge-danger'>Deleted</span>`
                                : `<span class='badge badge-warning'>Overdue</span>`;
                    }
                },
                {
                    data: 'createdOn',
                    title: 'Created On',
                    width: '15%',
                    render: function (data) {
                        return self.appUtils.getFormattedDate(data, null);
                    }
                },
                {
                    data: null,
                    title: 'Action',
                    width: '10%',
                    className: 'text-center',
                    render: function (data, type, row) {
                        const htmlString = (
                            ` <button type="button" class="btn btn-outline-success btn-sm dropdown-toggle .custom-btn"
                             data-toggle="dropdown">
                             Action
                         </button>
                         <div class="dropdown-menu dropdown-menu-fit dropdown-menu-right">
                             <ul class="manageList">
                                 <li class="list">
                                     <a class="navigationLink">
                                         <em class=" fa fa-credit-card"></em>
                                         <span class="" action-type = 'pay-bill'> Pay Bill</span>
                                     </a>
                                 </li>
                                 <li class="list">
                                     <a  class="navigationLink">
                                         <em class="fa fa-print"></em>
                                         <span class="" action-type='view-detail'>View Details</span>
                                     </a>
                                 </li>
                                 <li class="list">
                                     <a class="navigationLink">
                                         <em class=" fa fa-edit"></em>
                                         <span class="" action-type='edit'> Edit</span>
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
                         </div>`)
                            // ? `<em class='fa fa-edit cursor-pointer m-r-3' title='Edit' action-type='edit'></em>`
                            // : '<em class="m-r-10">&nbsp;</em>')
                            // + `<em class='fa fa-trash cursor-pointer' title='Delete' action-type='delete'></em>`;
                        return htmlString;
                    }
                }
            ],
            rowCallback: function (row, data: any) {
                const editElem = $(row).find('[action-type = "edit"]');
                $(editElem).unbind('click');
                $(editElem).on('click', function () {
                    self.router.navigate(['/bill/edit', data.id]);
                });

                const delElem = $(row).find('[action-type = delete]');
                $(delElem).unbind('click');
                $(delElem).on('click', function () {
                    self.opendelmodal(data.id);
                });

                const detailElem = $(row).find('[action-type = view-detail]');
                $(detailElem).unbind('click');
                $(detailElem).on('click', function () {
                    self.router.navigate(['/bill/detail', data.id]);
                });

                const paybillElem = $(row).find('[action-type = pay-bill]');
                $(paybillElem).unbind('click');
                $(paybillElem).on('click', function () {
                    self.router.navigate(['vend-payment/add-vendor-payment', data.id]);
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

    delete(): void {
        this.closeDeleteModal();
        this.blockUI.start();
        this.billService.delete(this.deleteId).subscribe(
            () => {
                this.blockUI.stop();
                setTimeout(() => {
                    this.dtInstance.ajax.reload();
                });
                this.toastr.success('Bill has been deleted successfully.');
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

}

