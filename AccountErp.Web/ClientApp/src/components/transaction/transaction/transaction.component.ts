import { Component, OnInit, ViewChild } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/services';
import { AppUtils, AppSettings } from 'src/helpers';
import { DataTableResponseModel, InvoiceFilterModel } from 'src/models';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  @BlockUI('container-blockui-main') blockUI: NgBlockUI;
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
      private toastr: ToastrService,
      private customerService: CustomerService,
      private appUtils: AppUtils,
      private appSettings: AppSettings) {

  }

  ngOnInit(): void {
      const self = this;

      this.dtOptions = {
          
        dom: '<"top">rt<"bottom"lip><"clear">',
          serverSide: true,
          processing: true,
         
          language: {
              loadingRecords: '&nbsp;',
            
              processing: '<div class="block-ui-spinner"><div class="loader"></div></div>',
              searchPlaceholder: 'Filter customer',
              paginate: {
                  first: '<i class="fa fa-angle-double-left ">',
                  last: '<i class="fa fa-angle-double-right ">',
                  previous: '<i class="fa fa-angle-left ">',
                  next: '<i class="fa fa-angle-right ">'
              },
              
          },
          
          search: { search: self.search },
          displayStart: self.rowIndex,
          paging: true,
          pagingType: 'full_numbers',
          pageLength: self.pageLength,
          lengthMenu: [10, 15, 25, 50, 100],
          ajax: (dataTablesParameters: any, callback) => {
            dataTablesParameters.filterKey = self.filterModel.filterKey;
              self.http

                  .post<DataTableResponseModel>(this.appSettings.ApiBaseUrl + 'Transaction/paged-result', dataTablesParameters, {})
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
                  title: "ID",
                  width: '20%',
                 
              },
              {
                  data: 'transactionId',
                  title: 'TR_ID',
                  width: '20%',
                 
              },
              {
                data: 'bankAccountName',
                title: 'AccName',
                width: '20%',
               
            },

              
              {
                data: 'transactionType',
                title: 'Transaction',
                width: '20%',
                render: function (data) {
                  return data === 0
                      ?  "Customer Payment"
                      : data === 1
                      ? "Invoice"
                      : data === 2 
                      ? "VendorPayment"
                      : data === 3
                      ? "Bill"
                      : data === 4
                      ? "Income"

                      : "Expense";
              }
            },
              {
                  data: 'description',
                  title: 'Description',
                  width: '20%'
              },
              {
                  data: 'contactName',
                  title: 'Contact',
                  width: '20%',
                 
              },
              {
                data: 'amount',
                title: 'Amount',
                width: '20%',
               
            },
              {
                data: 'transactionDate',
                title: 'Transaction Date',
                width: '20%',
                render: function (data) {
                    return self.appUtils.getFormattedDate(data, null);
                }
               
            },
            {
                data: 'debitAmount',
                title: 'Debit Amount',
                width: '20%',
               
            },
            {
                data: 'creditAmount',
                title: 'Credit Amount',
                width: '20%',
               
            },
              {
                  data: 'status',
                  title: 'Status',
                  width: '10%',
                  render: function (data) {
                      return data === 1
                          ? '<span class="badge badge-success">Paid</span>'
                          : '<span class="badge badge-dark">Pending</span>';
                  }
              },
            
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
                  self.router.navigate(['/customer/edit', data.id]);
              });

              const delElem = $(row).find('[action-type = delete]');
              $(delElem).unbind('click');
              $(delElem).on('click', function () {
                  self.delete(data.id);
              });

              const detailElem = $(row).find('[action-type = view-detail]');
              $(detailElem).unbind('click');
              $(detailElem).on('click', function () {
                  self.router.navigate(['/customer/detail', data.id]);
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

  toggleStatus(id: number, status: number): void {
      this.blockUI.start();
      this.customerService.toggleStatus(id).subscribe(
          () => {
              setTimeout(() => {
                  this.dtInstance.ajax.reload();
              });
              this.blockUI.stop();
              this.toastr.success(`Customer has been ${(status === 1 ? 'deactivated' : 'activated')} successfully.`);
          },
          error => {
              this.blockUI.stop();
              this.appUtils.ProcessErrorResponse(this.toastr, error);
          });
  }

  delete(id: number): void {
      if (!confirm('Are you sure you want to delete the selected customer?')) {
          return;
      }
      this.blockUI.start();
      this.customerService.delete(id).subscribe(
          () => {
              this.blockUI.stop();
              setTimeout(() => {
                  this.dtInstance.ajax.reload();
              });
              this.toastr.success('Customer has been deleted successfully.');
          },
          error => {
              this.blockUI.stop();
              this.appUtils.ProcessErrorResponse(this.toastr, error);
          });
  }

  doFilter() {
      if(this.filterModel.filterKey == '')
      {
          this.filterModel.filterKey = null;
      }
    this.dtInstance.ajax.reload();
}

resetFilter() {
    this.filterModel.customerId = '';
    this.filterModel.filterKey = null;
    this.doFilter();
}

}
