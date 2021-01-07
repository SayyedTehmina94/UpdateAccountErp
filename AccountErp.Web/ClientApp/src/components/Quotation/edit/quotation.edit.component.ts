import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { InvoiceEditModel, CustomerDetailModel, SelectListItemModel, ItemListItemModel, AttachmentEditModel } from 'src/models';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbDateNativeUTCAdapter, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppUtils } from 'src/helpers';
import { InvoiceService, CustomerService, ItemService, SalesTaxService } from 'src/services';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { QuotationDetailModel } from 'src/models/quotation/QuotationDetailModel';
import { QuotationItemModel } from 'src/models/quotation/QuotationItemModel';
import { QuotationService } from 'src/services/quotation.service.service';
import { quotationEditModel } from 'src/models/quotation/quotation.Edit.model';

@Component({
  selector: 'app-quotation.edit',
  templateUrl: './quotation.edit.component.html',
  styleUrls: ['./quotation.edit.component.css']
})
export class QuotationEditComponent implements OnInit {
  @BlockUI('container-blockui') blockUI: NgBlockUI;
  modalReference: any;
  
  customer: CustomerDetailModel = new CustomerDetailModel();
 // customers: Array<SelectListItemModel> = new Array<SelectListItemModel>();
  
  customers : any=[];
 
  selectedItems: Array<ItemListItemModel> = new Array<ItemListItemModel>();
  selectedItemListItemModel : ItemListItemModel=new ItemListItemModel();

  model: quotationEditModel = new quotationEditModel();
  items: Array<ItemListItemModel> = new Array<ItemListItemModel>();
  salesTaxItems;
  
