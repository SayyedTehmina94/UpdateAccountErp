import { BillService } from './../../services/bill.service';
import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerService, BankAccountService, VendorService, BillPaymentService, CreditCardService } from 'src/services';
import { AppUtils, AppSettings } from 'src/helpers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DataTableDirective } from 'angular-datatables';
import { quotationAddModel } from 'src/models/quotation/quotation.add.model';
import { CustomerDetailModel, SelectListItemModel, InvoiceFilterModel, AttachmentEditModel, InvoiceEditModel
       , InvoiceDetailModel, 
       ItemListItemModel} from 'src/models';
import { CustomerStatementDetail } from 'src/models/customerStatement/customer.statement.detail.model';
import { CustomerStatementService } from 'src/services/customer-statement.service';
import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-customer-statement',
  templateUrl: './customer-statement.component.html',
  styleUrls: ['./customer-statement.component.css']
})
export class CustomerStatementComponent implements OnInit {
  [x: string]: any;
  @BlockUI('container-blockui-main') blockUI: NgBlockUI;
  @ViewChild(DataTableDirective, { static: false })
  @Input() selectedItems: Array<ItemListItemModel> = new Array<ItemListItemModel>();
  @ViewChild('htmlData', {static: false}) htmlData: ElementRef;
  @ViewChild ('terms', {static: false}) terms: ElementRef ;
  datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtInstance: DataTables.Api;
  rowIndex = 0;
  pageLength = 10;
  search: any = null;
  selectedCustomer;
  selectedStatement;
  firstName;
  fromDateForFrontEnd;
  toDateForFrontEnd;
  // model: quotationAddModel = new quotationAddModel();
  // model: InvoiceEditModel = new InvoiceEditModel();
   model1: InvoiceDetailModel = new InvoiceDetailModel();
   model: CustomerStatementDetail = new CustomerStatementDetail();
  customer: CustomerDetailModel = new CustomerDetailModel();
  config = {displayKey: 'value', search: true, height: 'auto', placeholder:'Select Customer',
  customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!', searchPlaceholder:'Search',
  searchOnKey: 'value',clearOnSelection: false,inputDirection: 'ltr', }
  filterModel: InvoiceFilterModel = new InvoiceFilterModel();
  customers: any;
  isShow = false;
  optionValue;
  // selectedstType = 'outstanding';
  selectedstType ;
  startDate;
  endDate;
  fromDate;
  toDate;
  statementData;
  today = new Date();
  overDueAmount = 0;
  totalDueAmount = 0;
  OutstandingAmont = 0;
  outStandingBalance = 0;
  totalAcc: number;
  modalReference: any;
  showMyContainer : boolean =  true;
  loggedOut;
  totalAccBalance;
  tempBalance=0;
  temp;
  statementTypes: any = ['Outstanding Invoices', 'Account Activity'];
//   statementTypes: any = [
//     {id: 1, name:'Outstanding Invoiceserman'},
//     {id: 2, name:'Account Activity'},
// ];
typeList  = [{value:'Outstanding Invoices',keyInt:'outstanding'},
             {value:'Account Activity',keyInt:'accActivity'}]

config1 = {displayKey:"value",search:true,limitTo:10,height: 'auto',placeholder:'Select Type',
            customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!',searchPlaceholder:'Search',
            searchOnKey: 'value',clearOnSelection: false,inputDirection: 'ltr',}

  public text1 = 'Create Statement';
  billPaymentService: any;
  invoiceService: any;
  isShowButton :boolean;
  // toggleDisplay() {
  //   this.isShow = !this.isShow;
  //  // this.isShowButton = !this.isShowButton;
  // }
  openPop() {
    // this.showMyContainer = !this.showMyContainer;
    this.showMyContainer = true;

  }
  exit() {
   window.location.reload();
  //  this.ngOnInit();
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
    private customerStatementService: CustomerStatementService,
    private creditCardService: CreditCardService,
    private modalService: NgbModal,
    ) { }

