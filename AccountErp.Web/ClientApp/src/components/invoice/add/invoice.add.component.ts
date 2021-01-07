import { Component, OnInit } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils } from '../../../helpers';
import {
    SelectListItemModel, InvoiceAddModel, AttachmentAddModel, ItemListItemModel, CustomerDetailModel
} from '../../../models';
import { InvoiceService, CustomerService, ItemService, SalesTaxService } from '../../../services';
import { QuotationService } from 'src/services/quotation.service.service';
import { quotationEditModel } from 'src/models/quotation/quotation.Edit.model';

@Component({
    selector: 'app-invoice-add',
    templateUrl: './invoice.add.component.html'
})

export class InvoiceAddComponent implements OnInit {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    modalReference: any;
    disableCustomerId = false;
    model: InvoiceAddModel = new InvoiceAddModel();
    qtmodel:quotationEditModel=new quotationEditModel();
    customer: CustomerDetailModel = new CustomerDetailModel();
   // customers: Array<SelectListItemModel> = new Array<SelectListItemModel>();
    Items: Array<ItemListItemModel> = new Array<ItemListItemModel>();
    selectedItems: Array<ItemListItemModel> = new Array<ItemListItemModel>();
    customers : any=[];
    selectedItemListItemModel : ItemListItemModel=new ItemListItemModel();
    config = {displayKey:"value",search:true,limitTo:10,height: 'auto',placeholder:'Select Customer',customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!',searchPlaceholder:'Search',searchOnKey: 'value',clearOnSelection: false,inputDirection: 'ltr',}
    selectedCustomer;
    customrlist:any=[{"id":1,"value":"cust1"}];
    invoiceDate;
    dueDate;
    newInvNumber;
    qtnNumber;
    salesTaxItems;
    isForSale=true;
  
    itemId: Array<ItemListItemModel> = new Array<ItemListItemModel>();
    selectedTax=[];
    customerDiscount;
   
    constructor(private router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private appUtils: AppUtils,
        private invoiceService: InvoiceService,
        private customerService: CustomerService,
        private quotationService:QuotationService,
        private taxService:SalesTaxService,
        private itemService: ItemService) {

            this.route.params.subscribe((params) => {
                if(params['id']){
                    this.qtnNumber = params['id'];
                    this.loadQuotation();
                    this.loadTaxes();
                    this.getCustomerDetailForQuotation();
                }
                
            });

        this.route.queryParams.subscribe((params) => {
            if (params['cId']) {
                this.model.customerId = params['cId'];
                this.disableCustomerId = true;
                this.getCustomerByCustId();
            }
        });
    }

    ngOnInit() {
        this.setDefaultDate();
        this.getNewInvoiceNumber();
        this.loadCustomers();
      

        this.loadItems();
       

        if (!this.model.attachments || this.model.attachments.length === 0) {
            const attachmentFile = new AttachmentAddModel();
            this.model.attachments.push(attachmentFile);
        }
    }
    getCustomerByCustId(){
        this.customerService.getDetail(Number(this.model.customerId))
        .subscribe(
            (data) => {
                debugger
               
                Object.assign(this.customer, data);
                let custName =  this.customer.firstName +" "+ this.customer.middleName  +" "+ this.customer.lastName;
                this.selectedCustomer = {"keyInt":this.model.customerId,"value": custName}
                this.model.phone = this.customer.phone;
                this.model.email = this.customer.email;

                if (!this.customer.discount) {
                    this.customer.discount = 0;
                }else{
                    this.customerDiscount=this.customer.discount;
                }

                this.updateTotalAmount();
            });
    }

    setDefaultDate(){
        
        var qdt=new Date()
        this.invoiceDate={ day: qdt.getDate(), month: qdt.getMonth()+1, year: qdt.getFullYear()};
        const jsinvDate = new Date(this.invoiceDate.year, this.invoiceDate.month - 1, this.invoiceDate.day + 1);
        this.model.invoiceDate=jsinvDate.toISOString();

        this.dueDate={ day: qdt.getDate()+1, month: qdt.getMonth()+1, year: qdt.getFullYear()};
        const jsduevDate = new Date(this.dueDate.year, this.dueDate.month - 1, this.dueDate.day + 1);
        this.model.dueDate=jsduevDate.toISOString();
    }

    loadCustomers() {
        this.blockUI.start();
        this.customerService.getSelectItems()
            .subscribe((data) => {
                
                this.blockUI.stop();
                console.log("customers",this.customers)
               
                this.customers=[];
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


    loadItems() {
        this.blockUI.start();
        this.itemService.getAllActiveOnly()
            .subscribe((data: any) => {
                this.blockUI.stop();
                if (!data || data.length === 0) {
                    return;
                }
                this.Items = data;
            },
                error => {
                    this.blockUI.stop();
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
    }

    deleteItem(index: number) {
        this.selectedItems.splice(index, 1);
        this.updateTotalAmount();
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

        const attachmentFile = new AttachmentAddModel();
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

    uploadAttachment(file: any, attachment: AttachmentAddModel) {
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

    removeAttachment(documentFile: AttachmentAddModel) {
        if (this.model.attachments.length === 1) {
            this.model.attachments[0] = new AttachmentAddModel();
            return;
        }
        const itemIndex = this.model.attachments.indexOf(documentFile);
        this.model.attachments.splice(itemIndex, 1);
    }

    getCustomerDetail() {
        
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
                    this.model.phone = this.customer.phone;
                    this.model.email = this.customer.email;

                    if (!this.customer.discount) {
                        this.customer.discount = 0;
                    }else{
                        this.customerDiscount=this.customer.discount;
                    }

                    this.updateTotalAmount();
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

    changeInvoiceDate(){
        
        console.log("quotatindate",this.invoiceDate);
        const jsDate = new Date(this.invoiceDate.year, this.invoiceDate.month - 1, this.invoiceDate.day + 1);
        this.model.invoiceDate=jsDate.toISOString();
       }
    
       changeDuedate(){
        
        console.log("quotatindate",this.dueDate);
        const jsDate = new Date(this.dueDate.year, this.dueDate.month - 1, this.dueDate.day + 1);
        this.model.dueDate=jsDate.toISOString();
       }

       newRow(){
        console.log("selerow",this.selectedItems)
        if(this.selectedItems[this.selectedItems.length-1].id!=0){
            this.initiateGrid();
        }
        else{
            this.toastr.error("Please select an item")
        }
     
    }

    submit() {
        
        this.closeAddModal();
         this.model.items=[];
        if(this.selectedCustomer == undefined)
        {
            this.toastr.error('Please select Customer to continue');
            return;
        }
        else if (this.selectedItems.length > 0 && this.selectedItems[0].id!=0 ) {
            if(this.selectedItems[this.selectedItems.length-1].id!=0){
            this.selectedItems.map((item) => {
               
                if(item.salesTaxId!=null){
                    this.model.items.push({"serviceId":item.id,"rate":item.rate,"price":item.price,"taxId":item.salesTaxId,"taxPercentage":item.taxPercentage,"taxPrice":this.model.tax,"quantity":item.qty,"bankAccountId":item.bankAccountId,"taxBankAccountId":item.taxBankAccountId,"lineAmount":item.lineAmount});
                }else{
                    this.model.items.push({"serviceId":item.id,"rate":item.rate,"price":item.price,"taxId":null,"taxPercentage":item.taxPercentage,"taxPrice": 0,"quantity":item.qty,"bankAccountId":item.bankAccountId,"taxBankAccountId":0,"lineAmount":item.lineAmount});
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
                this.model.attachments = new Array<AttachmentAddModel>();
            }
        }

        this.blockUI.start();

       

        this.invoiceService.add(this.model).subscribe(
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
    openCustomerModal(content: any){
        this.modalReference = this.modalService.open(content,
          {
              backdrop: 'static',
              keyboard: false,
              size: 'lg'
          });
      }
  
      closeCustomerModal() {
        //this.updateTotalAmount();
        this.modalReference.close();
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
      "bankAccountId":null,
      "taxBankAccountId":null,
      "taxCode": null,
      "lineAmount":null,
      "taxPercentage": null});

    }
  
//     initiateGrid(){
//       
//       // alert("ng oninit called")
//     this.selectedItemListItemModel.id=0;
//     this.selectedItemListItemModel.itemTypeName="";
//     this.selectedItemListItemModel.name="";
//     this.selectedItemListItemModel.rate=0;
//     this.selectedItemListItemModel.taxCode="";
//     this.selectedItemListItemModel.taxPercentage=0;
//     this.selectedItemListItemModel.description="";
//     this.selectedItems.push(this.selectedItemListItemModel);

//     console.log("ddl",this.itemId)
//   }

  getNewInvoiceNumber() {
    this.blockUI.start();
    this.invoiceService.getNewInvoiceNumber()
        .subscribe((data) => {
            
            this.blockUI.stop();
            console.log("inv",data)
            var today=new Date();
            this.newInvNumber="INV-"+today.getFullYear().toString().match(/\d{2}$/)+"-"+data;
           
        },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
}

loadQuotation() {
    
    this.blockUI.start();
    this.quotationService.getForEdit(this.qtnNumber).subscribe(
        (data: any) => {
            this.blockUI.stop();
            Object.assign(this.qtmodel, data);
            Object.assign(this.model, data);

            
            this.model.customerId=this.qtmodel.customerId;
            this.model.invoiceDate=this.qtmodel.quotationDate;
            var qdt=new Date(this.qtmodel.quotationDate)
            this.invoiceDate={ day: qdt.getDate(), month: qdt.getMonth()+1, year: qdt.getFullYear()};

            this.model.dueDate=this.qtmodel.expiryDate;
            var expdt=new Date(this.qtmodel.expiryDate);
            this.dueDate={ day: expdt.getDate(), month: expdt.getMonth()+1, year: expdt.getFullYear()};

            

            
            

            if (!this.qtmodel.attachments || this.qtmodel.attachments.length === 0) {
                const attachmentFile = new AttachmentAddModel();
                this.model.attachments.push(attachmentFile);
            }

            this.getCustomerDetailForQuotation();
            this.updateSelectedItems();
            this.updateTotalAmount();
        },
        error => {
            this.blockUI.stop();
            this.appUtils.ProcessErrorResponse(this.toastr, error);
        });
}

updateSelectedItems() {
   
  if (this.Items.length === 0 || this.model.items.length === 0) {
      return;
  }

  const tempArray = new Array<ItemListItemModel>();
   const tempTax=[]
  this.model.totalAmount = 0;
  this.model.items.map((invoiceItem) => {
      const item = this.Items.find(x => x.id === invoiceItem.id);
      console.log("itemss",invoiceItem)
      if (item) {
           item.rate = invoiceItem.rate;
           item.qty= invoiceItem.quantity;
           item.rate=invoiceItem.rate;
           item.price=invoiceItem.price;
           item.description=invoiceItem.description;
           
           tempArray.push(item);

          this.model.totalAmount += invoiceItem.rate;
          //Get item taxes
          
         if(invoiceItem.taxId!=0){
             const taxitem=this.salesTaxItems.find(x=> x.id===invoiceItem.taxId);
             tempTax.push(taxitem);

         }else{
             tempTax.push(null);
         }
      }

      
  });

  this.selectedItems = tempArray;
 // this.itemId=[];
  this.itemId=tempArray;
  this.selectedTax=tempTax;
  console.log("bindselecteditem",this.itemId);
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

getCustomerDetailForQuotation() {
    
  
       // this.model.customerId=this.selectedCustomer.keyInt;
    
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
                this.selectedCustomer=[];
                var custTemp= {
                    "keyInt": this.customer.id,
                    "keyString": null,
                    "value": this.customer.firstName+" "+this.customer.middleName+" "+this.customer.lastName
                  }
                  this.selectedCustomer=custTemp;
                this.model.phone = this.customer.phone;
                this.model.email = this.customer.email;
                this.customerDiscount=this.customer.discount;

                if (!this.customer.discount) {
                    this.customer.discount = 0;
                }

                this.updateTotalAmount();
            });
        
}

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
