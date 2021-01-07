import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CashFlowService } from 'src/services/cash-flow.service';
import { AppSettings, AppUtils } from 'src/helpers';
import { ToastrService } from 'ngx-toastr';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { NgForm } from '@angular/forms';
import autoTable from 'jspdf-autotable';
import * as jsPDF from 'jspdf';
import { CashFlowDetail } from 'src/models/cashFlow/cash.flow.model';

@Component({
  selector: 'app-cash-flow',
  templateUrl: './cash-flow.component.html',
  styleUrls: ['./cash-flow.component.css']
})
export class CashFlowComponent implements OnInit {
  @ViewChild ('terms', {static: false}) terms: ElementRef ;
  @ViewChild('htmlData', {static: false}) htmlData: ElementRef;
  @BlockUI('container-blockui') blockUI: NgBlockUI;
  model: CashFlowDetail = new CashFlowDetail;
  startDate;
  endDate;
  fromDate;
  toDate;
  showSummary = true;
  showDetail = false;
  cashflowSummary=[];
  cashflowDetails=[];


  allSales;
  allPurchases;
  allSalesTaxes;
  allOther;
  allNetCashOperatingActivites;
  allPropertyPlantEquip;
  allOtherInvesting;

  allNetCashInvestingActivites;
  allNetCashFinancingActivites;
  allStartingBalance;
  allGrossCashInflow;
  allGrossCashOutflow;
  allNetCashChange;
  allEndingBalance;
  



  cashFlowData={totalIncome:0,totalUnpaidAmount:0,totalCostofGoodsSold:0,totalGrossProfit:0,
    totalGrossProfitPercentage:0,totalOperatingExpense :0,totalNetProfit:0,
    totalNetProfitPercenatge:0,agedPayablesReportDtoList:[{}]};

  toggleSummary() {
    // this.showSummary = !this.showSummary;
    this.showSummary=true;
    this.showDetail=false;
  }

  toggleDetail() {
    // this.showDetail = !this.showDetail;
    this.showDetail=true;
    this.showSummary=false;
  }
  showCashFlow(){
    this.getCashFlowSummary();
    this.getCashFlowDetails();
  }
 

  // model: ProfitLossDetail = new ;
  constructor( private cashFlowService: CashFlowService,
    private appSettings: AppSettings,
    private toastr: ToastrService,
        private appUtils: AppUtils,) { }

  ngOnInit() {

    this.setDefaultDate();
    this.getCashFlowSummary();
    this.getCashFlowDetails();
  }


  getCashFlowSummary() {
    // this.purchaseVendortData = {vendorReportsList={}};
    console.log("from",this.fromDate);
    console.log("from",this.toDate);
    // if (this.selectedVendor !== undefined) {
     
     var body={
      "startDate": this.fromDate,
      "endDate": this.toDate,
      "tabId": 0
    };
     
 
     this.cashFlowService.getCashFlowSummary(body)
     .subscribe(
         (data) => {
           
              Object.assign(this.cashflowSummary, data);
              console.log("summary",this.cashflowSummary);
              
             
         });
     
   }

   getCashFlowDetails(){
     
    console.log("from",this.fromDate);
    console.log("from",this.toDate);
    // if (this.selectedVendor !== undefined) {
     
     var body={
      "startDate": this.fromDate,
      "endDate": this.toDate,
      "tabId": 0
    };
     
 
     this.cashFlowService.getCashFlowDetails(body)
     .subscribe(
         (data) => {
           
              Object.assign(this.cashflowDetails, data);
              console.log("statement",this.cashflowDetails);
         });
     
   }

 

  public openPDF(): void {
    const doc = new jsPDF('p', 'pt', 'a4');
    // let doc = new jsPDF("portrait","px","a4");

    doc.setFontSize(15);
    doc.text('Cash-Flow', 50, 50);
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
      title: 'Cash - Flow' + ' ' + this.toDate,
      subject: 'Info about PDF',
      author: 'PDFAuthor',
      keywords: 'generated, javascript, web 2.0, ajax',
      creator: 'My Company'
  });
  autoTable(doc, {
    html: '#my-table',
    styles: {
     // cellPadding: 0.5,
    // fontSize: 12,
      },
      tableLineWidth: 0.5,
      startY: 250, /* if start position is fixed from top */
      tableLineColor: [4, 6, 7], // choose RGB
   });
   autoTable(doc, {
     html: '#my-table1',
     styles: {
  },
  tableLineWidth: 0.5,
  //  startY: 500,
   tableLineColor: [4, 6, 7], // choose RGB
    });
    // autoTable(doc, {
    //   html: '#my-table',
    //   // didParseCell: function (data) {
    //   //   var rows = data.table.body;
    //   //   if (data.row.index === rows.length - 1) {
    //   //       data.cell.styles.fillColor = [239, 154, 154];
    //   //   }
    //   // },

    //   willDrawCell: function (data) {
    //     var rows = data.table.body;
    //     if (data.row.index === rows.length - 1) {
    //         doc.setFillColor(208,208,208);
    //     }
    //     if (data.row.index === rows.length - 5) {
    //       doc.setFillColor(208,208,208);
    //     }
    //     if (data.row.index === rows.length - 8) {
    //       doc.setFillColor(208,208,208);
    //      }
    //       if (data.row.index === rows.length - 10) {
    //         doc.setFillColor(208,208,208);
    //    }
    //   if (data.row.index === rows.length - 14) {
    //        doc.setFillColor(208,208,208);
    //      }
    // },

    //   bodyStyles: { minCellHeight: 20 },
    //   theme: 'striped',
    //   styles: { valign: 'bottom', overflow: 'linebreak', halign: 'left', minCellHeight: 31 },
    //   tableLineWidth: 0.5,
    //   startY: 200,
    //   tableLineColor: [4, 6, 7], // choose RGB
    //   pageBreak: 'avoid',
    //   columnStyles: {
    //     2: { cellWidth: 32, minCellHeight: 32 },
    //   },
    //   headStyles: {  fontStyle: 'bold', lineWidth: 0.5, lineColor: '#ccc', textColor: 0, },
    // });
      const DATA = this.htmlData.nativeElement;


// For each page, print the page number and the total pages
const addFooters = doc => {
  const pageCount = doc.internal.getNumberOfPages();

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(510, 780, 'Cash Flow ');
    doc.text(40, 800, 'Date Range : ' + '' + this.fromDate + ' ' + 'to' + ' ' + this.toDate);
    doc.text(450, 800, 'Created on : ' + '' + this.toDate);
    doc.text( ' ' +' ' +' ' +' ' +' ' +' ' +' ' +' ' +' ' +' ' +' ' +' ' +' ' +' ' +' ' +' ' +
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
    doc.text('Cash-FLow', 400, 40);
    // doc.text('Outstanding Invoices', 400, 70);
   autoTable(doc, {
    html: '#my-table',
    styles: {
 },
 tableLineWidth: 0.5,
 startY: 550,
 tableLineColor: [4, 6, 7], // choose RGB
   });
    const DATA = this.htmlData.nativeElement;
    doc.save('Cash-flow.pdf');
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
