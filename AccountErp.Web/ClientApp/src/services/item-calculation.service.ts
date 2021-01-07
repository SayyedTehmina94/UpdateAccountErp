import { Injectable } from '@angular/core';
import { InvoiceAddModel, CustomerDetailModel, SelectListItemModel, ItemListItemModel } from 'src/models';
import { QuotationAddComponent } from 'src/components/Quotation';

@Injectable({
  providedIn: 'root'
})
export class ItemCalculationService {
  modalReference: any;
  disableCustomerId = false;
  model: InvoiceAddModel = new InvoiceAddModel();
  customer: CustomerDetailModel = new CustomerDetailModel();
  customers: Array<SelectListItemModel> = new Array<SelectListItemModel>();
  Items: Array<ItemListItemModel> = new Array<ItemListItemModel>();
  selectedItems: Array<ItemListItemModel> = new Array<ItemListItemModel>();
  selectedItemListItemModel : ItemListItemModel=new ItemListItemModel();


  constructor() { }

  initiateGrid(){
    
    // alert("ng oninit called")
  this.selectedItemListItemModel.id=0;
  this.selectedItemListItemModel.itemTypeName="";
  this.selectedItemListItemModel.name="";
  this.selectedItemListItemModel.rate=0;
  this.selectedItemListItemModel.taxCode="";
  this.selectedItemListItemModel.taxPercentage=0;
  this.selectedItemListItemModel.description="";
  this.selectedItems.push(this.selectedItemListItemModel);
}

}
