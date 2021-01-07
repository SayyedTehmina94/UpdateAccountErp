import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppUtils, AppSettings } from 'src/helpers';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NgForm } from '@angular/forms';
import { TrialBalanceService } from 'src/services/trial.balance.service';
import { TrialBalanceDetail } from 'src/models/trialBalance/trial.balance.model';

@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.css']
})
export class TrialBalanceComponent implements OnInit {

  @ViewChild ('terms', {static: false}) terms: ElementRef ;
  @ViewChild('htmlData', {static: false}) htmlData: ElementRef;
  @BlockUI('container-blockui') blockUI: NgBlockUI;

  trialBalanceData={totalAmount:0,totalUnpaidAmount:0,totalNotYetOverDue:0,totalCountNotYetOverDue:0,
    totalLessThan30:0,totalCountLessThan30 :0,totalCountThirtyFirstToSixty:0,
    totalThirtyFirstToSixty:0,totalSixtyOneToNinety:0,totalCountSixtyOneToNinety:0,
    totalMoreThanNinety:0,totalCountMoreThanNinety:0,agedPayablesReportDtoList:[{}]};
  model: TrialBalanceDetail = new TrialBalanceDetail();
  selectedstType = 0;
  startDate;
  endDate;
  fromDate;
  toDate;
  asOfDate;
  statement;
  today = new Date();
  allStartingBalance;
  allCreditBalance;
  allDebitBalance;
  allNetMovementBalance;
  allEndingBalance;

  allStartingBalanceLiabilites;
  allDebitLiabilites;
  allCreditLiabilites;
  allNetMovementLiabilites;
  allEndingLiabilites;

  allStartingBalanceEquity;
  allDebitEquity;
  allCreditEquity;
  allNetMovementEquity;
  allEndingEquity;

  allDebitIncome;
  allCreditIncome;
  allNetMovementIncome;

   allDebitExpense;
   allCreditExpense;
   allNetMovementExpense;
   allDebitExpTotal;
   allCreditExpTotal;

  temp;

  assetAccDetails;
  liabilitiesAccDetails;
  reportTypeList  = [{value:'Accural (Paid & Unpaid)',keyInt:'0'},
                    {value:'Cash Basis (Paid)',keyInt:'1'}]
  config = {displayKey:"value",search:true,height: 'auto',placeholder:'Select Item',customComparator: ()=>{},moreText: 'more',
  noResultsFound: 'No results found!',searchPlaceholder:'Search',searchOnKey: 'value',clearOnSelection: false,inputDirection: 'ltr',}

  constructor(private appSettings: AppSettings,
    private trialBalanceService: TrialBalanceService,
    private toastr: ToastrService,
        private appUtils: AppUtils) { }

  ngOnInit() {

    this.setDefaultDate();
    this.showTrialBalance();

    this.assetAccDetails=[{"id":1,"accName":"Account Receivable","debit":100,"credit":50},{"id":2,"accName":"Cash on Hand","debit":10,"credit":20}]
    this.liabilitiesAccDetails=[{"id":1,"accName":"GST","debit":0.00,"credit":50}];
  }

  showTrialBalance() {
    // this.purchaseVendortData = {vendorReportsList={}};
    console.log("from",this.fromDate);
    console.log("from",this.toDate);
    // if (this.selectedVendor !== undefined) {
     
     var body={ 
     
    
     "asOfDate": this.model.asOfDate,
      "reportType": this.selectedstType};
     
 
     this.trialBalanceService.getDetail(body)
     .subscribe(
         (data) => {
           
           this.statement=[];
           Object.assign(this.statement,data);
           console.log(this.statement);
    
          //  this.CalculateTotalPurchase();
         });
      //  }
   }
  // public openPDF(): void {
  //   const doc = new jsPDF('p', 'pt', 'a4');
  //   doc.setFontSize(15);
  //   doc.text('Trail Balance', 400, 40);
  //   autoTable(doc, {
  //      html: '#my-table',
  //      styles: {
  //       // cellPadding: 0.5,
  //      // fontSize: 12,
  //   },
  //   tableLineWidth: 0.5,
  //   startY: 400, /* if start position is fixed from top */
  //   tableLineColor: [4, 6, 7], // choose RGB
  //     });
  //     autoTable(doc, {
  //       html: '#my-table',
  //       styles: {
  //    },
  //    tableLineWidth: 0.5,
  //    startY: 300,
  //    tableLineColor: [4, 6, 7], // choose RGB
  //      });
  //     const DATA = this.htmlData.nativeElement;
  //   doc.fromHTML(DATA.innerHTML, 30, 15);
  //   doc.output('dataurlnewwindow');
  // }

  public openPDF(): void {
    const doc = new jsPDF('p', 'pt', 'a4');
    // let doc = new jsPDF("portrait","px","a4");

    doc.setFontSize(15);
    doc.text('Trail Balance ', 50, 50);
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
      title: 'Trail Balance' + ' ' + this.toDate,
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
    doc.text(480, 780, 'Trail Balance');
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
    doc.setFontSize(15);
    doc.text('Trail Balance', 400, 40);
    // doc.text('Outstanding Invoices', 400, 70);
   autoTable(doc, {
    html: '#my-table',
    styles: {
 },
 tableLineWidth: 0.5,
 startY: 550,
 tableLineColor: [4, 6, 7], // choose RGB
   });
    autoTable(doc, {
      html: '#my-table',
      styles: {
   },
   tableLineWidth: 0.5,
   startY: 300,
   tableLineColor: [4, 6, 7], // choose RGB
     });
    const DATA = this.htmlData.nativeElement;
    doc.save('Trail.Balance.pdf');
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
   changeAsOfdate(){
    
    console.log('quotatindate', this.asOfDate);
    const jsDate = new Date(this.asOfDate.year, this.asOfDate.month - 1, this.asOfDate.day + 1);
    // this.asOfDate = jsDate.toISOString();
    this.model.asOfDate=jsDate.toISOString();

   }

   setDefaultDate(){
        
    var qdt=new Date()
    this.asOfDate={ day: qdt.getDate(), month: qdt.getMonth()+1, year: qdt.getFullYear()};
    const jsbillDate = new Date(this.asOfDate.year, this.asOfDate.month - 1, this.asOfDate.day + 1);
    this.model.asOfDate=jsbillDate.toISOString();
  }

  getStatementType(){
    // this.model.statementType=this.selectedstType.keyInt;
   }
}
