import { Component, OnInit } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils } from '../../../helpers';
import {
    InvoiceEditModel, AttachmentEditModel, SelectListItemModel, CustomerDetailModel, ItemListItemModel
} from '../../../models';
import { InvoiceService, CustomerService, ItemService, SalesTaxService } from '../../../services';

@Component({
    selector: 'app-invoice-edit',
    templateUrl: './invoice.edit.component.html'
})

export class InvoiceEditComponent implements OnInit {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    modalReference: any;
    model: InvoiceEditModel = new InvoiceEditModel();
    customer: CustomerDetailModel = new CustomerDetailModel();
    customers: Array<SelectListItemModel> = new Array<SelectListItemModel>();
    items: Array<ItemListItemModel> = new Array<ItemListItemModel>();
    selectedItems: Array<ItemListItemModel> = new Array<ItemListItemModel>();
    selectedItemListItemModel : ItemListItemModel=new ItemListItemModel();
    // config = {displayKey:"value",search:true,limitTo:10,height: 'auto',placeholder:'Select Item',
    //                customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!',searchPlaceholder:'Search',
    //                              searchOnKey: 'value',clearOnSelection: false,inputDirection: 'ltr',}
    // selectedCustomer;
    customrlist:any=[{"id":1,"value":"cust1"}];
    selectedCustomer;
    invDate;
    dueDate;
    salesTaxItems;
    customerDiscount;
    isForSale=true;
  
