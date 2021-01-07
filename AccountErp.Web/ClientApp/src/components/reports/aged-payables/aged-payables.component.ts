import { VendorService } from './../../../services/vendor.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { VendorPersonalInfoModel, BillFilterModel, VendorDetailModel } from 'src/models';
import { PurchaseVendorsDetail } from 'src/models/purchaseByVendors/purchase.vendors.model';
import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NgForm } from '@angular/forms';
import { AppSettings, AppUtils } from 'src/helpers';
import { ToastrService } from 'ngx-toastr';
import { AgedPayablesDetail } from 'src/models/agedPayables/aged.payables.model';
import { AgedPayablesService } from 'src/services/aged.payables.service';

@Component({
  selector: 'app-aged-payables',
  templateUrl: './aged-payables.component.html',
  styleUrls: ['./aged-payables.component.css']
})
export class AgedPayablesComponent implements OnInit {

  @ViewChild ('terms', {static: false}) terms: ElementRef ;
  @ViewChild('htmlData', {static: false}) htmlData: ElementRef;
  @BlockUI('container-blockui') blockUI: NgBlockUI;

  vendor: VendorPersonalInfoModel = new VendorPersonalInfoModel();
    vendors:any=[];
    filterModel: BillFilterModel = new BillFilterModel();
    dueDate;
  startDate;
  endDate;
  fromDate;
  toDate;
  asOfDate;
  allPurchase;
  selectedVendor;
  agedPayableasOfDate;
  config = {displayKey:"value",search:true,limitTo:10,height: 'auto',placeholder:'Select Vendor',customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!',searchPlaceholder:'Search',searchOnKey: 'value',clearOnSelection: false,inputDirection: 'ltr',}

  // "totalPurchaseAmount": 9.65,
  // "totalPaidAmount": 3.92,
  paidPurchase;
  agedPayablesData={totalAmount:0,totalUnpaidAmount:0,totalNotYetOverDue:0,totalCountNotYetOverDue:0,
    totalLessThan30:0,totalCountLessThan30 :0,totalCountThirtyFirstToSixty:0,
    totalThirtyFirstToSixty:0,totalSixtyOneToNinety:0,totalCountSixtyOneToNinety:0,
    totalMoreThanNinety:0,totalCountMoreThanNinety:0,agedPayablesReportDtoList:[{}]};

  
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
  totalPurchases;
  temp;
  model: AgedPayablesDetail = new AgedPayablesDetail();
  purchasevendor: VendorDetailModel = new VendorDetailModel();

  constructor(  private appSettings: AppSettings,
    private agedPayableService: AgedPayablesService,
    private vendorService: VendorService,
    private toastr: ToastrService,
        private appUtils: AppUtils) { }

  ngOnInit() {
    this.setDefaultDate();
    this.loadVendors();
    this.showAgedPayablesReport();
  }

  showAgedPayablesReport() {
    // this.purchaseVendortData = {vendorReportsList={}};
    console.log("from",this.fromDate);
    console.log("from",this.toDate);
    var body
    if (this.selectedVendor !== undefined) {
     
     body = {
      "vendorId": this.selectedVendor.keyInt,
     "asOfDate":  this.model.agedPayableasOfDate,
     "reportType": 0};
     }else{
      body={ 
        "vendorId": 0,
       "asOfDate": this.model.agedPayableasOfDate,
       "reportType": 0};
     }
     this.agedPayableService.getAgedPayable(body)
     .subscribe(
         (data) => {
           
           console.log("statement",data);
          // Object.assign(this.temp, data);
              Object.assign(this.agedPayablesData, data);
              // this.allPurchase=this.agedPayablesData.totalAmount;
              this.paidPurchase=this.agedPayablesData.totalUnpaidAmount;

              this.allNotYetOverdue=this.agedPayablesData.totalNotYetOverDue;
              this.allCountNotOverdue=this.agedPayablesData.totalCountNotYetOverDue;
              this.all30OrLess=this.agedPayablesData.totalLessThan30;
              this.allCountLessThan30=this.agedPayablesData.totalCountLessThan30;
              this.all31To60=this.agedPayablesData.totalThirtyFirstToSixty;
              this.allCount31To60=this.agedPayablesData.totalCountThirtyFirstToSixty;
              this.all61To90=this.agedPayablesData.totalSixtyOneToNinety;
              this.allCount61To90=this.agedPayablesData.totalCountSixtyOneToNinety;
              this.all91OrMore=this.agedPayablesData.totalMoreThanNinety;
              this.allCount91OrMore=this.agedPayablesData.totalCountMoreThanNinety;
              this.allTotalUnpaid=this.agedPayablesData.totalUnpaidAmount;
              this.allTotalAmount=this.agedPayablesData.totalAmount;
              this.temp.agedPayablesReportDtoList.map((item) => {
               
                item.totalUnpaidAmount=item.totalAmount;
                
            });
          //  this.CalculateTotalPurchase();
         });
      //  }
   }
   public openPDF(): void {
    const doc = new jsPDF('p', 'pt', 'a4');
    // let doc = new jsPDF("portrait","px","a4");

    doc.setFontSize(15);
    doc.text('Aged Payables', 50, 50);
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
      title: 'Aged Payables' + ' ' + this.toDate,
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
    doc.text(495, 780, 'Aged Payables');
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
  doc.text('Aged Payables', 50, 50);
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
    title: 'Aged Payables' + ' ' + this.toDate,
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
  doc.text(495, 780, 'Aged Payables');
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
    doc.save('Aged Payables.pdf');
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
    this.asOfDate = jsDate.toISOString();
    this.model.agedPayableasOfDate=jsDate.toISOString();

   }

   getVendorDetail() {
    
    if(this.selectedVendor!=undefined){
        this.model.vendorId=this.selectedVendor.keyInt;
    this.blockUI.start();
    this.vendor = new VendorPersonalInfoModel();
    this.vendorService.getPersonalInfo(Number(this.model.vendorId))
        .subscribe(
            (data) => {
                this.blockUI.stop();
                Object.assign(this.vendor, data);
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            }
        );
    }
}

loadVendors() {
  this.vendorService.getSelectItems()
      .subscribe(
          data => {
            this.vendors=[];
              Object.assign(this.vendors, data);
          },
          error => {
              this.appUtils.ProcessErrorResponse(this.toastr, error);
          });
}

setDefaultDate(){
        
  var qdt=new Date()
  // this.asOfDate={ day: qdt.getDate(), month: qdt.getMonth()+1, year: qdt.getFullYear()};
  // const jsbillDate = new Date(this.asOfDate.year, this.asOfDate.month - 1, this.asOfDate.day);
  // this.model.asOfDate=jsbillDate.toISOString();

  this.asOfDate={ day: qdt.getDate(), month: qdt.getMonth()+1, year: qdt.getFullYear()};
  const jsduevDate = new Date(this.asOfDate.year, this.asOfDate.month - 1, this.asOfDate.day + 1);
  this.model.agedPayableasOfDate=jsduevDate.toISOString();
}


}
