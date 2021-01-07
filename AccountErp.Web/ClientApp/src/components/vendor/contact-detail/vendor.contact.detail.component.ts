import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { AppUtils } from 'src/helpers';
import { MasterDataService } from 'src/services';
import { VendorModel, ContactModel, SelectListItemModel } from '../../../models';

@Component({
    selector: 'app-vendor-contact-detail',
    templateUrl: './vendor.contact.detail.component.html'
})

export class VendorContactDetailComponent implements OnInit {
    @Input() model: VendorModel;
    @Output() moveForward = new EventEmitter();
    @Output() moveBackward = new EventEmitter();
    wizardStep = 4;
    @BlockUI('conatiner-blockui') blockUI: NgBlockUI;
    countries: Array<SelectListItemModel> = new Array<SelectListItemModel>();

    config = { displayKey: 'value', search: true, limitTo:10,height: 'auto', placeholder:'Select Country',
    customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!', searchPlaceholder:'Search',
    searchOnKey: 'value',clearOnSelection: false,inputDirection: 'ltr', }
    selectedCountry;
    constructor(private toastr: ToastrService,
        private masterDataService: MasterDataService,
        private appUtils: AppUtils) { }

    next() {
        this.moveForward.emit();
    }

    prev() {
        this.moveBackward.emit();
    }

    ngOnInit() {
     
        this.loadCountries();
        if (this.model.contacts.length > 0) {
            return;
        }
        const contact = new ContactModel();
        this.model.contacts.push(contact);
        
    }

    addContact() {
        let contact = this.model.contacts[this.model.contacts.length - 1];
        if (!contact.firstName
            && !contact.middleName
            && !contact.lastName
            && !contact.jobTitle
            && !contact.phone
            && !contact.email
            && !contact.address.streetNumber
            && !contact.address.streetName
            && !contact.address.postalCode
            && !contact.address.city) {
            this.toastr.error(`Please fill the detail of contact# ${this.model.contacts.length} before adding another`);
            return;
        }
        contact = new ContactModel();
        this.model.contacts.push(contact);
    }

    loadCountries() {
        
        this.blockUI.start();
        this.masterDataService.getCountries().subscribe(
            (data: any) => {
                this.blockUI.stop();
                this.countries = [];
                Object.assign(this.countries, data);
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
    removeContact(index: number) {
        this.model.contacts.splice(index, 1);
    }

    getCustomerAdd(index){
        debugger;
       this.model.contacts[index].address.countryId=this.selectedCountry.keyInt;
    }
}
