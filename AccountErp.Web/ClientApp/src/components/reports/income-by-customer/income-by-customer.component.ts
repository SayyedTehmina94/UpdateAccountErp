
import { CustomerDetailModel } from './../../../models/customer/customer.detail.model';
import { IncomeCustomerDetail } from './../../../models/incomeByCustomers/income.customer.model';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NgForm } from '@angular/forms';
import { AppSettings, AppUtils } from 'src/helpers';
import { VendorDetailModel, VendorPersonalInfoModel, SelectListItemModel, BillFilterModel, InvoiceFilterModel } from 'src/models';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { VendorService, CustomerService } from 'src/services';
import { ToastrService } from 'ngx-toastr';
import { IncomeCustomersService } from 'src/services/income-customers.service';

@Component({
  selector: 'app-income-by-customer',
  templateUrl: './income-by-customer.component.html',
  styleUrls: ['./income-by-customer.component.css']
})
export class IncomeByCustomerComponent implements OnInit {
  @ViewChild ('terms', {static: false}) terms: ElementRef ;
  @ViewChild('htmlData', {static: false}) htmlData: ElementRef;
  @BlockUI('container-blockui') blockUI: NgBlockUI;

  vendor: VendorPersonalInfoModel = new VendorPersonalInfoModel();
    vendors: Array<SelectListItemModel> = new Array<SelectListItemModel>();
    filterModel: InvoiceFilterModel = new InvoiceFilterModel();
  selectedCustomer;
  startDate;
  endDate;
  fromDate;
  toDate;
  allIncome;
  paidIncome;
  customers:any;
  config = {displayKey:"value",search:true,limitTo:10,height: 'auto',placeholder:'Select Customer',customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!',searchPlaceholder:'Search',searchOnKey: 'value',clearOnSelection: false,inputDirection: 'ltr',}

  // "totalPurchaseAmount": 9.65,
  // "totalPaidAmount": 3.92,
  // incomeCustomertData={totalIncomeAmount:0,paidAmount:0,customerReportsDtosList:[{}]};
  incomeCustomertData={totalIncome:0,totaPaidIncome:0,customerReportsDtosList:[{}]};
  today = new Date();
  totalIncome;
  temp;
  model: IncomeCustomerDetail = new IncomeCustomerDetail();
  incomecustomer: CustomerDetailModel = new CustomerDetailModel();
  constructor(
    private appSettings: AppSettings,
    private incomeCustomersService: IncomeCustomersService,
    private toastr: ToastrService,
        private appUtils: AppUtils,
    private customerService: CustomerService,
  ) { }

  ngOnInit() {
    this.loadCustomers();
    this.setDefaultDate();
    this.showincomebyCustomer();
  }

  // showincomebyCustomer(){

  // }
  showincomebyCustomer() {
   // this.purchaseVendortData = {vendorReportsList={}};
   console.log("from",this.fromDate);
   console.log("from",this.toDate);
 var body
    
    if (this.selectedCustomer !== undefined) {

     body={ 
      "customerId": this.selectedCustomer.keyInt,
    "startDate":  this.fromDate,
    "endDate": this.toDate,
  };
}else{
   body={ 
    "customerId": 0,
  "startDate":  this.fromDate,
  "endDate": this.toDate,
};
}
    this.incomeCustomersService.getIncomeCustomer(body)
    .subscribe(
        (data) => {
          
          console.log("statement",data);
         // Object.assign(this.temp, data);
             Object.assign(this.incomeCustomertData, data);
            //  this.allIncome=this.incomeCustomertData.totalIncomeAmount;
            this.allIncome=this.incomeCustomertData.totalIncome;

            //  this.paidIncome=this.incomeCustomertData.paidAmount;
            this.paidIncome=this.incomeCustomertData.totaPaidIncome;

             this.temp.customerReportsDtosList.map((item) => {
              
               item.paidAmount=item.totalIncomeAmount;
           });
          this.CalculateTotalIncome();
        });
  }

  CalculateTotalIncome(){

  }


   getAllPurchases(){
    return this.totalIncome;
  }
  getPaidPurchases(item){
    return item.incomeAmount.toFixed(2);
  }
  CalculateTotalPurchase(){

  }
  public openPDF(): void {
    const doc = new jsPDF('p', 'pt', 'a4');
    // let doc = new jsPDF("portrait","px","a4");

    doc.setFontSize(15);
    doc.text('Income By Customer ', 50, 50);
   // doc.autoPrint();

    var startDate = new Date(new Date().getFullYear(), 0, 1);
    this.startDate={ day: startDate.getDate(), month: startDate.getMonth()+1, year: startDate.getFullYear()};
    const jsbillDate = new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day);
    this.fromDate=jsbillDate.toDateString();
  
    var endDate = new Date();
    this.endDate={ day: endDate.getDate(), month: endDate.getMonth()+1, year: endDate.getFullYear()};
    const jsduevDate = new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day);
    this.toDate=jsduevDate.toDateString();
    doc.text(50, 100, 'Date Range : ' + '' + this.fromDate + ' ' + 'to' + ' ' + this.toDate);

