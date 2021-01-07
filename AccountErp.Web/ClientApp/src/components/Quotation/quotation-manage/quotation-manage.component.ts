import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerService, ItemService } from 'src/services';
import { AppUtils, AppSettings } from 'src/helpers';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { DataTableDirective } from 'angular-datatables';
import { DataTableResponseModel, SelectListItemModel, InvoiceFilterModel } from 'src/models';
import { QuotationService } from 'src/services/quotation.service.service';

@Component({
  selector: 'app-quotation-manage',
  templateUrl: './quotation-manage.component.html',
})
export class QuotationManageComponent implements OnInit {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    modalReference: any;
    @ViewChild('deleteModal', { static: false }) deleteModal: any;
    @ViewChild(DataTableDirective, { static: false })
    datatableElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtInstance: DataTables.Api;
    rowIndex = 0;
    pageLength = 10;
    search: any = null;
    customers: Array<SelectListItemModel> = new Array<SelectListItemModel>();
    filterModel: InvoiceFilterModel = new InvoiceFilterModel();
    modalReference1: any;
    deleteId;

    constructor(private http: HttpClient,
        private router: Router,
        private toastr: ToastrService,
        private modalService: NgbModal,
        private QuotationService: QuotationService,
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
                searchPlaceholder: 'Filter invoice...',
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
            order: [[0, 'asc']],
            stateSave: true,
            ajax: (dataTablesParameters: any, callback) => {

                dataTablesParameters.customerId = self.filterModel.customerId;
                dataTablesParameters.filterKey = self.filterModel.filterKey;

                self.http
                    .post<DataTableResponseModel>(this.appSettings.ApiBaseUrl + 'Quotation/paged-result', dataTablesParameters, {})
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
                    data: 'quotationNumber',
                    title: 'Quotation#',
                    width: '20%',
                    render: function (data, type, row) {
                        return `<a href='javascript:;' action-type='view-detail'>${data}</a>`;
                    }
                },
                {
                    data: 'customerName',
                    title: 'Customer Name',
                    width: '25%'
                },
                {
                    data: 'totalAmount',
                    title: 'Amount',
                    width: '15%',
                    render: function (data, type, row) {
                        return `<span class='m-r-15'>${self.appUtils.toMoney(data)}</span>`;
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
                                : `<span class='inactiveStatus'>Deleted</span>`;
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
                    orderable: false,
                    className: 'text-center',
                    render: function (data, type, row) {
                        const htmlString = (
                            ` <button type="button" class="btn btn-outline-success btn-sm dropdown-toggle"
                             data-toggle="dropdown">
                             Action
                         </button>
                         <div class="dropdown-menu dropdown-menu-fit dropdown-menu-right ">
                         <ul class="manageList">
                                 <li class="list ">
                                     <a class="navigationLink">
                                         <em class=" fa fa-credit-card"></em>
                                         <span class="" action-type = 'make-invoice'> Generate Invoice</span>
                                     </a>
                                 </li>
                                 <li class="list ">
                                     <a  class="navigationLink">
                                         <em class=" fa fa-print"></em>
                                         <span class="" action-type='view-detail'>View Details</span>
                                     </a>
                                 </li>
                                 <li class="list ">
                                     <a class="navigationLink">
                                         <em class=" fa fa-edit"></em>
                                         <span class="" action-type='edit'> Edit</span>
                                     </a>
                                 </li>
                                 <li class="list ">
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
                const toggleStatusElem = $(row).find('[action-type = "toggle-status"]');
                $(toggleStatusElem).unbind('click');
                $(toggleStatusElem).on('click', function () {
                    self.toggleStatus(data.id, data.status);
                });

                const editElem = $(row).find('[action-type = "edit"]');
                $(editElem).unbind('click');
                $(editElem).on('click', function () {
                    self.router.navigate(['/Quotation/edit', data.id]);
                });

                const delElem = $(row).find('[action-type = delete]');
                $(delElem).unbind('click');
                $(delElem).on('click', function () {
                    self.opendelmodal(data.id);
                });

                const detailElem = $(row).find('[action-type = view-detail]');
                $(detailElem).unbind('click');
                $(detailElem).on('click', function () {
                    self.router.navigate(['/Quotation/detail', data.id]);
                });

                const addInvoiceElem = $(row).find('[action-type = make-invoice]');
                $(addInvoiceElem).unbind('click');
                $(addInvoiceElem).on('click', function () {
                    self.router.navigate(['/invoice/add', data.id]);
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

    toggleStatus(id: number, status: number): void {
        this.blockUI.start();
        this.QuotationService.toggleStatus(id).subscribe(
            () => {
                this.blockUI.stop();
                setTimeout(() => {
                    this.dtInstance.ajax.reload();
                });
                this.toastr.success(`Quotation has been ${(status === 1 ? 'deactivated' : 'activated')} successfully.`);
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }

    delete(): void {
        this.closeDeleteModal();
        this.blockUI.start();
        this.QuotationService.delete(this.deleteId).subscribe(
            () => {
                this.blockUI.stop();
                setTimeout(() => {
                    this.dtInstance.ajax.reload();
                });
                this.toastr.success('Quotation has been deleted successfully.');
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }

    doFilter() {
        this.dtInstance.ajax.reload();
    }

    confirmDelete(content: any){
        this.modalReference = this.modalService.open(content,
          {
              backdrop: 'static',
              keyboard: false,
              size: 'lg',
              
          });
      }
    
      closeConfirmatioModal() {
        //this.updateTotalAmount();
        this.modalReference.close();
    }

    resetFilter() {
        this.filterModel.customerId = '';
        this.filterModel.filterKey = null;
        this.doFilter();
    }
}