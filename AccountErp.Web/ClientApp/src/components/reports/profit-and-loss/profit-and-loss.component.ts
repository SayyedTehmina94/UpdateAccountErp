import { ProfitLossService } from './../../../services/profit-loss.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ProfitLossDetail } from 'src/models/profitAndLoss/profit.loss.model';
import { NgForm } from '@angular/forms';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import autoTable from 'jspdf-autotable';
import * as jsPDF from 'jspdf';
import { AppUtils, AppSettings } from 'src/helpers';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, NavigationEnd} from '@angular/router';

@Component({
  selector: 'app-profit-and-loss',
  templateUrl: './profit-and-loss.component.html',
  styleUrls: ['./profit-and-loss.component.css']
})
export class ProfitAndLossComponent implements OnInit {
  currentUrl = '/';
  @ViewChild ('terms', {static: false}) terms: ElementRef ;
  @ViewChild('htmlData', {static: false}) htmlData: ElementRef;
  @BlockUI('container-blockui') blockUI: NgBlockUI;
  selectedstType = 0;
  startDate;
  endDate;
  fromDate;
  toDate;
  showSummary = true;
  showDetail = false;
  temp;
  selectedDateRange;
  statement = [];
  tab = 0;
  profitAndLossData=[];
  //profitAndLossData = [{income: 0 , netProfit: 0 , grossProfit: 0 , operatingExpenses: 0 , mainProfitAndLossDetailsList: [{}]}];
  allTotalIncome;
  allTotalCostOfGoodSold;
  allgrossProfit;
  allGrossProfitPercentage;
  allTotalOperatingExpenses;
  allNetProfit;
  allNetProfitPercentage;
  reportDetails:[{}];
  reportTypeList  = [{value:'Accural (Paid & Unpaid)',keyInt:'0'},
                   {value:'Cash Basis (Paid)',keyInt:'1'}]
  config = {displayKey:"value",search:true,limitTo:10,height: 'auto',placeholder:'Select Value',
       customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!',searchPlaceholder:'Search',
       searchOnKey: 'value',clearOnSelection: false,inputDirection: 'ltr',}
                 

  // profitAndLossData={income:0,totalUnpaidAmount:0,costOfGoodSold:0,grossProfit:0,
  //   totalGrossProfitPercentage:0,operatingExpenses :0,netProfit:0,
  //   totalNetProfitPercenatge:0,mainProfitAndLossDetailsList:[{}]};

    public dates: string[] = ['* Calendar Year', '2020', '2019', '2018', '__________', '*  Calendar Quarter',
             'Q3 2020', 'Q2 2020', 'Q1 2020',
    'Q4 2019', 'Q3 2019', 'Q2 2019', 'Q1 2019', 'Q4 2018', '__________', '* Month', 'August 2020', 'July 2020',
     'June 2020', 'May 2020', 'April 2020', 'March 2020', 'February 2020', 'January 2020', 'December 2019',
     'November 2019', 'October 2019', 'September 2019', 'August 2019', 'July 2019',
     'June 2019', 'May 2019', 'April 2019', 'March 2019', 'February 2019', 'January 2019', ' December 2018',
     'November 2018', 'October 2018', 'September 2018', '__________', '* Other', 'This Week', 'Previous Week',
     'Last Four Week', 'Last 30 days', 'Last 60 days', 'Last 90 days' ];

  

  toggleSummary() {
    // this.showSummary = !this.showSummary;
    this.showSummary = true;
    this.showDetail = false;
    this.tab = 0;
    this.showProfitLoss();

  }

  toggleDetail() {
    // this.showDetail = !this.showDetail;
    this.showDetail = true;
    this.showSummary = false;
    this.tab = 1;
    this.showProfitLoss();
  }

  // tslint:disable-next-line:member-ordering
  model: ProfitLossDetail = new ProfitLossDetail;

  constructor(
                  private profitLossService: ProfitLossService,
                  private appSettings: AppSettings,
                  private toastr: ToastrService,
                  private appUtils: AppUtils,
                  private router: Router,
    ) { }

    ngOnInit() {
      this.setDefaultDate();
      this.showProfitLoss();

  }


