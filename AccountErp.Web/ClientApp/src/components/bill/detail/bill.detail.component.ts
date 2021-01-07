import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils } from '../../../helpers';
import { ItemListItemModel, BillDetailModel } from '../../../models';
import { ItemService, BillService, SalesTaxService } from '../../../services';
import autoTable from 'jspdf-autotable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare let jsPDF;
@Component({
    selector: 'app-bill-detail',
    templateUrl: './bill.detail.component.html'
})

export class BillDetailComponent implements OnInit {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    model: BillDetailModel = new BillDetailModel();
    items: Array<ItemListItemModel> = new Array<ItemListItemModel>();
    selectedItems: Array<ItemListItemModel> = new Array<ItemListItemModel>();
    isModelLoaded = false;
    salesTaxItems;
    itemId: Array<ItemListItemModel> = new Array<ItemListItemModel>();
    selectedTax;
    disabled;
    @ViewChild('htmlData', {static: false}) htmlData: ElementRef;
    modalReference: any;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private appUtils: AppUtils,
        private billService: BillService,
        private taxService:SalesTaxService,
        private itemService: ItemService,
        private modalService: NgbModal) {
        this.route.params.subscribe((params) => {
            this.model.id = params['id'];
        });
    }

    ngOnInit() {
       
        this.loadServices();
        this.loadTaxes();
        this.loadBill();
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


    loadBill() {
        this.blockUI.start();
        this.billService.getDetail(this.model.id).subscribe(
            (data: any) => {
                this.blockUI.stop();
                Object.assign(this.model, data);
                this.updateSelectedItems();
                if (this.model.dueDate) {
                    this.model.dueDate = this.appUtils.getFormattedDate(this.model.dueDate, null);
                }
                this.isModelLoaded = true;
            },
            error => {
                this.blockUI.stop();
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

    loadServices() {
        this.itemService.getAllActiveOnly()
            .subscribe((data: any) => {
                if (!data || data.length === 0) {
                    return;
                }

                this.items = data;

                this.updateSelectedItems();
            },
                error => {
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
    }

    // updateSelectedItems() {
    //     if (this.items.length === 0 || this.model.items.length === 0) {
    //         return;
    //     }

    //     const tempArray = new Array<ItemListItemModel>();

    //     this.model.items.map((serviceId) => {
    //         const service = this.items.find(x => x.id === serviceId);
    //         if (service) {
    //             tempArray.push(service);
    //         }
    //     });

    //     this.selectedItems = tempArray;
    // }

    public downloadPDF(): void {
        const doc = new jsPDF('p', 'pt', 'a4');
        // var doc = new jsPDF('p', 'pt', 'letter');
    
        doc.setFontSize(15);
        doc.text('Bill Detail', 400, 50);
    
        var startDate = new Date(new Date().getFullYear(), 0, 1);
    
        doc.setProperties({
          title: 'Bill - Detail' + ' ' ,
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
              doc.text(510, 780, 'Bill - Detail ');
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

    updateSelectedItems() {
             if (this.items.length === 0 || this.model.items.length === 0) {
                 return;
             }
           
             const tempArray = new Array<ItemListItemModel>();
              const tempTax=[]
             //this.model.totalAmount = 0;
             this.model.items.map((itemId) => {
                 const item = this.items.find(x => x.id === itemId.id);
                 console.log("itemss",itemId)
                 if (item) {
                      item.rate = itemId.rate;
                      item.qty= itemId.quantity;
                      item.rate=itemId.rate;
                      item.price=itemId.price;
                      item.description=itemId.description;
                      item.lineAmount=itemId.lineAmount;
                      tempArray.push(item);
           
                    // this.model.totalAmount += itemId.rate;
                     //Get item taxes
                    if(itemId.taxId!=0){
                        const taxitem=this.salesTaxItems.find(x=> x.id===itemId.taxId);
                        tempTax.push(taxitem);
           
                    }else{
                        tempTax.push(null);
                    }
                 }
           
                 
             });
           
            //  this.selectedItems =[];
             this.selectedItems = tempArray;
             //this.itemId=[];
             this.itemId=tempArray;
             this.selectedTax=tempTax;
             console.log("bindselecteditem",this.itemId);
           }

    delete(): void {
        this.closeDeleteModal();
        this.blockUI.start();
        this.billService.delete(this.model.id).subscribe(
            () => {
                this.blockUI.stop();
                setTimeout(() => {
                    this.router.navigate(['/bill/manage']);
                }, 100);
                setTimeout(() => {
                    this.toastr.success('Bill has been deleted successfully');
                }, 500);
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }

    print() {
        let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=0,height=0,left=-1000,top=-1000`;
        window.open(location.origin + '/print/bill/' + this.model.id, params);
    }
}

