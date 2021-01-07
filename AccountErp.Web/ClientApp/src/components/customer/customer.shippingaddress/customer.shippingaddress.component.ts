import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { SelectListItemModel, CustomerUpsertModel } from '../../../models';
import { AppUtils } from '../../../helpers';
import { MasterDataService } from '../../../services';

@Component({
  selector: 'app-customer-shippingaddress',
  templateUrl: './customer.shippingaddress.component.html',
  
})
export class CustomerShippingaddressComponent implements OnInit {
 
  @Input() model: CustomerUpsertModel;
  @Output() moveForward = new EventEmitter();
  @Output() moveBackward = new EventEmitter();
  @BlockUI('conatiner-blockui') blockUI: NgBlockUI;
  wizardStep = 3;
  countries: Array<SelectListItemModel> = new Array<SelectListItemModel>();

  // countries:any[];
  config = { displayKey: 'value', search: true, limitTo:10,height: 'auto', placeholder:'Select Country',
  customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!', searchPlaceholder:'Search',
  searchOnKey: 'value',clearOnSelection: false,inputDirection: 'ltr', }
  selectedCountry;

  constructor(private toastr: ToastrService,
      private masterDataService: MasterDataService,
      private appUtils: AppUtils) { 
        this.loadCountries();
      }

  next() {
      this.moveForward.emit();
  }

  prev() {
      this.moveBackward.emit();
  }
  getCustomerAdd(){
    debugger;
   this.model.shippingAddress.countryId=this.selectedCountry.keyInt;
}
loadCountries() {
  debugger;
  this.blockUI.start();
  this.masterDataService.getCountries().subscribe(
      (data: any) => {
          this.blockUI.stop();
          this.countries = [];
          Object.assign(this.countries, data);
          console.log("countyNnnn",this.countries, data)
          setTimeout(() => {
              
          if(this.model.shippingAddress.countryId  && this.countries!=undefined){
              let tempcountry={};
              let tempcountryId=this.model.shippingAddress.countryId;
           
                  
                  this.countries.map(function (item) {
                      if(Number(item.keyInt)==Number(tempcountryId)){
                          tempcountry=item;
                      }
                  });
            
  
                  if(tempcountry!=undefined){
                      this.selectedCountry=tempcountry;
                  } 
          }
      }, 10);
      },
      error => {
          this.blockUI.stop();
          this.appUtils.ProcessErrorResponse(this.toastr, error);
      });
}
  ngOnInit() {

  }

}
