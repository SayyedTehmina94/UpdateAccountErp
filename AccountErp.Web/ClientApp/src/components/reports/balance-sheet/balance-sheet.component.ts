import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AppSettings, AppUtils } from 'src/helpers';
import { BalanceSheetService } from 'src/services/balance-sheet.service';
import { ToastrService } from 'ngx-toastr';
import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { NgForm } from '@angular/forms';
import { BalanceSheetDetail } from 'src/models/balance-sheet/balance.sheet.model';

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.css']
})
export class BalanceSheetComponent implements OnInit {
  @ViewChild ('terms', {static: false}) terms: ElementRef ;
  @ViewChild('htmlData', {static: false}) htmlData: ElementRef;
  @BlockUI('container-blockui') blockUI: NgBlockUI;
  asOfDate;
  selectedstType = 0;
  showSummary = true;
  showDetail = false;
  startDate;
  endDate;
  fromDate;
  toDate;
  tab=0;
  balanceSheetData : any={};
  statement = [];
  totalIncome=0;
  totalExpense=0;
  reportTypeList  = [{value:'Accural (Paid & Unpaid)',keyInt:'0'},
                    {value:'Cash Basis (Paid)',keyInt:'1'}]

   config = {displayKey:"value",search:true,limitTo:10,height: 'auto',placeholder:'Select Value',
             customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!',searchPlaceholder:'Search',
             searchOnKey: 'value',clearOnSelection: false,inputDirection: 'ltr',}                  
  model: BalanceSheetDetail = new BalanceSheetDetail();
  toggleSummary() {
    // this.showSummary = !this.showSummary;
    this.showSummary=true;
    this.showDetail=false;
    this.tab=0;
    this.showBalanceSheet();

  }

  toggleDetail() {
    // this.showDetail = !this.showDetail;
    this.showDetail=true;
    this.showSummary=false;
    this.tab=1;
    this.showBalanceSheet();
  }

  constructor(private appSettings: AppSettings,
    private balanceSheetService: BalanceSheetService,
    private toastr: ToastrService,
        private appUtils: AppUtils,) { }

  ngOnInit() {
    this.setDefaultDate();
    this.showBalanceSheet();
  }


  showBalanceSheet() {
    // this.purchaseVendortData = {vendorReportsList={}};
    // if (this.selectedVendor !== undefined) {
     
     var body={ 
      "asOfDate": this.model.asOfDate,
      "reportType": this.selectedstType,
      "tab": this.tab
    };
     
 
     this.balanceSheetService.getBalanceSheet(body)
     .subscribe(
         (data) => {
           
          
          // Object.assign(this.temp, data);
              this.balanceSheetData=[];
              var balanceSheetReportDtos=[];
              Object.assign(this.balanceSheetData, data);
             // Object.assign(balanceSheetReportDtos,data.balanceSheetReportDtos)
              console.log("statement",this.balanceSheetData);
              
              this.statement = [];
              Object.assign(this.statement, data);
              console.log('balanceSheet', this.statement);
         });
      //  }
   }

  public openPDF(): void {
    const doc = new jsPDF('p', 'pt', 'a4');
    // let doc = new jsPDF("portrait","px","a4");

    doc.setFontSize(15);
    doc.text('Balance - Sheet', 50, 50);

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
      title: 'Balance - Sheet' + ' ' + this.toDate,
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
    doc.text(490, 780, 'Balance - sheet ');
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
  doc.text('Balance - Sheet', 50, 50);
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
    title: 'Balance - Sheet' + ' ' + this.toDate,
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
  doc.text(490, 780, 'Balance - sheet ');
  doc.text(40, 800, 'Date Range : ' + '' + this.fromDate + ' ' + 'to' + ' ' + this.toDate);
  doc.text(450, 800, 'Created on : ' + '' + this.toDate);
  doc.text( ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' +
  'Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width / 200, 780, {
    align: 'right'
  });
}
};

addFooters(doc);
  doc.fromHTML(DATA.innerHTML, 30, 15);
  doc.autoPrint();
    doc.save('Balance-Sheet.pdf');
  }


  onSubmit(form: NgForm) {
    // console.log(this.terms);
    //  console.log(this.terms.nativeElement.checked);
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
