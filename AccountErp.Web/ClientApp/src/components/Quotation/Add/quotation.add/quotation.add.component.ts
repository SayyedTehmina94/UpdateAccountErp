import { Component, OnInit, ViewChild } from '@angular/core';
import { AttachmentAddModel, ItemListItemModel, InvoiceAddModel, CustomerDetailModel, SelectListItemModel } from 'src/models';
import { HttpEventType, HttpEvent } from '@angular/common/http';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppUtils } from 'src/helpers';
import { InvoiceService, CustomerService, ItemService } from 'src/services';
import { quotationAddModel } from 'src/models/quotation/quotation.add.model';
import { quotationItemAddModel } from 'src/models/quotation/quotation.item.add.model';
import { QuotationService } from 'src/services/quotation.service.service';

@Component({
    selector: 'app-quotation-add',
    templateUrl: './quotation.add.component.html',

})
export class QuotationAddComponent implements OnInit {

    @BlockUI('container-blockui') blockUI: NgBlockUI;
    modalReference: any;
    disableCustomerId = false;
    model: quotationAddModel = new quotationAddModel();
    customer: CustomerDetailModel = new CustomerDetailModel();
    //customers: Array<SelectListItemModel> = new Array<SelectListItemModel>();
    customers: any = [];
    Items: Array<quotationItemAddModel> = new Array<quotationItemAddModel>();
    selectedItems: Array<ItemListItemModel> = new Array<ItemListItemModel>();
    selectedItemListItemModel: ItemListItemModel = new ItemListItemModel();
    config = { displayKey: "value", search: true, height: 'auto', placeholder: 'Select Customer', customComparator: () => { }, 
    moreText: 'more', noResultsFound: 'No results found!', searchPlaceholder: 'Search', searchOnKey: 'value', clearOnSelection: false, 
    inputDirection: 'ltr', }
    selectedCustomer;
    customrlist: any = [{ "id": 1, "value": "cust1" }];
    quotDate;
    expireDate;
    newQuotNumber;
    qtnNumber;
    customerDiscount;
    ConfirmationMessage = "You want to save quotation?";
    isForSale=true;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private appUtils: AppUtils,
        private quotationervice: QuotationService,
        private customerService: CustomerService,
        private itemService: ItemService) {



        this.route.queryParams.subscribe((params) => {
            if (params['cId']) {
                this.model.customerId = params['cId'];
                this.disableCustomerId = true;
                this.getCustomerDetail();
            }
        });
    }

    ngOnInit() {
        this.setDefaultDate();
        this.getNewInvoiceNumber();
        this.loadItems();

        // var date=new Date();
        // this.sampleDate = new NgbDate(date.getFullYear(), date.getMonth(), date.getDate())
        // this.model.endDate="06/06/2020";

        if (!this.model.attachments || this.model.attachments.length === 0) {
            const attachmentFile = new AttachmentAddModel();
            this.model.attachments.push(attachmentFile);
        }

        this.loadCustomers();
    }

    loadCustomers() {
        this.blockUI.start();
        this.customerService.getSelectItems()
            .subscribe((data) => {
                
                this.blockUI.stop();
                console.log("customers", this.customers)

                this.customers = [];
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
        
        // alert(index)
        this.selectedItems.splice(index, 1);
        if (this.selectedItems.length == 0) {
            this.initiateGrid();
        }

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
        this.quotationervice.uploadAttachmentFile(file)
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
        
        if (this.selectedCustomer != undefined) {
            this.model.customerId = this.selectedCustomer.keyInt;

            if (this.model.customerId === null
                || this.model.customerId === '') {
                this.model.phone = '';
                this.model.email = '';
                //this.model.quotationNumber = '';
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

    openCustomerModal(content: any) {
        this.modalReference = this.modalService.open(content,
            {
                //backdrop: 'static',
                keyboard: false,
                size: 'lg',

            });
    }

    closeCustomerModal() {
        //this.updateTotalAmount();
        this.modalReference.close();
    }

    openConfirmationModal(content: any) {
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

    initiateGrid() {
        
        // alert("ng oninit called")
        this.selectedItemListItemModel.id = 0;
        this.selectedItemListItemModel.itemTypeName = "";
        this.selectedItemListItemModel.name = "";
        this.selectedItemListItemModel.rate = 0;
        this.selectedItemListItemModel.taxCode = "";
        this.selectedItemListItemModel.taxPercentage = 0;
        this.selectedItemListItemModel.taxPrice = 0.00;
        this.selectedItemListItemModel.description = "";
        this.selectedItemListItemModel.bankAccountId=null;
        this.selectedItemListItemModel.taxBankAccountId=null;
        this.selectedItems.push(this.selectedItemListItemModel);
    }

    newRow() {
        console.log("selerow", this.selectedItems)
        if (this.selectedItems[this.selectedItems.length - 1].id != 0) {
            this.initiateGrid();
        }
        else {
            this.toastr.error("Please select an item")
        }

    }

    changeQuotDate() {
        
        console.log("quotatindate", this.quotDate);
        const jsDate = new Date(this.quotDate.year, this.quotDate.month - 1, this.quotDate.day + 1);
        this.model.quotationDate = jsDate.toISOString();
    }

    changeExpire() {
        
        console.log("quotatindate", this.expireDate);
        const jsDate = new Date(this.expireDate.year, this.expireDate.month - 1, this.expireDate.day + 1);
        this.model.expiryDate = jsDate.toISOString();
    }

    submit() {
        
        this.closeAddModal();
        // if (!confirm('Are you sure you want to add Quotation?')) {
        //     return;
        // }
        this.model.items = [];
        if(this.selectedCustomer == undefined)
        {
            this.toastr.error('Please select Customer to continue');
            return;
        }
        else
        if (this.selectedItems.length > 0 && this.selectedItems[0].id != 0) {
            if (this.selectedItems[this.selectedItems.length - 1].id != 0) {
                this.selectedItems.map((item) => {
                    if(item.salesTaxId!=null){
                        this.model.items.push({"serviceId":item.id,"rate":item.rate,"price":item.price,"taxId":item.salesTaxId,"taxPercentage":item.taxPercentage,"taxPrice":this.model.tax,"quantity":item.qty,"bankAccountId":item.bankAccountId,"taxBankAccountId":item.taxBankAccountId,"lineAmount":item.lineAmount});
                    }else{
                        this.model.items.push({"serviceId":item.id,"rate":item.rate,"price":item.price,"taxId":null,"taxPercentage":item.taxPercentage,"taxPrice": 0,"quantity":item.qty,"bankAccountId":item.bankAccountId,"taxBankAccountId":0,"lineAmount":item.lineAmount});
                    }
                });
            } else {
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



        this.quotationervice.add(this.model).subscribe(
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

    setDefaultDate() {

        var qdt = new Date()
        this.quotDate = { day: qdt.getDate(), month: qdt.getMonth() + 1, year: qdt.getFullYear() };
        const jsqtnDate = new Date(this.quotDate.year, this.quotDate.month - 1, this.quotDate.day + 1);
        this.model.quotationDate = jsqtnDate.toISOString();

        this.expireDate = { day: qdt.getDate() + 1, month: qdt.getMonth() + 1, year: qdt.getFullYear() };
        const jsduevDate = new Date(this.expireDate.year, this.expireDate.month - 1, this.expireDate.day + 1);
        this.model.expiryDate = jsduevDate.toISOString();
    }

    getNewInvoiceNumber() {
        this.blockUI.start();
        this.quotationervice.getNewQuotationNumber()
            .subscribe((data) => {
                
                this.blockUI.stop();
                console.log("inv", data)
                var today = new Date();
                this.newQuotNumber = "QUO-" + today.getFullYear().toString().match(/\d{2}$/) + "-" + data;

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