  itemId: Array<ItemListItemModel> = new Array<ItemListItemModel>();
  selectedTax;
  config = {displayKey:"value",search:true,disabled:true,height: 'auto',placeholder:'Select Item',customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!',searchPlaceholder:'Search',searchOnKey: 'value',clearOnSelection: false,inputDirection: 'ltr',}
  selectedCustomer;
  customrlist:any=[{"id":1,"value":"cust1"}];
  quotDate;
  expireDate;
  newQuotNumber;
  customerDiscount;
  isForSale=true;

  constructor(private router: Router,
      private route: ActivatedRoute,
      private modalService: NgbModal,
      private toastr: ToastrService,
      private appUtils: AppUtils,
      private QuotationService: QuotationService,
      private customerService: CustomerService,
      private taxService:SalesTaxService,
      private itemService: ItemService) {
      this.route.params.subscribe((params) => {
          this.model.id = params['id'];
      });
  }

  ngOnInit() {
    this.loadTaxes();
      this.loadCustomers();
      this.loadItems();
      this.loadInvoice();
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

initiateGrid(){
    
    // alert("ng oninit called")
//   this.selectedItemListItemModel.id=0;
//   this.selectedItemListItemModel.itemTypeName="";
//   this.selectedItemListItemModel.name="";
//   this.selectedItemListItemModel.rate=0;
//   this.selectedItemListItemModel.taxCode="";
//   this.selectedItemListItemModel.taxPercentage=0;
//   this.selectedItemListItemModel.description="";
//   this.selectedItems.push(this.selectedItemListItemModel);

  this.selectedItems.push({"description": "",
  "id": 0,
  "isTaxable": false,
  "itemTypeName": "",
  "name": "Select Item",
  "price": 0.00,
  "qty": 1,
  "rate": 0.00,
  "salesTaxId": null,
  "taxPrice":0.00,
  "status": 1,
  "taxCode": null,
  "bankAccountId":null,
  "taxBankAccountId":null,
  "lineAmount":null,
  "taxPercentage": null});
}

  loadCustomers() {
      
      this.blockUI.start();
      this.customerService.getSelectItems()
          .subscribe((data) => {
              this.blockUI.stop();
              this.customers=[];
              Object.assign(this.customers, data);
              //this.getCustomerDetail();
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

  loadInvoice() {
      
      this.blockUI.start();
      this.QuotationService.getForEdit(this.model.id).subscribe(
          (data: any) => {
              this.blockUI.stop();
              Object.assign(this.model, data);

            
              var qdt=new Date(this.model.quotationDate)
              this.quotDate={ day: qdt.getDate(), month: qdt.getMonth()+1, year: qdt.getFullYear()};

              var expdt=new Date(this.model.expiryDate);
              this.expireDate={ day: expdt.getDate(), month: expdt.getMonth()+1, year: expdt.getFullYear()};
              

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
    this.QuotationService.uploadAttachmentFile(file)
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

  // uploadAttachment(file: any, attachment: AttachmentEditModel) {
  //     this.invoiceService.uploadAttachmentFile(file)
  //         .subscribe(
  //             (event: HttpEvent<any>) => {
  //                 switch (event.type) {
  //                     case HttpEventType.UploadProgress:
  //                         const percentDone = Math.round(100 * event.loaded / event.total);
  //                         attachment.uploadedPercent = percentDone;
  //                         break;
  //                     case HttpEventType.Response:
  //                         attachment.fileName = event.body.fileName;
  //                         attachment.originalFileName = file.name;
  //                         break;
  //                     default:
  //                         console.log(`File "${file.name}" surprising upload event: ${event.type}.`);
  //                 }
  //             },
  //             (error) => {
  //                 this.appUtils.ProcessErrorResponse(this.toastr, error);
  //             });
  // }

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
          this.model.quotationNumber = '';
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


  getCustomerDetailOnSelect() {
    
    if(this.selectedCustomer!=undefined){
      this.model.customerId=this.selectedCustomer.keyInt;
    if (this.model.customerId === null
        || this.model.customerId === '') {
        this.model.phone = '';
        this.model.email = '';
        this.model.quotationNumber = '';
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

//   submit() {
//       

//       this.model.items = [];
//       //delete this.model.customer;
    
//       if (this.selectedItems.length > 0) {
//           this.selectedItems.map((item) => {
//             
//               var tempItem={
//    "serviceId":item.id,
//    "taxPrice": 0,
//     "rate":item.rate,
//     "price":item.price,
//     "quantity":item.qty,
//     "taxPercentage":item.taxPercentage,
//     "taxId":item.taxId,

   
//               }   
//               this.model.items.push(tempItem);
//           });
//       } else {
//           this.toastr.error('Please select items/services to continue');
//           return;
//       }
//       console.log("editmodel",JSON.stringify(this.model))

//       if (this.model.attachments.length === 1) {
//           const attachment = this.model.attachments[0];
//           if (!attachment.fileName) {
//               this.model.attachments = new Array<AttachmentEditModel>();
//           }
//       }

//       this.blockUI.start();

//        // delete this.model.c
//       this.QuotationService.edit(this.model).subscribe(
//           () => {
//               this.blockUI.stop();
//               setTimeout(() => {
//                   this.router.navigate(['Quotation/quotation-manage']);
//               }, 100);

//               setTimeout(() => {
//                   this.toastr.success('Quotation has been udpated successfully');
//               }, 500);
//           },
//           error => {
//               this.blockUI.stop();
//               this.appUtils.ProcessErrorResponse(this.toastr, error);
//           });
//   }

submit() {
    this.closeAddModal();
     this.model.items=[];
    if (this.selectedItems.length > 0 && this.selectedItems[0].id!=0 ) {
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
            this.model.attachments = new Array<AttachmentEditModel>();
        }
    }

    this.blockUI.start();

   console.log("editmodel",JSON.stringify(this.model));

    this.QuotationService.edit(this.model).subscribe(
        () => {
            this.blockUI.stop();
            setTimeout(() => {
                this.router.navigate(['/Quotation/quotation-manage']);
            }, 100);
            setTimeout(() => {
                this.toastr.success('Quotation has been added successfully');
            }, 500);
        },
        error => {
            this.blockUI.stop();
            this.appUtils.ProcessErrorResponse(this.toastr, error);
        });
}

changeQuotDate(){
    
    console.log("quotatindate",this.quotDate);
    const jsDate = new Date(this.quotDate.year, this.quotDate.month - 1, this.quotDate.day + 1);
    this.model.quotationDate=jsDate.toISOString();
   }

   changeExpire(){
    
    console.log("quotatindate",this.expireDate);
    const jsDate = new Date(this.expireDate.year, this.expireDate.month - 1, this.expireDate.day + 1);
    this.model.expiryDate=jsDate.toISOString();
   }

   getNewInvoiceNumber() {
    this.blockUI.start();
    this.QuotationService.getNewQuotationNumber()
        .subscribe((data) => {
            
            this.blockUI.stop();
            console.log("inv",data)
            var today=new Date();
            this.newQuotNumber="QUO-"+today.getFullYear().toString().match(/\d{2}$/)+"-"+data;
           
        },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
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