  ngOnInit() {
    this.loadCustomers();
    this.selectedstType={value:'Outstanding Invoices',keyInt:'outstanding'};
    this.model.statementType=this.selectedstType.keyInt;
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
getStatementType(){
  // this.model.statementType=this.selectedstType.keyInt;
}
  showcustomerStatement(event :any,submitBtn: HTMLButtonElement) {
    debugger
   // event.preventDefault();
 //  event.stopPropagation();

   if(this.selectedstType == undefined){
    this.toastr.error('Please select Customer Statement Type to continue');
    return;
  }
    
//submitBtn.disabled = true;
    if (this.selectedCustomer !== undefined) {
   
      this.isShow = true;
      this.statementData = {};
      this.temp = {};
      var body = {};
      this.totalAccBalance = 0;
      this.tempBalance =0;
      this.totalAccBalance = 0;
      this.overDueAmount = 0;
      this.totalDueAmount = 0;
      this.outStandingBalance = 0;
      if (this.selectedCustomer !== undefined) {
          if (this.selectedstType.keyInt == 'outstanding') {
            body = {
              "id": 0,
              "customerId": this.selectedCustomer.keyInt,
              "status": 0,
            }
          }
          else if(this.selectedstType.keyInt == 'accActivity'){
            body = {
              "id": 0,
              "customerId": this.selectedCustomer.keyInt,
              "startDate": this.fromDate,
              "endDate": this.toDate,
              "status": 1,
            }
            
          }
      
        this.getCustomerDetail();
        this.customerStatementService.getCustomerStatement(body)
          .subscribe(
            (data) => {
              console.log("statement", data)

              Object.assign(this.temp, data);
             
             
              //Object.assign(this.statementData, data);
              this.temp.invoiceList.map((item) => {
                item.paidAmount = item.totalAmount;
                if (item.status == 1) {
                  item.balanceAccAmount = 0.00
                } else {
                  this.totalAccBalance = 0;
                  this.tempBalance += Number(item.totalAmount);
                  var balAmnt = Number(this.temp.openingBalance) + this.tempBalance;
                  this.totalAccBalance = balAmnt.toFixed(2);
                  item.balanceAccAmount = balAmnt.toFixed(2);

                }
              });

              this.statementData = this.temp;
              this.CalculateAmount();
              
              // this.model.phone = this.customer.phone;
              // this.model.email = this.customer.email;

              // if (!this.customer.discount) {
              //     this.customer.discount = 0;
              // }

              // this.updateTotalAmount();
            });
      }

    }
    else {
      this.isShowButton = true;
    }
   //submitBtn.disabled = false;
  }
openItemesModal(content: any) {
  this.modalReference = this.modalService.open(content,
      {
          backdrop: 'static',
          keyboard: false,
          size: 'lg'
      });
}

getPaidAmount(item){
 
  if(item.status==1){
    return item.totalAmount.toFixed(2);
  }else{
    return 0.00;
   
  }
}

getBalanceAmount(item){
  if(item.status==1){
    return 0.00;
  }else{
    return Number(item.totalAmount).toFixed(2);
   
  }
}

getBalanceAccAmount(item){
  if(item.status==1){
    return 0.00;
  }else{
    this.totalAccBalance=0;
    this.tempBalance+=Number(item.totalAmount);
    var balAmnt=Number(this.statementData.openingBalance)+this.tempBalance;
    this.totalAccBalance=balAmnt.toFixed(2);
    return balAmnt.toFixed(2);
   
  }
}

getClosingBalanceAmount(){
  return this.totalAccBalance;
}

closeItemesModal() {
  this.updateTotalAmount();
  this.modalReference.close();
}
  //  public openPDF(): void {
  //       const doc = new jsPDF('p', 'pt', 'a4');
  //       doc.setFontSize(15);
  //       doc.text('Statement of Account', 400, 40);
  //       // doc.text('Outstanding Invoices', 400, 70);
  //       autoTable(doc, {
  //          html: '#my-table',
  //          styles: {
  //           // cellPadding: 0.5,
  //          // fontSize: 12,
  //       },
  //       tableLineWidth: 0.5,
  //       startY: 400, /* if start position is fixed from top */
  //       tableLineColor: [4, 6, 7], // choose RGB
  //         });
  //         const DATA = this.htmlData.nativeElement;
  //       doc.fromHTML(DATA.innerHTML, 30, 15);
  //       doc.output('dataurlnewwindow');
  //     }


    // public downloadPDF(): void {
    //     const doc = new jsPDF('p', 'pt', 'a4');
    //     doc.setFontSize(15);
    //     doc.text('Statement of Account', 400, 40);
    //     doc.text('Outstanding Invoices', 400, 70);
    //    // autoTable(doc, { html: '#my-table' });
    //    autoTable(doc, {
    //     html: '#my-table',
    //     styles: {
    //  },
    //  tableLineWidth: 0.5,
    //  startY: 550,
    //  tableLineColor: [4, 6, 7], // choose RGB
    //    });
    //     autoTable(doc, {
    //       html: '#my-table1',
    //       styles: {
    //    },
    //    tableLineWidth: 0.5,
    //    startY: 300,
    //    tableLineColor: [4, 6, 7], // choose RGB
    //      });
    //     // const handleElement = {
    //     //   '#editor': function(element, renderer) {
    //     //     return true;
    //     //   }
    //     // };
    //     // doc.fromHTML(DATA.innerHTML, 15, 15, {
    //     //   'width': 200,
    //     //   'elementHandlers': handleElement
    //     // });
    //     const DATA = this.htmlData.nativeElement;
    //     doc.save('Customer-statement.pdf');
    //   }
    public openPDF(): void {
      const doc = new jsPDF('p', 'pt', 'a4');
      // let doc = new jsPDF("portrait","px","a4");
  
      doc.setFontSize(15);
      // doc.text('Statement of Account', 50, 50);
     // doc.autoPrint();
  
      doc.setProperties({
        title: 'Statement of Account' + ' ' + this.toDate,
        subject: 'Info about PDF',
        author: 'iCLose',
        keywords: 'generated, javascript, web 2.0, ajax',
        creator: 'iClose'
    });
        autoTable(doc, {
          html: '#my-table',
          styles: {
          // cellPadding: 0.5,
          // fontSize: 12,
      },
      tableLineWidth: 0.5,
      startY: 350, /* if start position is fixed from top */
      tableLineColor: [4, 6, 7], // choose RGB
        });
        autoTable(doc, {
          html: '#my-table1',
          styles: {
        },
        tableLineWidth: 0.5,
        startY:600,
        tableLineColor: [4, 6, 7], // choose RGB
          });
        const DATA = this.htmlData.nativeElement;
  
  
  // For each page, print the page number and the total pages
  const addFooters = doc => {
    const pageCount = doc.internal.getNumberOfPages();
  
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(510, 780, 'Statement of Account');
      doc.text( ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' +
      'Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width / 200, 780, {
        align: 'right'
      });
    }
  };
  
