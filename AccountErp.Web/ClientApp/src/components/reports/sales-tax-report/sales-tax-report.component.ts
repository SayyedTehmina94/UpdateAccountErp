import { SalesTaxService } from './../../../services/sales.tax.service';
import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import { AppSettings, AppUtils } from 'src/helpers';
import { ToastrService } from 'ngx-toastr';
import { SalesTaxReportService } from 'src/services/sales-tax-report.service';
import autoTable from 'jspdf-autotable';
import * as jsPDF from 'jspdf';
import { NgForm } from '@angular/forms';
import { SelectListItemModel, ItemListItemModel } from 'src/models';
import { SalesTAxReportDetail } from 'src/models/sales-tax-report/sales.tax.report.model';
import { NgBlockUI, BlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-sales-tax-report',
  templateUrl: './sales-tax-report.component.html',
  styleUrls: ['./sales-tax-report.component.css']
})
export class SalesTaxReportComponent implements OnInit {
  // [x: string]: any;
  @BlockUI('container-blockui-main') blockUI: NgBlockUI;
  @ViewChild('htmlData', {static: false}) htmlData: ElementRef;
  @ViewChild ('terms', {static: false}) terms: ElementRef ;
  itemType: Array<SelectListItemModel> = new Array<SelectListItemModel>();
  @Output() updateTotalAmount = new EventEmitter();
  @Input() selectedTax: any=[];
  @Input() selectedItems: Array<ItemListItemModel> = new Array<ItemListItemModel>();
  salesTaxes: Array<SelectListItemModel> = new Array<SelectListItemModel>();

