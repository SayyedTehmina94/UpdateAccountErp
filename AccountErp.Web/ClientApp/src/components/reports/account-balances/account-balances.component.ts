import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppUtils, AppSettings } from 'src/helpers';
import { AccountBalanceService } from 'src/services/account.balance.service';
import { AccountBalanceDetail } from 'src/models/accountBalance/accountBalance.model';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-account-balances',
  templateUrl: './account-balances.component.html',
  styleUrls: ['./account-balances.component.css']
})
export class AccountBalancesComponent implements OnInit {

  @ViewChild ('terms', {static: false}) terms: ElementRef ;
  @ViewChild('htmlData', {static: false}) htmlData: ElementRef;
  @BlockUI('container-blockui') blockUI: NgBlockUI;

  accountBalanceData={totalDebitAmount:0,totalCreditAmount:0,accountBalanceReportDtoList:[{}]};
  model: AccountBalanceDetail = new AccountBalanceDetail();
  selectedstType = 'accural';
  startDate;
  endDate;
  fromDate;
  toDate;
  asOfDate;
  today = new Date();
  allStartingBalance;
  allCreditBalance;
  allDebitBalance;
  allNetMovementBalance;
  allEndingBalance;

  allTotalDebitAmount;
  allTotalCreditAmount;
   allDebitExpense;
   allCreditExpense;
   allNetMovementExpense;

   allDebitExpTotal;
   allCreditExpTotal;
   statement;
  temp;

  constructor(private appSettings: AppSettings,
    private accountBalanceService: AccountBalanceService,
    private toastr: ToastrService,
        private appUtils: AppUtils) { }

  ngOnInit() {
    
   this.setDefaultDate();
  this.showAccountBalance();
  }

  showAccountBalance() {
    this.blockUI.start();
    // this.purchaseVendortData = {vendorReportsList={}};
    console.log("from",this.fromDate);
    console.log("from",this.endDate);
    // if (this.selectedVendor !== undefined) {
     
     var body={ 
      "startDate": this.fromDate,
      "endDate": this.toDate};
      // "startDate": "2020-01-01T16:39:31.081Z",
      //  "endDate": "2020-08-09T16:39:31.081Z"};

     this.accountBalanceService.getAccountBalance(body)
     .subscribe(
         (data) => {
           
           this.statement=[];
           this.blockUI.stop();
           Object.assign(this.statement,data);
           console.log("accbal",this.statement);
           this.allTotalDebitAmount = this.accountBalanceData.totalDebitAmount;
           this.allTotalCreditAmount = this.accountBalanceData.totalCreditAmount;
           this.temp.accountBalanceReportDtoList.map((item) => {
            
             item.totalUnpaidAmount=item.totalAmount;
         });

         });
      //  }
   }


   public openPDF(): void {
    const doc = new jsPDF('p', 'pt', 'a4');
    // let doc = new jsPDF("portrait","px","a4");

    doc.setFontSize(15);
    doc.text('Account Balances', 50, 50);
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
      title: 'Account Balances' + ' ' + this.toDate,
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
     // const DATA = this.htmlData.nativeElement;


// For each page, print the page number and the total pages
const addFooters = doc => {
  const pageCount = doc.internal.getNumberOfPages();

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(485, 780, 'Account Balances');
    doc.text(40, 800, 'Date Range : ' + '' + this.fromDate + ' ' + 'to' + ' ' + this.toDate);
    doc.text(450, 800, 'Created on : ' + '' + this.toDate);
    doc.text( ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' +
    'Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width / 200, 780, {
      align: 'right'
    });
  }
};

addFooters(doc);
   // doc.fromHTML(DATA.innerHTML, 30, 15);
    window.open(doc.output('bloburl'), '_blank');
    // doc.output('dataurlnewwindow');
  }


public downloadPDF(): void {
  const doc = new jsPDF('p', 'pt', 'a4');
  // let doc = new jsPDF("portrait","px","a4");

  doc.setFontSize(15);
  doc.text('Account Balances', 50, 50);
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
    title: 'Account Balances' + ' ' + this.toDate,
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
    // const DATA = this.htmlData.nativeElement;


// For each page, print the page number and the total pages
const addFooters = doc => {
const pageCount = doc.internal.getNumberOfPages();

doc.setFont('helvetica', 'italic');
doc.setFontSize(8);
for (let i = 1; i <= pageCount; i++) {
  doc.setPage(i);
  doc.text(485, 780, 'Account Balances');
  doc.text(40, 800, 'Date Range : ' + '' + this.fromDate + ' ' + 'to' + ' ' + this.toDate);
  doc.text(450, 800, 'Created on : ' + '' + this.toDate);
  doc.text( ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' +
  'Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width / 200, 780, {
    align: 'right'
  });
}
};

addFooters(doc);
  // doc.fromHTML(DATA.innerHTML, 30, 15);
  doc.autoPrint();
    doc.save('Account-Balance.pdf');
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