  showProfitLoss() {
    console.log('from', this.fromDate);
    console.log('from', this.toDate);
    // if (this.selectedVendor !== undefined) {
     
     var body =  {
      'startDate': this.fromDate,
      'endDate': this.toDate,
      'reportType': this.selectedstType,
      'tab': this.tab
    };

    //  this.profitLossService.getProfitLoss(body)

         this.profitLossService.getProfitDetail(body)
         .subscribe(
             (data) => {
                ;
               this.statement = [];
               Object.assign(this.statement, data);
               console.log('accbal', this.statement);

              // Object.assign(this.temp, data);
             // this.profitAndLossData = [];
              Object.assign(this.profitAndLossData, data);
              console.log('PROFITANDLOSS', this.profitAndLossData);
            //   this.profitAndLossData.forEach(element => {
            //     
            //     this.reportDetails.push(element.mainProfitAndLossDetailsList) 
            // });
            console.log('PROFITANDLOSS', this.profitAndLossData);

              // this.allTotalIncome = this.profitAndLossData.income;
              // this.allNetProfit = this.profitAndLossData.netProfit;
              // this.allgrossProfit = this.profitAndLossData.grossProfit;
              // this.allTotalOperatingExpenses = this.profitAndLossData.operatingExpenses;
                // this.temp.mainProfitAndLossDetailsList.map((item) => {
                //     item.totalUnpaidAmount = item.totalAmount;
                // });
             });
       }


  public openPDF(): void {
    const doc = new jsPDF('p', 'pt', 'a4');
    // let doc = new jsPDF("portrait","px","a4");

    doc.setFontSize(15);
    doc.text('Profit And Loss', 50, 50);
   // doc.autoPrint();

    var startDate = new Date(new Date().getFullYear(), 0, 1);
    this.startDate = { day: startDate.getDate(), month: startDate.getMonth()+1, year: startDate.getFullYear()};
    const jsbillDate = new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day);
    this.fromDate = jsbillDate.toDateString();

    var endDate = new Date();
    this.endDate = { day: endDate.getDate(), month: endDate.getMonth()+1, year: endDate.getFullYear()};
    const jsduevDate = new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day);
    this.toDate = jsduevDate.toDateString();
    doc.text(50, 100, 'Date Range : ' + '' + this.fromDate + ' ' + 'to' + ' ' + this.toDate);

    doc.setProperties({
      title: 'Profit and Loss' + ' ' + this.toDate,
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


      const DATA = this.htmlData.nativeElement;


      // For each page, print the page number and the total pages
      const addFooters = doc => {
          const pageCount = doc.internal.getNumberOfPages();

          doc.setFont('helvetica', 'italic');
          doc.setFontSize(8);
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(490, 780, 'Profit And Loss ');
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
  doc.text('Profit And Loss', 50, 50);
 // doc.autoPrint();

        var startDate = new Date(new Date().getFullYear(), 0, 1);
        this.startDate = { day: startDate.getDate(), month: startDate.getMonth() + 1, year: startDate.getFullYear()};
        const jsbillDate = new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day);
        this.fromDate  = jsbillDate.toDateString();

        var endDate = new Date();
        this.endDate = { day: endDate.getDate(), month: endDate.getMonth() + 1, year: endDate.getFullYear()};
        const jsduevDate = new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day);
        this.toDate = jsduevDate.toDateString();
        doc.text(50, 100, 'Date Range : ' + '' + this.fromDate + ' ' + 'to' + ' ' + this.toDate);

  doc.setProperties({
          title: 'Profit and Loss' + ' ' + this.toDate,
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
        const DATA = this.htmlData.nativeElement;


        // For each page, print the page number and the total pages
        const addFooters = doc => {
              const pageCount = doc.internal.getNumberOfPages();

              doc.setFont('helvetica', 'italic');
              doc.setFontSize(8);
              for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.text(490, 780, 'Profit And Loss ');
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
    doc.save('Profit-And-Loss-Report.pdf');
  }


  onSubmit(form: NgForm) {
    // console.log(this.terms);
    //  console.log(this.terms.nativeElement.checked);
  }
   changeStartDate() {
    
    console.log('startDate', this.startDate);
    const jsDate = new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day + 1);
    this.fromDate = jsDate.toISOString();
   }

   changeEnddate() {
    
    console.log('endDate', this.endDate);
    const jsDate = new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day + 1);
    this.toDate = jsDate.toISOString();
   }

   setDefaultDate() {
        
        var startDate = new Date(new Date().getFullYear(), 0, 1);
        this.startDate = { day: startDate.getDate(), month: startDate.getMonth() + 1, year: startDate.getFullYear()};
        const jsbillDate = new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day + 1);
        this.fromDate = jsbillDate.toISOString();

        var endDate = new Date();
        this.endDate = { day: endDate.getDate(), month: endDate.getMonth() + 1, year: endDate.getFullYear()};
        const jsduevDate = new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day + 1);
        this.toDate = jsduevDate.toISOString();
  }
   getDateRangeDetail() {

   }

   getStatementType(){
    // this.model.statementType=this.selectedstType.keyInt;
   }
}
