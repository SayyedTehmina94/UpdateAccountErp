import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import autoTable from 'jspdf-autotable';
import * as jsPDF from 'jspdf';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { AppSettings, AppUtils } from 'src/helpers';
import { AccountTransactionsService } from 'src/services/account-transactions.service';
import { ToastrService } from 'ngx-toastr';
import { AccountTransactionDetail } from 'src/models/accountTransaction/accountTransaction.model';
import { ActivatedRoute } from '@angular/router';
import { VendorService, CustomerService } from 'src/services';

@Component({
  selector: 'app-account-transactions',
  templateUrl: './account-transactions.component.html',
  styleUrls: ['./account-transactions.component.css']
})
export class AccountTransactionsComponent implements OnInit {

  @ViewChild ('terms', {static: false}) terms: ElementRef ;
  @ViewChild('htmlData', {static: false}) htmlData: ElementRef;
  @BlockUI('container-blockui') blockUI: NgBlockUI;
  model: AccountTransactionDetail = new AccountTransactionDetail();
  accountList=[{accmaster:"",accounts:[]}];
  allAccounts;
  endDate;
  fromDate;
  toDate;
  startDate;
  temp;
  dates;
  selectedDate;
  selectedstType = 0;
  selectedstContact=0;
  vendors;
  customers;
  accountId=0;
  contactTypenID=0;
  contactType=0;
  reportTypeList  = [{value:'Accural (Paid & Unpaid)',keyInt:'0'},
  {value:'Cash Basis (Paid)',keyInt:'1'}]
config = {displayKey:"value",search:true,limitTo:10,height: 'auto',placeholder:'Select Customer',
customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!',searchPlaceholder:'Search',
searchOnKey: 'value',clearOnSelection: false,inputDirection: 'ltr',}
  accountTransactionData;
    
  constructor(private appSettings: AppSettings,
    private route: ActivatedRoute,
    private accountTransactionService: AccountTransactionsService,
    private toastr: ToastrService,
    private vendorService:VendorService,
    private customerService:CustomerService,
        private appUtils: AppUtils,) {

          this.route.params.subscribe((params) => {
            if (params['id']) {
              // alert(params['id'])
              this.accountId= params['id'];
              
            }
        });
         }

  ngOnInit( ) {
    this.loadAccounts();
    this.loadCustomers();
    this.loadVendors();
    this.setDefaultDate();

    this.showAccountTransaction();
  }
  onSubmit(form: NgForm) {
    // console.log(this.terms);
    //  console.log(this.terms.nativeElement.checked);
}

loadAccounts(){
  this.blockUI.start();
  this.accountTransactionService.getAllaccounts()
      .subscribe((data) => {
          
          this.blockUI.stop();
         
         
          this.allAccounts=[];
          var master=[];

          Object.assign(this.allAccounts, data);
          console.log("all accounts",this.allAccounts)
         
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

loadVendors() {
  this.blockUI.start();
  this.vendorService.getSelectItems()
      .subscribe((data) => {
          this.blockUI.stop();
          this.vendors=[];
          Object.assign(this.vendors, data);
          console.log("vendr",this.vendors);
      },
          error => {
              this.blockUI.stop();
              this.appUtils.ProcessErrorResponse(this.toastr, error);
          });
}

selectContact(event){
  
  console.log("contact",this.contactTypenID)
  var contactString=this.contactTypenID.toString().split('/');
  this.selectedstContact=Number(contactString[0]);
  this.contactType=Number(contactString[1]);
}
setContType(val){
  // alert(val);
}
loadCustomers() {
  this.blockUI.start();
  this.customerService.getSelectItems()
      .subscribe((data) => {
          
          this.blockUI.stop();
          this.customers=[];
          console.log("customers",this.customers)
         
          
          Object.assign(this.customers, data);
          // if(this.customers.length>0){
          //     this.customrlist=[];
          //     this.customers.forEach(element => {
          //         this.customrlist.push({"id":element.id,"value":element.value})
          //     });
          // }
         
      },
          error => {
              this.blockUI.stop();
              this.appUtils.ProcessErrorResponse(this.toastr, error);
          });
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
  selectAccount(event){
    
  }


  public openPDF(): void {
    const doc = new jsPDF('p', 'pt', 'a4');
    // let doc = new jsPDF("portrait","px","a4");

    doc.setFontSize(15);
    doc.text('Account transactions', 50, 50);
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
      title: 'Account transactions' + ' ' + this.toDate,
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
          // font: 'arial',
          // overflow: 'linebreak',
      },
      tableLineWidth: 0.5,
      // pageBreak: 'auto',
     //tableWidth: 'auto',
      
      startY: 50, /* if start position is fixed from top */
      tableLineColor: [4, 6, 7], // choose RGB
    });
      const DATA = this.htmlData.nativeElement;

      autoTable(doc, {
        html: '#my-table1',
        styles: {
         // cellPadding: 0.5,
        // fontSize: 12,
     },
     tableLineWidth: 0.5,
     pageBreak: 'always',
     startY: 500, /* if start position is fixed from top */
     tableLineColor: [4, 6, 7], // choose RGB
       });
// For each page, print the page number and the total pages
const addFooters = doc => {
  const pageCount = doc.internal.getNumberOfPages();

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(485, 780, 'Account transactions');
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
    window.open(doc.output('bloburl'), '_blank');
    // doc.output('dataurlnewwindow');
  }

public downloadPDF(): void {
    const doc = new jsPDF('p', 'pt', 'a4');
    // let doc = new jsPDF("portrait","px","a4");

    doc.setFontSize(15);
    doc.text('Account transactions', 50, 50);
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
      title: 'Account transactions' + ' ' + this.toDate,
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
      pageBreak: 'always',
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
    doc.text(490, 780, 'Account transactions');
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
    doc.autoPrint();
    doc.save('Account transactions.pdf');
  }
  getTransactionDesc(transType){
    var statement;
    switch (transType) {
      case 0:
         statement="Customer Payment";
          break;
      case 1:
        statement="Invoice Payment";
          break;
      case 2:
            statement="Vendor Payment";
            break;
            case 3:
              statement="Bill Payment";
              break;
              case 4:
                statement="Account Payment refund(tax refund)";
                break;
                case 5:
                  statement="Sales tax to Govt.(Account Payment)";
                  break;
  }

  return statement;
  }
  showAccountTransaction(){
    // this.purchaseVendortData = {vendorReportsList={}};
    console.log("from",this.fromDate);
    console.log("from",this.toDate);
 
     
    //  if (this.selectedCustomer !== undefined) {
 
    var body=  {
        "fromDate": this.fromDate,
        "toDate": this.toDate,
        "contactId": this.selectedstContact,
        "accountId": this.accountId,
        "reportType": this.selectedstType,
        "contactType": this.contactType
      }
     this.accountTransactionService.getAccountTransaction(body)
     .subscribe(
      (data) => {
        
           this.accountTransactionData=[];
           Object.assign(this.accountTransactionData, data);
           console.log("statement",this.accountTransactionData);
          
       //  this.CalculateTotalPurchase();
      });

  }

  getStatementType(){
// this.model.statementType=this.selectedstType.keyInt;
  }
}