      addFooters(doc);
       doc.fromHTML(DATA.innerHTML, 30, 15);
        window.open(doc.output('bloburl'), '_blank');
        // doc.output('dataurlnewwindow');
    }
    public downloadPDF(): void {
      const doc = new jsPDF('p', 'pt', 'a4');
  
      doc.setFontSize(15);
  
      doc.setProperties({
        title: 'Statement of Account' + ' ' ,
        subject: 'Info about PDF',
        author: 'iClose',
        keywords: 'generated, javascript, web 2.0, ajax',
        creator: 'iClose'
    });
      autoTable(doc, {
         html: '#my-table',
         styles: {
          // cellPadding: 0.5,
         // fontSize: 12,
      },
      tableLineWidth: 0.5,
      startY: 350, /* if start position is fixed from top */
      tableLineColor: [4, 6, 7], // choose RGB
        });
        autoTable(doc, {
          html: '#my-table1',
          styles: {
       },
       tableLineWidth: 0.5,
       startY:600,
       tableLineColor: [4, 6, 7], // choose RGB
         });
  
        const DATA = this.htmlData.nativeElement;
        const addFooters = doc => {
          const pageCount = doc.internal.getNumberOfPages();
        
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(8);
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(510, 780, 'Statement of Account');
            doc.text( ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' +
            'Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width / 200, 780, {
              align: 'right'
            });
          }
        };
        
        addFooters(doc);
        
      doc.fromHTML(DATA.innerHTML, 30, 15);
      // doc.output('dataurlnewwindowsales');
      window.open(doc.output('bloburl'), '_blank');
    }
      onSubmit(form: NgForm) {
        // console.log(this.terms);
        //  console.log(this.terms.nativeElement.checked);

    }

changeStartDate(){

  console.log('quotatindate', this.startDate);
  const jsDate = new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day + 1);
  this.fromDateForFrontEnd = (new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day)).toISOString();
  this.fromDate = jsDate.toISOString();
 }

 changeEnddate(){
  console.log('quotatindate', this.endDate);
  const jsDate = new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day + 1);
  this.toDateForFrontEnd=(new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day)).toISOString();
  this.toDate = jsDate.toISOString();
 }

  changeCustomer(){
    if (this.selectedCustomer !== undefined) {
      this.model.customerId=this.selectedCustomer.keyInt;
      this.isShowButton=false;
    }else{
      this.isShowButton=true;
    }

  }
  changeType(){
    if (this.selectedstType !== undefined) {
      this.model.statementType=this.selectedstType.keyInt;
    //  this.isTypeValid=true;
    }else{
    //  this.isTypeValid=false;
    }
  }

  getCustomerDetail() {
    
   
  // alert(this.selectedCustomer.keyInt);
  this.isShowButton = false;
    if (this.selectedCustomer !== undefined) {
        this.model.customerId = this.selectedCustomer.keyInt;
    if (this.model.customerId === null
        || this.model.customerId === '') {
        this.model.phone = '';
        this.model.email = '';
        // this.model.quotationNumber = '';
        this.model.discount = 0;
        return;
    }
    this.customerService.getDetail(Number(this.model.customerId))
        .subscribe(
            (data) => {
                Object.assign(this.customer, data);
                this.model.phone = this.customer.phone;
                this.model.email = this.customer.email;

                if (!this.customer.discount) {
                    this.customer.discount = 0;
                }

               // this.updateTotalAmount();
            });
        }
}

CalculateAmount() {
  
this.totalDueAmount = 0;
this.overDueAmount = 0;
this.outStandingBalance = 0;
  this.statementData.invoiceList.map((item) => {
   if (item.status === 3) {
     this.overDueAmount += item.totalAmount;
     this.outStandingBalance += item.totalAmount;
   }
   if (item.status === 0) {
     this.totalDueAmount += item.totalAmount;
     this.outStandingBalance += item.totalAmount;
   }
});
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
