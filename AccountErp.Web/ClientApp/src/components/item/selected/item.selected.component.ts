import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ItemListItemModel, SalesTaxAddModel } from '../../../models';
import { QuotationAddComponent } from 'src/components/Quotation';

import { ItemCalculationService } from 'src/services/item-calculation.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { QuotationService } from 'src/services/quotation.service.service';
import { ToastrService } from 'ngx-toastr';
import { AppUtils } from 'src/helpers';

@Component({
    selector: 'app-item-selected',
    templateUrl: './item.selected.component.html'
})

export class ItemSelectedComponent implements OnInit{
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    modalReference: any;
    @Input() selectedItems: Array<ItemListItemModel> = new Array<ItemListItemModel>();
    @Input() readOnly: boolean;
    selectedItemListItemModel : ItemListItemModel=new ItemListItemModel();
    ItemListItemModel : ItemListItemModel=new ItemListItemModel();
    itemsandservices : any=[];
    @Input() itemId : Array<ItemListItemModel> = new Array<ItemListItemModel>();
    @Input() testVariable:string;
    @Input() taxList;
    config = {displayKey:"name",search:true,height: 'auto',placeholder:'Select Item',customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!',searchPlaceholder:'Search',searchOnKey: 'name',clearOnSelection: false,inputDirection: 'ltr',}
    config2 = {displayKey:"code",search:true,height: '38px',placeholder:'Select Item',customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!',searchPlaceholder:'Search',searchOnKey: 'code',clearOnSelection: false,inputDirection: 'ltr',}
    @Input() customerDiscount;

    @Input() selectedTax: any=[];
    @Input() disabled : boolean = true;
    @Input() isForSale:boolean;
    
 
    @Output() deleteItem = new EventEmitter();
    @Output() updateTotalAmount = new EventEmitter();
   
    constructor(private itemService: ItemCalculationService,
                private QuotationService:QuotationService,
                private toastr: ToastrService,
                private appUtils: AppUtils,) {}

    ngOnInit(): void {
        
        console.log("items",this.selectedItems)
        if(this.selectedItems.length==0){
            this.initiateGrid();
        }
        // 
        // if(this.selectedItems!=){
        //     this.loadItemsForSale();
        // }else{
        //     this.loadItemsForExpense();
        // }

        if(this.isForSale){
            this.loadItemsForSale();
        }else{
            this.loadItemsForExpense();
        }
       // this.loadItems();
        this.loadTaxes();

    }



    getItemDetail(rowindx:any){
        
    this.itemId[rowindx].qty=1;
    this.itemId[rowindx].price=this.itemId[rowindx].rate;
    if(this.customerDiscount!=undefined){
        this.itemId[rowindx].lineAmount=Number(this.itemId[rowindx].price)-Number(this.itemId[rowindx].price*this.customerDiscount/100);
    }else{
        this.itemId[rowindx].lineAmount=Number(this.itemId[rowindx].price);
    }
    this.selectedItems[rowindx]=this.itemId[rowindx];
    this.selectedTax[rowindx]=this.itemId[rowindx].taxCode;
   
    }

    initiateGrid(){
        
      this.selectedItemListItemModel.id=0;
      this.selectedItemListItemModel.itemTypeName="";
      this.selectedItemListItemModel.name="Select Item";
      this.selectedItemListItemModel.rate=0;
      this.selectedItemListItemModel.taxCode="";
      this.selectedItemListItemModel.taxPercentage=0;
      this.selectedItemListItemModel.description="Desc";
      this.selectedItemListItemModel.price=0;
      this.selectedItemListItemModel.qty=1;
      this.selectedItems.push(this.selectedItemListItemModel);
    //   console.log("kfjdkfj",this.itemId)
      
    }

   

    loadItems() {
        
        this.blockUI.start();
        this.QuotationService.getAllItemsActive()
            .subscribe((data) => {
                
                this.blockUI.stop();
                
               
                this.itemsandservices=[];
                Object.assign(this.itemsandservices, data);
                console.log("customers",this.itemsandservices)
               
            },
                error => {
                    this.blockUI.stop();
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
    }

    loadItemsForSale() {
        
        this.blockUI.start();
        this.QuotationService.getAllItemsActiveForSale()
            .subscribe((data) => {
                
                this.blockUI.stop();
                
               
                this.itemsandservices=[];
                Object.assign(this.itemsandservices, data);
                console.log("customers",this.itemsandservices)
               
            },
                error => {
                    this.blockUI.stop();
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
    }
    loadItemsForExpense() {
        
        this.blockUI.start();
        this.QuotationService.loadItemsForExpense()
            .subscribe((data) => {
                
                this.blockUI.stop();
                
               
                this.itemsandservices=[];
                Object.assign(this.itemsandservices, data);
                console.log("customers",this.itemsandservices)
               
            },
                error => {
                    this.blockUI.stop();
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
    }

    loadTaxes() {
        
        this.blockUI.start();
        this.QuotationService.getAllTaxes()
            .subscribe((data) => {
                
                this.blockUI.stop();
                
               
                this.taxList=[];
                Object.assign(this.taxList, data);
                console.log("taxs",this.taxList)
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

    changeRate(event,rowindx){
        
       // alert(event.target.value)
        console.log(this.selectedItems[rowindx])
        this.selectedItems[rowindx].rate=Number(event.target.value);
        this.selectedItems[rowindx].price=Number(this.selectedItems[rowindx].rate)*Number(this.selectedItems[rowindx].qty);

        this.itemId[rowindx].lineAmount=Number(this.itemId[rowindx].price)-Number(this.itemId[rowindx].price*this.customerDiscount/100);
    }

    changeQty(event,rowindx){
        
      //  alert(event.target.value)
        console.log(this.selectedItems[rowindx])
        this.selectedItems[rowindx].qty=Number(event.target.value);
        this.selectedItems[rowindx].price=Number(this.selectedItems[rowindx].rate)*Number(this.selectedItems[rowindx].qty);
        this.itemId[rowindx].lineAmount=Number(this.itemId[rowindx].price)-Number(this.itemId[rowindx].price*this.customerDiscount/100);
    }

    deleteSelected(index){
        this.itemId.splice(index, 1);
    }

    changeTax(index,event){
        
        console.log("tax ngmodel after",event)
       
       // alert(event.target.Value)
        this.selectedItems[index].salesTaxId=this.selectedTax[index].id;
        this.selectedItems[index].taxPercentage=Number(this.selectedTax[index].taxPercentage);
        this.selectedItems[index].taxBankAccountId=this.selectedTax[index].bankAccountId;
    }
    
}