    doc.setProperties({
      title: 'Income By Customer' + ' ' + this.toDate,
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
      startY: 150, /* if start position is fixed from top */
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
    doc.text(480, 780, 'Income By Customer');
    doc.text(40, 800, 'Date Range : ' + '' + this.fromDate + ' ' + 'to' + ' ' + this.toDate);
    doc.text(450, 800, 'Created on : ' + '' + this.toDate);
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
      // let doc = new jsPDF("portrait","px","a4");
  
      doc.setFontSize(15);
      doc.text('Income By Customer ', 50, 50);
      doc.autoPrint();
  
      var startDate = new Date(new Date().getFullYear(), 0, 1);
      this.startDate={ day: startDate.getDate(), month: startDate.getMonth()+1, year: startDate.getFullYear()};
      const jsbillDate = new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day);
      this.fromDate=jsbillDate.toDateString();
    
      var endDate = new Date();
      this.endDate={ day: endDate.getDate(), month: endDate.getMonth()+1, year: endDate.getFullYear()};
      const jsduevDate = new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day);
      this.toDate=jsduevDate.toDateString();
      doc.text(50, 100, 'Date Range : ' + '' + this.fromDate + ' ' + 'to' + ' ' + this.toDate);
  
      doc.setProperties({
        title: 'Income By Customer' + ' ' + this.toDate,
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
        startY: 150, /* if start position is fixed from top */
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
      doc.text(480, 780, 'Income By Customer');
      doc.text(40, 800, 'Date Range : ' + '' + this.fromDate + ' ' + 'to' + ' ' + this.toDate);
      doc.text(450, 800, 'Created on : ' + '' + this.toDate);
      doc.text( ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' +
      'Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width / 200, 780, {
        align: 'right'
      });
    }
  };
  
  addFooters(doc);
      doc.fromHTML(DATA.innerHTML, 30, 15);
        doc.save('Income-by-customer.pdf');
      }


      onSubmit(form: NgForm) {
        // console.log(this.terms);
        //  console.log(this.terms.nativeElement.checked);
    }

  changeStartDate(){
    
    console.log('quotatindate', this.startDate);
    const jsDate = new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day + 1);
    this.fromDate = jsDate.toISOString();
   }

   changeEnddate(){
    
    console.log('quotatindate', this.endDate);
    const jsDate = new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day + 1);
    this.toDate = jsDate.toISOString();
   }

   getCustomerDetail() {
    // 
   // alert(this.selectedCustomer.keyInt);
     if (this.selectedCustomer !== undefined) {
         this.model.customerId = this.selectedCustomer.keyInt;
     if (this.model.customerId === null
         || this.model.customerId === '') {
        //  this.model.phone = '';
        //  this.model.email = '';
         // this.model.quotationNumber = '';
         // this.model.discount = 0;
         return;
     }
     this.customerService.getDetail(Number(this.model.customerId))
         .subscribe(
             (data) => {
                //  Object.assign(this.customer, data);
                //  this.model.phone = this.customer.phone;
                //  this.model.email = this.customer.email;
 
                //  if (!this.customer.discount) {
                //      this.customer.discount = 0;
                //  }
 
                // this.updateTotalAmount();
             });
         }
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

setDefaultDate(){
  
        
  var startDate = new Date(new Date().getFullYear(), 0, 1);
  this.startDate={ day: startDate.getDate(), month: startDate.getMonth()+1, year: startDate.getFullYear()};
  const jsbillDate = new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day + 1);
  this.fromDate=jsbillDate.toISOString();

  var endDate = new Date();
  this.endDate={ day: endDate.getDate(), month: endDate.getMonth()+1, year: endDate.getFullYear()};
  const jsduevDate = new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day + 1);
  this.toDate=jsduevDate.toISOString();
}

}
