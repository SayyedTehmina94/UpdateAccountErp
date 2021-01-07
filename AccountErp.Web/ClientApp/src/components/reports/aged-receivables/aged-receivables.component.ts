import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AgedReceivablesService } from 'src/services/aged.receivables.service';
import { AppSettings, AppUtils } from 'src/helpers';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/services';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { InvoiceFilterModel, CustomerDetailModel } from 'src/models';
import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AgedReceivablesDetail } from 'src/models/agedReceivables/aged.receivables.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-aged-receivables',
  templateUrl: './aged-receivables.component.html',
  styleUrls: ['./aged-receivables.component.css']
})
export class AgedReceivablesComponent implements OnInit {
  @ViewChild ('terms', {static: false}) terms: ElementRef ;
  @ViewChild('htmlData', {static: false}) htmlData: ElementRef;
  @BlockUI('container-blockui') blockUI: NgBlockUI;
    filterModel: InvoiceFilterModel = new InvoiceFilterModel();
  selectedCustomer;
  startDate;
  endDate;
  fromDate;
  toDate;
  asOfDate;
  allIncome;
  paidIncome;
  customers:any;
  config = {displayKey:"value",search:true,limitTo:10,height: 'auto',placeholder:'Select Customer',customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!',searchPlaceholder:'Search',searchOnKey: 'value',clearOnSelection: false,inputDirection: 'ltr',}

  // "totalPurchaseAmount": 9.65,
  // "totalPaidAmount": 3.92,
  paidPurchase;
  agedReceivablesData={totalAmount:0,totalUnpaidAmount:0,totalNotYetOverDue:0,totalCountNotYetOverDue:0,
    totalLessThan30:0,totalCountLessThan30 :0,totalCountThirtyFirstToSixty:0,
    totalThirtyFirstToSixty:0,totalSixtyOneToNinety:0,totalCountSixtyOneToNinety:0,
    totalMoreThanNinety:0,totalCountMoreThanNinety:0,agedReceivablesReportDtoList:[{}]};

  
    allNotYetOverdue;
    allCountNotOverdue;
    allCountLessThan30;
    allCount31To60;
    allCount61To90;
    allCount91OrMore;
  all30OrLess;
  all31To60;
  all61To90;
  all91OrMore;
  allTotalUnpaid;
  allTotalAmount;
  today = new Date();
  totalIncome;
  temp;
  model: AgedReceivablesDetail = new AgedReceivablesDetail();
  incomecustomer: CustomerDetailModel = new CustomerDetailModel();

  constructor( private appSettings: AppSettings,
    private agedReceivablesService: AgedReceivablesService,
    private toastr: ToastrService,
        private appUtils: AppUtils,
    private customerService: CustomerService,) { }

  ngOnInit() {
    this.loadCustomers();
    this.setDefaultDate();
    this.showAgedReceivablesReport();
  }

  showAgedReceivablesReport() {
    // this.purchaseVendortData = {vendorReportsList={}};
    console.log("asOf",this.asOfDate);
    console.log("from",this.toDate);
 
     
     var body
     if (this.selectedCustomer !== undefined) {
 
     body={ 
          //  "customerId": this.selectedCustomer.keyInt,
          "customerId":this.selectedCustomer.keyInt,
        "asOfDate": this.model.agedReceivablesOfDate,
        "reportType": 0
      };
  }else{
    body={ 
      "customerId":0,
      "asOfDate": this.model.agedReceivablesOfDate,
      "reportType": 0
   };
  }
     this.agedReceivablesService.getAgedReceivables(body)
     .subscribe(
      (data) => {
        
        console.log("statement",data);
       // Object.assign(this.temp, data);
           Object.assign(this.agedReceivablesData, data);
          this.paidPurchase=this.agedReceivablesData.totalUnpaidAmount;

              this.allNotYetOverdue=this.agedReceivablesData.totalNotYetOverDue;
              this.allCountNotOverdue=this.agedReceivablesData.totalCountNotYetOverDue;
              this.all30OrLess=this.agedReceivablesData.totalLessThan30;
              this.allCountLessThan30=this.agedReceivablesData.totalCountLessThan30;
              this.all31To60=this.agedReceivablesData.totalThirtyFirstToSixty;
              this.allCount31To60=this.agedReceivablesData.totalCountThirtyFirstToSixty;
              this.all61To90=this.agedReceivablesData.totalSixtyOneToNinety;
              this.allCount61To90=this.agedReceivablesData.totalCountSixtyOneToNinety;
              this.all91OrMore=this.agedReceivablesData.totalMoreThanNinety;
              this.allCount91OrMore=this.agedReceivablesData.totalCountMoreThanNinety;
              this.allTotalUnpaid=this.agedReceivablesData.totalUnpaidAmount;
              this.allTotalAmount=this.agedReceivablesData.totalAmount;
           this.temp.agedReceivablesReportDtoList.map((item) => {
            
             item.totalUnpaidAmount=item.totalAmount;
             
         });
       //  this.CalculateTotalPurchase();
      });
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
    doc.text('Aged Receivables ', 50, 50);
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
      title: 'Aged Receivables' + ' ' + this.toDate,
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
    doc.text(480, 780, 'Aged Receivables');
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
  doc.text('Aged Receivables ', 50, 50);
 

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
    title: 'Aged Receivables' + ' ' + this.toDate,
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
  doc.text(480, 780, 'Aged Receivables');
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
  doc.autoPrint();
    doc.save('Aged-Receivables.pdf');
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

changeAsOfdate(){
  
  console.log('quotatindate', this.asOfDate);
  const jsDate = new Date(this.asOfDate.year, this.asOfDate.month - 1, this.asOfDate.day + 1);
  // this.asOfDate = jsDate.toISOString();
  this.model.agedReceivablesOfDate=jsDate.toISOString();

 }

 setDefaultDate(){
        
  var qdt=new Date()
  this.asOfDate={ day: qdt.getDate(), month: qdt.getMonth()+1, year: qdt.getFullYear()};
  const jsbillDate = new Date(this.asOfDate.year, this.asOfDate.month - 1, this.asOfDate.day + 1);
  this.model.agedReceivablesOfDate=jsbillDate.toISOString();

  // this.dueDate={ day: qdt.getDate()+1, month: qdt.getMonth()+1, year: qdt.getFullYear()};
  // const jsduevDate = new Date(this.dueDate.year, this.dueDate.month - 1, this.dueDate.day);
  // this.model.dueDate=jsduevDate.toISOString();
}
}