  @Input() taxList;
  reportTypeList  = [{value:'Accural (Paid & Unpaid)',keyInt:'0'},
                    {value:'Cash Basis (Paid)',keyInt:'1'}]
  config = {displayKey:"value",search:true,height: 'auto',placeholder:'Select Item',customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!',searchPlaceholder:'Search',searchOnKey: 'value',clearOnSelection: false,inputDirection: 'ltr',}
  config2 = {displayKey:"code",search:true,height: 'auto',placeholder:'Select Item',customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!',searchPlaceholder:'Search',searchOnKey: 'code',clearOnSelection: false,inputDirection: 'ltr',}

  model: SalesTAxReportDetail = new SalesTAxReportDetail();

  reportType = 'accural';
  salesPurchaseData={totalTaxAmountOnSales:0,totalTaxAmountOnPurchase:0,totalNetTaxOwing:0,totalStartingBalance:0,totalEndingBalance:0,
                      totalLessPaymentsToGovernment:0, salesTaxReportDtosList:[{}]}; 
  paymentBalanceData;
  allPurchase;
  allTaxAmountOnSales;
  alltaxAmountonPurchase;
  allNetTaxOwing;
  allStartingBalance;
  allEndingBalance;
  allLessPaymenttoGovt;
  temp;
  selectedReportType;
  // selectedTax;
   //salesTaxes:any[];
   sales:any;
  startDate;
  endDate;
  fromDate;
  toDate;
  salesTaxItems;
  selectedstType = 0;
  constructor(private appSettings: AppSettings,
    private salesTaxReportService: SalesTaxReportService,
    private toastr: ToastrService,
        private appUtils: AppUtils,
        private salesTaxService: SalesTaxService,) { }

  ngOnInit() {
    this.loadSalesTax();
    this.loadTaxes();
    this.setDefaultDate();
    this.showSalesTaxReport();
  }

  public openPDF(): void {
    const doc = new jsPDF('p', 'pt', 'a4');
    // var doc = new jsPDF('p', 'pt', 'letter');

    doc.setFontSize(15);
    doc.text('Sales Tax Report', 50, 50);

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
      title: 'Sales - Tax' + ' ' + this.toDate,
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
      const DATA = this.htmlData.nativeElement;
      const addFooters = doc => {
        const pageCount = doc.internal.getNumberOfPages();
      
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.text(510, 780, 'Sales - Tax ');
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
    // doc.output('dataurlnewwindowsales');
    window.open(doc.output('bloburl'), '_blank');
  }

  // public openPDF(): void {
  //   const doc = new jsPDF('p', 'pt', 'a4');
  //   // var doc = new jsPDF('p', 'pt', 'letter');

  //   doc.setFontSize(15);
  //   doc.text('Sales Tax Report', 50, 50);

  //   var startDate = new Date(new Date().getFullYear(), 0, 1);
  //   this.startDate={ day: startDate.getDate(), month: startDate.getMonth()+1, year: startDate.getFullYear()};
  //   const jsbillDate = new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day);
  //   this.fromDate=jsbillDate.toDateString();
  
  //   var endDate = new Date();
  //   this.endDate={ day: endDate.getDate(), month: endDate.getMonth()+1, year: endDate.getFullYear()};
  //   const jsduevDate = new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day);
  //   this.toDate=jsduevDate.toDateString();
  //   doc.text(50, 100, 'Date Range : ' + '' + this.fromDate + ' ' + 'to' + ' ' + this.toDate);

  //   doc.setProperties({
  //     title: 'Sales - Tax' + ' ' + this.toDate,
  //     subject: 'Info about PDF',
  //     author: 'iClose',
  //     keywords: 'generated, javascript, web 2.0, ajax',
  //     creator: 'iClose'
  // });
  //   autoTable(doc, {
  //      html: '#my-table1',
  //      styles: {
  //       // cellPadding: 0.5,
  //      // fontSize: 12,
  //   },
  //   tableLineWidth: 0.5,
  //   startY: 500, /* if start position is fixed from top */
  //   tableLineColor: [4, 6, 7], // choose RGB
  //     });

  //     autoTable(doc, {
  //       html: '#my-table',
  //       styles: {
  //    },
  //    tableLineWidth: 0.5,
  //    startY: 200,
  //    tableLineColor: [4, 6, 7], // choose RGB
  //      });
  //     const DATA = this.htmlData.nativeElement;
  //     const addFooters = doc => {
  //       const pageCount = doc.internal.getNumberOfPages();
      
  //       doc.setFont('helvetica', 'italic');
  //       doc.setFontSize(8);
  //       for (let i = 1; i <= pageCount; i++) {
  //         doc.setPage(i);
  //         doc.text(510, 780, 'Sales - Tax ');
  //         doc.text(40, 800, 'Date Range : ' + '' + this.fromDate + ' ' + 'to' + ' ' + this.toDate);
  //         doc.text(450, 800, 'Created on : ' + '' + this.toDate);
  //         doc.text( ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' +
  //         'Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width / 200, 780, {
  //           align: 'right'
  //         });
  //       }
  //     };
      
  //     addFooters(doc);
      
  //   doc.fromHTML(DATA.innerHTML, 30, 15);
  //   // doc.output('dataurlnewwindowsales');
  //   window.open(doc.output('bloburl'), '_blank');
  // }


public downloadPDF(): void {
  const doc = new jsPDF('p', 'pt', 'a4');
  doc.setFontSize(15);
  doc.text('Sales Tax Report', 50, 50);

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
    title: 'Sales - Tax' + ' ' + this.toDate,
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
  startY: 250, /* if start position is fixed from top */
  tableLineColor: [4, 6, 7], // choose RGB
    });

    autoTable(doc, {
      html: '#my-table1',
      styles: {
   },
   tableLineWidth: 0.5,
  //  startY: 200,
   tableLineColor: [4, 6, 7], // choose RGB
     });
    const DATA = this.htmlData.nativeElement;
    const addFooters = doc => {
      const pageCount = doc.internal.getNumberOfPages();
    
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(510, 780, 'Sales - Tax ');
        doc.text(40, 800, 'Date Range : ' + '' + this.fromDate + ' ' + 'to' + ' ' + this.toDate);
        doc.text(450, 800, 'Created on : ' + '' + this.toDate);
        doc.text( ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' + ' ' +
        'Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width / 200, 780, {
          align: 'right'
        });
      }
    };
    