  itemId: Array<ItemListItemModel> = new Array<ItemListItemModel>();
  selectedTax;
    config = {displayKey:"value",search:true,height: 'auto',placeholder:'Select Item',customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!',searchPlaceholder:'Search',searchOnKey: 'value',clearOnSelection: false,inputDirection: 'ltr',}
    // customers : any=[];
    constructor(private router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private appUtils: AppUtils,
        private invoiceService: InvoiceService,
        private customerService: CustomerService,
        private taxService:SalesTaxService,
        private itemService: ItemService) {
        this.route.params.subscribe((params) => {
            this.model.id = params['id'];
        });
    }

    ngOnInit() {
        this.loadCustomers();
        this.loadTaxes();
        this.loadItems();
        this.loadInvoice();
    }

    loadCustomers() {
        this.blockUI.start();
        this.customerService.getSelectItems()
            .subscribe((data) => {
                this.blockUI.stop();
                this.customers=[];
                Object.assign(this.customers, data);
            },
                error => {
                    this.blockUI.stop();
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
    }

    loadInvoice() {
        this.blockUI.start();
        this.invoiceService.getForEdit(this.model.id).subscribe(
            (data: any) => {
                this.blockUI.stop();
                Object.assign(this.model, data);
                console.log("editInvoice",this.model)

                var qdt=new Date(this.model.invoiceDate)
                this.invDate={ day: qdt.getDate(), month: qdt.getMonth()+1, year: qdt.getFullYear()};
  
                var expdt=new Date(this.model.dueDate);
                this.dueDate={ day: expdt.getDate(), month: expdt.getMonth()+1, year: expdt.getFullYear()};
                

                if (!this.model.attachments || this.model.attachments.length === 0) {
                    const attachmentFile = new AttachmentEditModel();
                    this.model.attachments.push(attachmentFile);
                }

                this.getCustomerDetail();
                this.updateSelectedItems();
               // this.updateTotalAmount();
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

    
    newRow(){
        
        console.log("selerow",this.selectedItems)
        if(this.selectedItems.length == 0)
        {
            this.initiateGrid();
        }
        else if(this.selectedItems[this.selectedItems.length-1].id!=0){
            this.initiateGrid();
        }
        else{
            this.toastr.error("Please select an item")
        }
     
    }

    initiateGrid(){
        
      this.selectedItems.push({"description": "",
      "id": 0,
      "isTaxable": false,
      "itemTypeName": "",
      "name": "Select Item",
      "price": 0.00,
      "qty": 1,
      "rate": 0.00,
      "salesTaxId": null,
      "status": 1,
      "taxPrice":0.00,
      "taxCode": null,
      "bankAccountId":null,
      "taxBankAccountId":null,
      "lineAmount":null,
      "taxPercentage": null});

    }

    changeInvoiceDate(){
        
        console.log("quotatindate",this.invDate);
        const jsDate = new Date(this.invDate.year, this.invDate.month - 1, this.invDate.day + 1);
        this.model.invoiceDate=jsDate.toISOString();
       }
    
       changeDuedate(){
        
        console.log("quotatindate",JSON.stringify(this.dueDate));
        const jsDate = new Date(this.dueDate.year, this.dueDate.month - 1, this.dueDate.day + 1);
        this.model.dueDate=jsDate.toISOString();
       }
    

    updateSelectedItems() {
     
        if (this.items.length === 0 || this.model.items.length === 0) {
            return;
        }
    
        const tempArray = new Array<ItemListItemModel>();
         const tempTax=[]
       // this.model.totalAmount = 0;
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
                 item.bankAccountId=invoiceItem.bankAccountId;
                 item.taxBankAccountId=invoiceItem.taxBankAccountId;
                 
                 tempArray.push(item);
    
               // this.model.totalAmount += invoiceItem.rate;
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
        this.selectedTax=tempTax;
        console.log("bindselecteditem",this.itemId);
    }
    loadItems() {
        this.blockUI.start();
        this.itemService.getAllActiveOnly()
            .subscribe((data: any) => {
                this.blockUI.stop();
                if (!data || data.length === 0) {
                    return;
                }
                this.items = data;
                this.updateSelectedItems();
            },
                error => {
                    this.blockUI.stop();
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
    }

    addNewAttachment() {
        let flag: Boolean = true;
        this.model.attachments.map((item) => {
            if (!item.fileName) {
                flag = false;
            }
        });

        if (!flag) {
            this.toastr.error('Please upload file to continue');
            return;
        }

        const attachmentFile = new AttachmentEditModel();
        this.model.attachments.push(attachmentFile);
    }

    onSelectFile(event: any, index: number) {
        if (!event.target.files
            || event.target.files.length === 0) {
            return;
        }

        const attachmentFile = this.model.attachments[this.model.attachments.length - 1];

        attachmentFile.originalFileName = event.target.files[0].name;

        if (!attachmentFile.title) {
            attachmentFile.title = attachmentFile.originalFileName;
        }
        const file = event.target.files.item(0);
        this.uploadAttachment(file, attachmentFile);
    }

    uploadAttachment(file: any, attachment: AttachmentEditModel) {
        this.invoiceService.uploadAttachmentFile(file)
            .subscribe(
                (event: HttpEvent<any>) => {
                    switch (event.type) {
                        case HttpEventType.UploadProgress:
                            const percentDone = Math.round(100 * event.loaded / event.total);
                            attachment.uploadedPercent = percentDone;
                            break;
                        case HttpEventType.Response:
                            attachment.fileName = event.body.fileName;
                            attachment.originalFileName = file.name;
                            break;
                        default:
                            console.log(`File "${file.name}" surprising upload event: ${event.type}.`);
                    }
                },
                (error) => {
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
    }

    removeAttachment(documentFile: AttachmentEditModel) {
        if (this.model.attachments.length === 1) {
            this.model.attachments[0] = new AttachmentEditModel();
            return;
        }
        const itemIndex = this.model.attachments.indexOf(documentFile);
        this.model.attachments.splice(itemIndex, 1);
    }

    getCustomerDetail() {
        
        
        if (this.model.customerId === null
            || this.model.customerId === '') {
            this.model.phone = '';
            this.model.email = '';
            this.model.invoiceNumber = '';
            this.model.discount = 0;
            return;
        }
  
        this.customerService.getDetail(Number(this.model.customerId))
            .subscribe(
                (data) => {
                    Object.assign(this.customer, data);
                    var custTemp= {
                      "keyInt": this.customer.id,
                      "keyString": null,
                      "discount":this.customer.discount,
                      "value": this.customer.firstName+" "+this.customer.middleName+" "+this.customer.lastName
                    }
                    this.selectedCustomer=custTemp;
                    
                    console.log("cust",this.selectedCustomer)
                    this.model.phone = this.customer.phone;
                    this.model.email = this.customer.email;
  
                    if (!this.customer.discount) {
                        this.customer.discount = 0;
                    }else{
                        this.customerDiscount=this.customer.discount;
                    }
                   // this.updateTotalAmount();
  
                });
              
    }
  
  
    getCustomerDetailOnSelect() {
      
      if(this.selectedCustomer!=undefined){
        this.model.customerId=this.selectedCustomer.keyInt;
      if (this.model.customerId === null
          || this.model.customerId === '') {
          this.model.phone = '';
          this.model.email = '';
          this.model.invoiceNumber = '';
          this.model.discount = 0;
          return;
      }
  
      this.customerService.getDetail(Number(this.model.customerId))
          .subscribe(
              (data) => {
                  Object.assign(this.customer, data);
                  var custTemp= {
                    "keyInt": this.customer.id,
                    "keyString": null,
                    "value": this.customer.firstName+" "+this.customer.middleName+" "+this.customer.lastName
                  }
                  this.selectedCustomer=custTemp;
                  
                  console.log("cust",this.selectedCustomer)
                  this.model.phone = this.customer.phone;
                  this.model.email = this.customer.email;
  
                  if (!this.customer.discount) {
                    this.customer.discount = 0;
                }else{
                    this.customerDiscount=this.customer.discount;
                }
  
              });
            }
  }
    onItemSelectionDone() {
        if (this.selectedItems.length > 0) {
            this.updateTotalAmount();
        } else {
            this.model.totalAmount = null;
        }
    }

    deleteItem(index: number) {
        this.selectedItems.splice(index, 1);
        this.updateTotalAmount();
    }

    updateTotalAmount() {
      
        this.model.totalAmount = 0;
        this.model.subTotal = 0;
        this.model.tax = 0;
        this.selectedItems.map((item: ItemListItemModel) => {
            if (item.taxPercentage != null) {
                this.model.tax += (item.price * item.taxPercentage) / 100;
                // this.model.tax += (item.rate * item.taxPercentage) / 100;
            }
            this.model.totalAmount += item.price;
            this.model.subTotal+=item.price;
            //this.model.totalAmount += item.rate;
        });

        if (this.customer.discount != null) {
            this.model.discount = this.model.totalAmount * this.customer.discount / 100;
            this.model.totalAmount -= this.model.discount;
        }


        this.model.totalAmount = this.model.totalAmount + this.model.tax;
        this.model.totalAmount = Math.round(this.model.totalAmount * 100) / 100;
    }


    openItemesModal(content: any) {
        this.modalReference = this.modalService.open(content,
            {
                backdrop: 'static',
                keyboard: false,
                size: 'lg'
            });
    }

    closeItemesModal() {
        this.updateTotalAmount();
        this.modalReference.close();
    }


    submit() {
        
        this.closeAddModal();
         this.model.items=[];
        if (this.selectedItems.length > 0 && this.selectedItems[0].id!=0 ) {
            if(this.selectedItems[this.selectedItems.length-1].id!=0){
            this.selectedItems.map((item) => {
                if(item.salesTaxId!=null){
                    
                    this.model.items.push({"serviceId":item.id,"rate":item.rate,"price":item.price,"taxId":item.salesTaxId,"taxPercentage":item.taxPercentage,"taxPrice":this.model.tax,"quantity":item.qty,"bankAccountId":item.bankAccountId,"taxBankAccountId":item.taxBankAccountId,"lineAmount":item.lineAmount});
                }else{
                    this.model.items.push({"serviceId":item.id,"rate":item.rate,"price":item.price,"taxId":null,"taxPercentage":0,"taxPrice": 0,"quantity":item.qty,"bankAccountId":item.bankAccountId,"taxBankAccountId":0,"lineAmount":item.lineAmount});
                }
               
            });
        }else{
            this.toastr.error('Please select items/services to continue');
            // this.selectedItems.splice(0,this.selectedItems.length-1);
            return;
            
        }
        } else {
            this.toastr.error('Please select items/services to continue');
            return;
        }
    
        if (this.model.attachments.length === 1) {
            const attachment = this.model.attachments[0];
            if (!attachment.fileName) {
                this.model.attachments = new Array<AttachmentEditModel>();
            }
        }
    
        this.blockUI.start();
    
       
        console.log("inveditbody",JSON.stringify(this.model))
        this.invoiceService.edit(this.model).subscribe(
            () => {
                this.blockUI.stop();
                setTimeout(() => {
                    this.router.navigate(['/invoice/manage']);
                }, 100);
                setTimeout(() => {
                    this.toastr.success('Invoice has been added successfully');
                }, 500);
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }

//     submit() {
//         
// console.log('popopopop', this.model);

//         this.model.items = new Array<number>();

//         if (this.selectedItems.length > 0) {
//             this.selectedItems.map((item) => {
//                 this.model.items.push(item.id);
//             });
//         } else {
//             this.toastr.error('Please select items/services to continue');
//             return;
//         }

//         if (this.model.attachments.length === 1) {
//             const attachment = this.model.attachments[0];
//             if (!attachment.fileName) {
//                 this.model.attachments = new Array<AttachmentEditModel>();
//             }
//         }

//         this.blockUI.start();

//         this.invoiceService.edit(this.model).subscribe(
//             () => {
//                 this.blockUI.stop();
//                 setTimeout(() => {
//                     this.router.navigate(['/invoice/manage']);
//                 }, 100);

//                 setTimeout(() => {
//                     this.toastr.success('Invoice has been udpated successfully');
//                 }, 500);
//             },
//             error => {
//                 this.blockUI.stop();
//                 this.appUtils.ProcessErrorResponse(this.toastr, error);
//             });
//     }


openAddModal(content :any){
    
    this.modalReference = this.modalService.open(content,
      {
          backdrop: 'static',
          keyboard: false,
          size: 'lg'
      });
  }

  closeAddModal() {
    this.modalReference.close();
}
}
