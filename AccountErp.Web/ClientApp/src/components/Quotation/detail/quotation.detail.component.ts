import { Component, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { InvoiceDetailModel, ItemListItemModel } from 'src/models';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppUtils } from 'src/helpers';
import { ItemService, SalesTaxService } from 'src/services';
import { QuotationService } from 'src/services/quotation.service.service';
import { QuotationDetailModel } from 'src/models/quotation/QuotationDetailModel';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-quotation.detail',
  templateUrl: './quotation.detail.component.html',
  styleUrls: ['./quotation.detail.component.css']
})
export class QuotationDetailComponent implements OnInit {
  @BlockUI('container-blockui') blockUI: NgBlockUI;
  modalReference: any;
    multiSelectDropdownConfigs: IDropdownSettings;
    model: QuotationDetailModel = new QuotationDetailModel();
    items: Array<ItemListItemModel> = new Array<ItemListItemModel>();
    salesTaxItems;
    selectedItems: Array<ItemListItemModel> = new Array<ItemListItemModel>();
    itemId: Array<ItemListItemModel> = new Array<ItemListItemModel>();
    selectedTax: any=[];
    quotationDate;
    expiryDate;
    
    @ViewChild('htmlData', {static: false}) htmlData: ElementRef;
    constructor(private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private modalService: NgbModal,
        private appUtils: AppUtils,
        private QuotationService: QuotationService,
        private taxService:SalesTaxService,
        private itemService: ItemService) {
        this.route.params.subscribe((params) => {
            this.model.id = params['id'];
        });
    }

    ngOnInit() {
      
        this.loadTaxes();
        this.loadItems();
        this.loadInvoice();
       
    }

    loadInvoice() {
        this.blockUI.start();
        this.QuotationService.getDetail(this.model.id).subscribe(
            (data: any) => {
                this.blockUI.stop();
                Object.assign(this.model, data);
                this.model.createdOn = this.appUtils.getFormattedDate(this.model.createdOn, null);
                this.model.quotationDate=this.appUtils.getFormattedDate(this.model.quotationDate, null);
                this.model.expiryDate=this.appUtils.getFormattedDate(this.model.expiryDate, null);


                this.updateSelectedItems();
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }

  

    confirmDelete(content: any){
        this.modalReference = this.modalService.open(content,
          {
              backdrop: 'static',
              keyboard: false,
              size: 'lg',
              
          });
      }
    
      closeConfirmatioModal() {
        //this.updateTotalAmount();
        this.modalReference.close();
    }

    openDeleteModal(content :any){
        
        this.modalReference = this.modalService.open(content,
          {
              backdrop: 'static',
              keyboard: false,
              size: 'lg'
          });
      }

      closeDeleteModal() {
        this.modalReference.close();
    }

    loadItems() {
        this.itemService.getAllActiveOnly()
            .subscribe((data: any) => {
                if (!data || data.length === 0) {
                    return;
                }

                this.items = data;
                this.loadTaxes();
                this.updateSelectedItems();
            },
                error => {
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
    }

    loadTaxes(){
        this.taxService.getSelectListItems()
            .subscribe((data: any) => {
                if (!data || data.length === 0) {
                    return;
                }

                this.salesTaxItems = data;

                 this.updateSelectedItems();
            },
                error => {
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
    }

    updateSelectedItems() {
     
        if (this.items.length === 0 || this.model.items.length === 0) {
            return;
        }

        const tempArray = new Array<ItemListItemModel>();
         const tempTax=[]
        this.model.amount = 0;
        this.model.items.map((invoiceItem) => {
            const item = this.items.find(x => x.id === invoiceItem.id);
            console.log("itemss",invoiceItem)
            if (item) {
                 item.rate = invoiceItem.rate;
                 item.qty= invoiceItem.quantity;
                 item.rate=invoiceItem.rate;
                 item.price=invoiceItem.price;
                 item.description=invoiceItem.description;
                 item.lineAmount=invoiceItem.lineAmount;
                 tempArray.push(item);

                this.model.amount += invoiceItem.rate;
                //Get item taxes
                
               if(invoiceItem.taxId!=0){
                   const taxitem=this.salesTaxItems.find(x=> x.id===invoiceItem.taxId);
                   tempTax.push(taxitem);

               }else{
                   tempTax.push(null)
               }
            }

            
        });

        this.selectedItems = tempArray;
       // this.itemId=[];
        this.itemId=tempArray;
        this.selectedTax=[];
        this.selectedTax=tempTax;


        console.log("taxngmodel",this.selectedTax);
    }


    delete(): void {
        this.closeDeleteModal();
        this.blockUI.start();
        this.QuotationService.delete(this.model.id).subscribe(
            () => {
                this.blockUI.stop();
                setTimeout(() => {
                    this.router.navigate(['/Quotation/quotation-manage']);
                }, 100);
                setTimeout(() => {
                    this.toastr.success('Quotation has been deleted successfully.');
                }, 500);
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }

    // public openPDF(): void {
    //     const DATA = this.htmlData.nativeElement;
    //     const doc = new jsPDF('p', 'pt', 'a4');
    //     doc.fromHTML(DATA.innerHTML, 15, 15);
    //     doc.output('dataurlnewwindow');
    //   }

    public downloadPDF(): void {
        const doc = new jsPDF('p', 'pt', 'a4');
        // var doc = new jsPDF('p', 'pt', 'letter');
    
        doc.setFontSize(15);
        doc.text('Quotation Detail', 400, 50);
    
        var startDate = new Date(new Date().getFullYear(), 0, 1);
        // this.startDate={ day: startDate.getDate(), month: startDate.getMonth()+1, year: startDate.getFullYear()};
        // const jsbillDate = new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day);
        // this.fromDate=jsbillDate.toDateString();
      
        // var endDate = new Date();
        // this.endDate={ day: endDate.getDate(), month: endDate.getMonth()+1, year: endDate.getFullYear()};
        // const jsduevDate = new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day);
        // this.toDate=jsduevDate.toDateString();
        // doc.text(50, 100, 'Date Range : ' + '' + this.fromDate + ' ' + 'to' + ' ' + this.toDate);
    
        doc.setProperties({
          title: 'Quotation -Detail' + ' ' ,
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
        startY: 500, /* if start position is fixed from top */
        tableLineColor: [4, 6, 7], // choose RGB
          });
          autoTable(doc, {
            html: '#my-table1',
            styles: {
         },
         tableLineWidth: 0.5,
         startY:600,
         tableLineColor: [4, 6, 7], // choose RGB
           });
    
          const DATA = this.htmlData.nativeElement;
          const addFooters = doc => {
            const pageCount = doc.internal.getNumberOfPages();
          
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(8);
            for (let i = 1; i <= pageCount; i++) {
              doc.setPage(i);
              doc.text(510, 780, 'Quotation - Detail ');
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
    // public downloadPDF(): void {
    //     const DATA = this.htmlData.nativeElement;
    //     const doc = new jsPDF('p', 'pt', 'a4');
    //     const handleElement = {
    //       '#editor': function(element, renderer) {
    //         return true;
    //       }
    //     };
    //     doc.fromHTML(DATA.innerHTML, 15, 15, {
    //       'width': 200,
    //       'elementHandlers': handleElement
    //     });
    //     doc.save('Quotation-Detail.pdf');
    //   }

    print() {
       // window.open(location.origin + '/print/invoice/' + this.model.id);
       const DATA = this.htmlData.nativeElement;
       const doc = new jsPDF('p', 'pt', 'a4');
       doc.fromHTML(DATA.innerHTML, 15, 15);
       doc.output('dataurlnewwindow');
    }
}
