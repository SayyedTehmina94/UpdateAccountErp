
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerService, BankAccountService, VendorService, BillPaymentService, CreditCardService, BillService } from 'src/services';
import { AppUtils, AppSettings } from 'src/helpers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DataTableDirective } from 'angular-datatables';
import { quotationAddModel } from 'src/models/quotation/quotation.add.model';
import { CustomerDetailModel, SelectListItemModel, InvoiceFilterModel, AttachmentEditModel, InvoiceEditModel
       , InvoiceDetailModel } from 'src/models';
import { CustomerStatementDetail } from 'src/models/customerStatement/customer.statement.detail.model';

@Component({
  selector: 'app-customer-statement',
  templateUrl: './customer-statement.component.html',
  styleUrls: ['./customer-statement.component.css']
})
export class CustomerStatementComponent implements OnInit {
  [x: string]: any;
  @BlockUI('container-blockui-main') blockUI: NgBlockUI;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtInstance: DataTables.Api;
  rowIndex = 0;
  pageLength = 10;
  search: any = null;
  selectedCustomer;
  selectedStatement;
  // model: quotationAddModel = new quotationAddModel();
  // model: InvoiceEditModel = new InvoiceEditModel();
  model: CustomerStatementDetail = new CustomerStatementDetail();
  customer: CustomerDetailModel = new CustomerDetailModel();
  config = {displayKey: 'value', search: true, height: 'auto', placeholder:'Select Item',
  customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!', searchPlaceholder:'Search',
  searchOnKey: 'value',clearOnSelection: false,inputDirection: 'ltr', }
  filterModel: InvoiceFilterModel = new InvoiceFilterModel();
  customers:any;
  isShow = true;
  optionValue;
  selectedValue: any;
  startDate;
  endDate;
 
  
  statementTypes: any = ['Outstanding Invoices', 'Account Activity'];
//   statementTypes: any = [
//     {id: 1, name:'Outstanding Invoiceserman'},
//     {id: 2, name:'Account Activity'},
// ];

  public text1 = 'Create Statement';
  billPaymentService: any;
  invoiceService: any;
  toggleDisplay() {
    this.isShow = !this.isShow;
  }
  exit() {
   // window.location.reload();
   this.ngOnInit();
  }
  public changeText(): void {
    if (this.text1 === 'Create Statement') {
      this.text1 = 'refresh';
    } else {
      this.text1 = 'Create Statement';
    }
  }
  constructor(private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private customerService: CustomerService,
    private appUtils: AppUtils,
    private appSettings: AppSettings,
    private billService: BillService,
    private bankAccountService: BankAccountService,
    private vendorService: VendorService,
    private creditCardService: CreditCardService
    ) { }

  ngOnInit() {
    this.loadCustomers();
  }
  loadCustomers() {
    this.blockUI.start();
    this.customerService.getSelectItems()
        .subscribe((data) => {
            this.blockUI.stop();
            this.customers=[];
            Object.assign(this.customers, data);
        },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
}
showcustomerStatement() {
  if (this.selectedCustomer !== undefined) {

  }
}

changeInvoiceDate(){
  
  console.log("quotatindate",this.invDate);
  const jsDate = new Date(this.invDate.year, this.invDate.month - 1, this.invDate.day + 1);
  this.model.invoiceDate=jsDate.toISOString();
 }

 changeDuedate(){
  
  console.log("quotatindate",this.dueDate);
  const jsDate = new Date(this.dueDate.year, this.dueDate.month - 1, this.dueDate.day + 1);
  this.model.dueDate=jsDate.toISOString();
 }
  getCustomerDetail() {
   
  
    if (this.selectedCustomer !== undefined) {
        this.model.customerId = this.selectedCustomer.keyInt;
    // if (this.model.customerId === null
    //     || this.model.customerId === '') {
    //     this.model.phone = '';
    //     this.model.email = '';
    //     // this.model.quotationNumber = '';
    //     this.model.discount = 0;
    //     return;
    // }
    this.customerService.getDetail(Number(this.model.customerId))
        .subscribe(
            (data) => {
                Object.assign(this.customer, data);
                 

               // this.updateTotalAmount();
            });
        }
}
// loadInvoice() {
//   this.blockUI.start();
//   this.invoiceService.getForEdit(this.model.id).subscribe(
//       (data: any) => {
//           this.blockUI.stop();
//           Object.assign(this.model, data);

//           const qdt = new Date(this.model.invoiceDate)
//           this.invDate = { day: qdt.getDate(), month: qdt.getMonth()+1, year: qdt.getFullYear()};

//           const expdt = new Date(this.model.dueDate);
//           this.dueDate={ day: expdt.getDate(), month: expdt.getMonth()+1, year: expdt.getFullYear()};
          

//           if (!this.model.attachments || this.model.attachments.length === 0) {
//               const attachmentFile = new AttachmentEditModel();
//               this.model.attachments.push(attachmentFile);
//           }

//           this.getCustomerDetail();
//           this.updateSelectedItems();
//           this.updateTotalAmount();
//       },
//       error => {
//           this.blockUI.stop();
//           this.appUtils.ProcessErrorResponse(this.toastr, error);
//       });
// }
  updateSelectedItems() {
    throw new Error("Method not implemented.");
  }
// submit() {
//   this.blockUI.start();
//   if (this.model.paymentDate) {
//       this.model.paymentDate = this.appUtils.getFormattedDate(this.model.paymentDate, null);
//   }
//   this.billPaymentService.add(this.model)
//       .subscribe(
//           data => {
//               this.blockUI.stop();
//               setTimeout(() => {
//                   this.router.navigate(['/bill/payments']);
//               }, 100);
//               setTimeout(() => {
//                   this.toastr.success('Payment has been done successfully');
//               }, 500);
//           },
//           error => {
//               this.blockUI.stop();
//               this.appUtils.ProcessErrorResponse(this.toastr, error);
//           });
// }
}
