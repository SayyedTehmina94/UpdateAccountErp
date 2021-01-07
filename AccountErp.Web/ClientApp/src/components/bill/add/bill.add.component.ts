import { Component, OnInit } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils } from '../../../helpers';
import {
    BillAddModel, AttachmentAddModel, SelectListItemModel, ItemListItemModel,
    VendorPersonalInfoModel
} from '../../../models';
import { BillService, VendorService, ItemService } from '../../../services';


@Component({
    selector: 'app-bill-add',
    templateUrl: './bill.add.component.html'
})

export class BillAddComponent implements OnInit {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    modalReference: any;
    model: BillAddModel = new BillAddModel();
    vendor: VendorPersonalInfoModel = new VendorPersonalInfoModel();
    vendors: Array<SelectListItemModel> = new Array<SelectListItemModel>();
    selectedItems: Array<ItemListItemModel> = new Array<ItemListItemModel>();
    vendorId;
    items: Array<ItemListItemModel> = new Array<ItemListItemModel>();
    selectedVendor;
    selectedItemListItemModel : ItemListItemModel=new ItemListItemModel();
    config = {displayKey:"value",search:true,limitTo:10,height: 'auto',placeholder:'Select Vendor',customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!',searchPlaceholder:'Search',searchOnKey: 'value',clearOnSelection: false,inputDirection: 'ltr',}
    itemId: Array<ItemListItemModel> = new Array<ItemListItemModel>();
    selectedTax=[];
    Items: Array<ItemListItemModel> = new Array<ItemListItemModel>();
    salesTaxItems;
    newBillNumber;
    billDate;
    dueDate;
    customerDiscount;
    isForSale=false;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private appUtils: AppUtils,
        private billService: BillService,
        private itemService: ItemService,
        private vendorService: VendorService) {

    }

