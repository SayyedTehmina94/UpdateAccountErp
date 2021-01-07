import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NgForm } from '@angular/forms';
import { AppSettings, AppUtils } from 'src/helpers';
import { PurchaseVendorsService } from 'src/services/purchase-vendors.service';
import { PurchaseVendorsDetail } from 'src/models/purchaseByVendors/purchase.vendors.model';
import { VendorDetailModel, VendorPersonalInfoModel, SelectListItemModel, BillFilterModel } from 'src/models';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { VendorService } from 'src/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-purchases-by-vendor',
  templateUrl: './purchases-by-vendor.component.html',
  styleUrls: ['./purchases-by-vendor.component.css']
})
export class PurchasesByVendorComponent implements OnInit {
  @ViewChild ('terms', {static: false}) terms: ElementRef ;
  @ViewChild('htmlData', {static: false}) htmlData: ElementRef;
  @BlockUI('container-blockui') blockUI: NgBlockUI;

  vendor: VendorPersonalInfoModel = new VendorPersonalInfoModel();
    vendors:any=[];
    filterModel: BillFilterModel = new BillFilterModel();

  startDate;
  endDate;
  fromDate;
  toDate;
  allPurchase;
  selectedVendor;
  config = {displayKey:"value",search:true,limitTo:10,height: 'auto',placeholder:'Select Vendor',customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!',searchPlaceholder:'Search',searchOnKey: 'value',clearOnSelection: false,inputDirection: 'ltr',}

  // "totalPurchaseAmount": 9.65,
  // "totalPaidAmount": 3.92,
  paidPurchase;
  purchaseVendortData={totalPurchaseAmount:0,totalPaidAmount:0,vendorReportsList:[{}]};
  today = new Date();
  totalPurchases;
  temp;
  model: PurchaseVendorsDetail = new PurchaseVendorsDetail();
  purchasevendor: VendorDetailModel = new VendorDetailModel();
  constructor(
    private appSettings: AppSettings,
    private purchaseVendorsService: PurchaseVendorsService,
    private vendorService: VendorService,
    private toastr: ToastrService,
        private appUtils: AppUtils,
  ) { }

  ngOnInit() {
    this.loadVendors();
    this.setDefaultDate();
    this.showpurchasebyVendor(); 
  }

  showpurchasebyVendor() {
   // this.purchaseVendortData = {vendorReportsList={}};
   console.log("from",this.fromDate);
   console.log("from",this.toDate);
   var body
   if (this.selectedVendor !== undefined) {
    
        body={ 
        "vendorId": this.selectedVendor.keyInt,
        "vendorName": "string",
        "startDate":  this.fromDate,
        "endDate": this.toDate,
        "totalPaidAmount": 0,
        "totalAmount": 0,
        "status": "string"
      };
    }
      else{
         body={ 
          "vendorId": 0,
          "vendorName": "string",
          "startDate":  this.fromDate,
          "endDate": this.toDate,
          "totalPaidAmount": 0,
          "totalAmount": 0,
          "status": "string"};
      
   }

    this.purchaseVendorsService.getVendorStatement(body)
    .subscribe(
        (data) => {
          
          console.log("statement",data);
         // Object.assign(this.temp, data);
             Object.assign(this.purchaseVendortData, data);
             this.allPurchase=this.purchaseVendortData.totalPurchaseAmount;
             this.paidPurchase=this.purchaseVendortData.totalPaidAmount;
             this.temp.vendorReportsList.map((item) => {
              
               item.totalPaidAmount=item.totalPurchaseAmount;
              // if(item.status==1){
              //  item.balanceAccAmount=0.00
              // }else{
              //   this.totalPurchases=0;
              //   this.tempBalance+=Number(item.totalAmount);
              //   var balAmnt=Number(this.temp.openingBalance)+this.tempBalance;
              //   this.totalPurchases=balAmnt.toFixed(2);
              //   item.balanceAccAmount=balAmnt.toFixed(2);
              // }
           });
          this.CalculateTotalPurchase();
        });
  }

  // getBalanceAccAmount(item){
  //      this.totalPurchases=0;
  //      this.tempBalance+=Number(item.totalAmount);
  //      var balAmnt=Number(this.statementData.openingBalance)+this.tempBalance;
  //      this.totalPurchases=balAmnt.toFixed(2);
  //      return balAmnt.toFixed(2);
  //  }
   getAllPurchases(){
    return this.totalPurchases;
  }
  getPaidPurchases(item){
    return item.totalAmount.toFixed(2);
  }
  CalculateTotalPurchase(){

  }
  public openPDF(): void {
    const doc = new jsPDF('p', 'pt', 'a4');
    // let doc = new jsPDF("portrait","px","a4");

    doc.setFontSize(15);
    doc.text('Purchase By Vendor', 50, 50);
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
      title: 'Purchase By Vendor' + ' ' + this.toDate,
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
    doc.text(480, 780, 'Purchase By Vendor');
    doc.text(40, 800, 'Date Range : ' + '' + this.fromDate + ' ' + 'to' + ' ' + this.toDate);
    doc.text(450, 800, 'Created on : ' + '' + this.toDate);
    doc.text( ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' '  + ' ' + ' ' +
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
      doc.text('Purchase By Vendor', 50, 50);
     
  
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
        title: 'Purchase By Vendor' + ' ' + this.toDate,
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
      doc.text(480, 780, 'Purchase By Vendor');
      doc.text(40, 800, 'Date Range : ' + '' + this.fromDate + ' ' + 'to' + ' ' + this.toDate);
      doc.text(450, 800, 'Created on : ' + '' + this.toDate);
      doc.text( ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' '  + ' ' + ' ' +
      'Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width / 200, 780, {
        align: 'right'
      });
    }
  };
  
  addFooters(doc);
      doc.fromHTML(DATA.innerHTML, 30, 15);
      doc.autoPrint();
        doc.save('Purchase By Vendor.pdf');
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