    addFooters(doc);
    doc.autoPrint();
  doc.fromHTML(DATA.innerHTML, 30, 15);
  // doc.output('dataurlnewwindowsales');
    doc.save('Sales-Tax.pdf');
  }


  onSubmit(form: NgForm) {
    // console.log(this.terms);
    //  console.log(this.terms.nativeElement.checked);
}


    showSalesTaxReport(){
      
        // this.purchaseVendortData = {vendorReportsList={}};
   console.log("from",this.fromDate);
   console.log("from",this.toDate);
   var body
   if (this.selectedTax !== undefined) {
    // if (this.selectedReportType !== undefined) {
    
    body={ 
      "salesId": this.selectedTax.id,
        "startDate":  this.fromDate,
        "endDate":  this.toDate,

        "reportType": this.selectedstType
    };
  // }
    }else{
          body={ 
            "salesId": 0,
              "startDate":  this.fromDate,
              "endDate":  this.toDate,
      
              "reportType":this.selectedstType
          }; 
        }

    this.salesTaxReportService.getDetail(body)
    .subscribe(
        (data) => {
          
          console.log("statement",data);
         // Object.assign(this.temp, data);
             Object.assign(this.salesPurchaseData, data);
             this.allTaxAmountOnSales=this.salesPurchaseData.totalTaxAmountOnSales;
             this.alltaxAmountonPurchase=this.salesPurchaseData.totalTaxAmountOnPurchase;
             this.allNetTaxOwing=this.salesPurchaseData.totalNetTaxOwing;
             this.allStartingBalance=this.salesPurchaseData.totalStartingBalance;
             this.allEndingBalance =this.salesPurchaseData.totalEndingBalance;
             this.allLessPaymenttoGovt = this.salesPurchaseData.totalLessPaymentsToGovernment;
             this.temp.salesTaxReportDtosList.map((item) => {
              
               item.totalPaidAmount=item.totalTaxAmountOnSales;
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
          //this.CalculateTotalPurchase();
        });
      // }
    // }
    }
changeTax(index,event){
        
        console.log("tax ngmodel after",event)
       
       // alert(event.target.Value)
        this.selectedItems[index].salesTaxId=this.selectedTax[index].id;
        this.selectedItems[index].taxPercentage=Number(this.selectedTax[index].taxPercentage);
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
//    getSalesTax() {
//     
//     if(this.selectedTax!=undefined){
//         this.model.salesId=this.selectedTax.keyInt;
//     this.blockUI.start();
//     this.salesTax = new VendorPersonalInfoModel();
//     this.salesTaxService.getPersonalInfo(Number(this.model.salesId))
//         .subscribe(
//             (data) => {
//                 this.blockUI.stop();
//                 Object.assign(this.salesTax, data);
//             },
//             error => {
//                 this.blockUI.stop();
//                 this.appUtils.ProcessErrorResponse(this.toastr, error);
//             }
//         );
//     }
// }

getSalesTax() {
  
   if (this.selectedTax !== undefined) {
       this.model.salesId = this.selectedTax.keyInt;
   if (this.model.salesId === null
       || this.model.salesId === '') {
       return;
   }
   this.salesTaxService.getDetail(Number(this.model.salesId))
       .subscribe(
           (data) => {
           });
       }
}




loadTaxes() {
  // this.blockUI.start();
  this.salesTaxService.getSelectListItems()
      .subscribe((data) => {
          // this.blockUI.stop();
          this.sales=[];
          Object.assign(this.sales, data);
      },
          error => {
              // this.blockUI.stop();
              this.appUtils.ProcessErrorResponse(this.toastr, error);
          });
}

loadSalesTax() {
  
  // this.blockUI.start();
  this.salesTaxService.getSelectListItems()
      .subscribe((data) => {
          // this.blockUI.stop();
          Object.assign(this.salesTaxes, data);
          console.log("taxlist",this.salesTaxes)
      },
          error => {
              // this.blockUI.stop();
              this.appUtils.ProcessErrorResponse(this.toastr, error);
          });
}
getStatementType(){
  // this.model.statementType=this.selectedstType.keyInt;
 }


}