    ngOnInit() {
        this.setDefaultDate();
        this.getNewBillNumber();
        this.loadVendors();

        if (!this.model.attachments || this.model.attachments.length === 0) {
            const attachmentFile = new AttachmentAddModel();
            this.model.attachments.push(attachmentFile);
        }

        this.route.params.subscribe((params) => {
            if(params['id']){
                this.vendorId = params['id'];
                this.model.vendorId = params['id'];
           
               this.getVendorDetailForVenoders();
            }
            
        });
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

    onVendorSelected() {
        this.getVendorDetail();
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
                    if (!this.vendor.discount) {
                        this.vendor.discount = 0;
                    }else{
                        this.customerDiscount=this.vendor.discount;
                    }
                },
                error => {
                    this.blockUI.stop();
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                }
            );
        }
    }

    getVendorDetailForVenoders() {
       
        this.blockUI.start();
        this.vendor = new VendorPersonalInfoModel();
        this.vendorService.getPersonalInfo(Number(this.model.vendorId))
            .subscribe(
                (data) => {
                    this.blockUI.stop();
                    Object.assign(this.vendor, data);
                    var custTemp= {
                        "keyInt": this.vendor.id,
                        "keyString": null,
                        "value": this.vendor.name
                      }
                      this.selectedVendor=custTemp;
                      this.customerDiscount=this.vendor.discount;
                    //   this.model.vendorId=Number(this.vendor.id);
                },
                error => {
                    this.blockUI.stop();
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                }
            );
        
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
        this.billService.uploadAttachmentFile(file)
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

    removeAttachment(file: AttachmentAddModel) {
        if (this.model.attachments.length === 1) {
            this.model.attachments[0] = new AttachmentAddModel();
            return;
        }
        const itemIndex = this.model.attachments.indexOf(file);
        this.model.attachments.splice(itemIndex, 1);
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

        if (this.vendor.discount != null) {
            this.model.discount = this.model.totalAmount * this.vendor.discount / 100;
            this.model.totalAmount -= this.model.discount;
        }


        this.model.totalAmount = this.model.totalAmount + this.model.tax;
        this.model.totalAmount = Math.round(this.model.totalAmount * 100) / 100;
    }

    openItemsModal(content: any) {
        this.modalReference = this.modalService.open(content,
            {
                backdrop: 'static',
                keyboard: false,
                size: 'lg'
            });
    }

    closeItemsModal() {
        this.updateTotalAmount();
        this.modalReference.close();
    }

    submit() {
        this.closeAddModal();

        if(this.selectedVendor == undefined)
        {
            this.toastr.error('Please select Vendor to continue');
            return;
        }
        else

        this.model.items=[];
        if (this.selectedItems.length > 0 && this.selectedItems[0].id!=0 ) {
            if(this.selectedItems[this.selectedItems.length-1].id!=0){
            this.selectedItems.map((item) => {
                console.log("taxPrice",item.taxPrice)
                if(item.salesTaxId!=null){
                    this.model.items.push({"itemId":item.id,"rate":item.rate,"price":item.price,"taxId":item.salesTaxId,"taxPercentage":item.taxPercentage,"taxPrice":this.model.tax,"quantity":item.qty,"bankAccountId":item.bankAccountId,"taxBankAccountId":item.taxBankAccountId,"lineAmount":item.lineAmount});
                }else{
                    this.model.items.push({"itemId":item.id,"rate":item.rate,"price":item.price,"taxId":null,"taxPercentage":0,"taxPrice": 0,"quantity":item.qty,"bankAccountId":item.bankAccountId,"taxBankAccountId":0,"lineAmount":item.lineAmount});
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

        console.log("billModel",JSON.stringify(this.model));

        this.billService.add(this.model).subscribe(
            () => {
                this.blockUI.stop();
                setTimeout(() => {
                    this.router.navigate(['/bill/manage']);
                }, 100);

                setTimeout(() => {
                    this.toastr.success('Bill & expense has been added successfully');
                }, 500);
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }

  

    // updateSelectedItems() {

    //     if (this.items.length === 0
    //         || this.model.items.length === 0) {
    //         return;
    //     }

    //     const tempArray = new Array<ItemListItemModel>();

    //     this.model.items.map((itemId) => {
    //         const service = this.items.find(x => x.id === itemId);
    //         if (service) {
    //             tempArray.push(service);
    //         }
    //     });
    //     console.log(tempArray);
    //     this.selectedItems = tempArray;
    // }

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

    // initiateGrid(){
    //     // alert("ng oninit called")
    //   this.selectedItemListItemModel.id=0;
    //   this.selectedItemListItemModel.itemTypeName="";
    //   this.selectedItemListItemModel.name="";
    //   this.selectedItemListItemModel.rate=0;
    //   this.selectedItemListItemModel.taxCode="";
    //   this.selectedItemListItemModel.taxPercentage=0;
    //   this.selectedItemListItemModel.description="";
    //   this.selectedItems.push(this.selectedItemListItemModel);
  
    //   console.log("ddl",this.itemId)
    // }

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

    changeBillDate(){
  
        console.log("quotatindate",this.billDate);
        const jsDate = new Date(this.billDate.year, this.billDate.month - 1, this.billDate.day + 1);
        this.model.billDate=jsDate.toISOString();
       }
    
       changeDuedate(){
        console.log("quotatindate",JSON.stringify(this.dueDate));
        const jsDate = new Date(this.dueDate.year, this.dueDate.month - 1, this.dueDate.day + 1);
        this.model.dueDate=jsDate.toISOString();
       }

    getNewBillNumber() {
        this.blockUI.start();
        this.billService.getNewBillNumber()
            .subscribe((data) => {
                this.blockUI.stop();
                console.log("inv",data)
                var today=new Date();
                this.newBillNumber="BNO-"+today.getFullYear().toString().match(/\d{2}$/)+"-"+data;
               
            },
                error => {
                    this.blockUI.stop();
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
    }

    setDefaultDate(){
        
        var qdt=new Date()
        this.billDate={ day: qdt.getDate(), month: qdt.getMonth()+1, year: qdt.getFullYear()};
        const jsbillDate = new Date(this.billDate.year, this.billDate.month - 1, this.billDate.day + 1);
        this.model.billDate=jsbillDate.toISOString();

        this.dueDate={ day: qdt.getDate()+1, month: qdt.getMonth()+1, year: qdt.getFullYear()};
        const jsduevDate = new Date(this.dueDate.year, this.dueDate.month - 1, this.dueDate.day + 1);
        this.model.dueDate=jsduevDate.toISOString();
    }
    
    openAddModal(content :any){
      //  
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