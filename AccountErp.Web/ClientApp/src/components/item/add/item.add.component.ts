import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils } from '../../../helpers';
import { ItemAddModel, SelectListItemModel } from '../../../models'
import { ItemService, MasterDataService, SalesTaxService } from '../../../services';
import { ChartOfAccountsService } from 'src/services/chart-of-accounts.service';

@Component({
    selector: 'app-item-add',
    templateUrl: './item.add.component.html'
})

export class ItemAddComponent implements OnInit {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    model: ItemAddModel = new ItemAddModel();

    itemType: Array<SelectListItemModel> = new Array<SelectListItemModel>();
    salesTaxes: Array<SelectListItemModel> = new Array<SelectListItemModel>();
    @Input() selectedTax: any=[];

    config = {displayKey:"accountName",search:true,limitTo:10,height: 'auto',placeholder:'Select Item',
    customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!',searchPlaceholder:'Search',
    searchOnKey: 'accountName',clearOnSelection: false,inputDirection: 'ltr',}

    config2 = {displayKey:"code",search:true,height: '38px',placeholder:'Select sales Tax',
    customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!',searchPlaceholder:'Search',
    searchOnKey: 'code',clearOnSelection: false,inputDirection: 'ltr',}

    config3 = {displayKey:"expenseAccount",search:true,height: '38px',placeholder:'Select Expense',
    customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!',searchPlaceholder:'Search',
    searchOnKey: 'code',clearOnSelection: false,inputDirection: 'ltr',}

    incomeAccount:any[];
    expenseAccount;
    SelectedIncomeAccountId;
    selectedExpAcc;
    item;
    disableItemId = false;

    incomeaccId=3;
    expenseaccId=4;
    

    constructor(private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private appUtils: AppUtils,
        private itemService: ItemService,
        private salesTaxSerivce : SalesTaxService,
        private chartofaccService:ChartOfAccountsService,
        private masterDataService: MasterDataService) {

            // this.route.queryParams.subscribe((params) => {
            //     if (params['cId']) {
            //         this.model.bankAccountId = params['cId'];
            //         this.disableItemId = true;
            //         this.getItemDetail();
            //     }
            // });
    }

    ngOnInit() {
        this.loadItemType();
        this.loadSalesTax();
        this.loadIncomeAccounts();
        this.loadExpenseAccounts();
    }

    loadItemType() {
        
        this.blockUI.start();
        this.masterDataService.getItemType()
            .subscribe((data) => {
                this.blockUI.stop();
                
                Object.assign(this.itemType, data);
            },
                error => {
                    this.blockUI.stop();
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
    }

    loadSalesTax() {
        
        this.blockUI.start();
        this.salesTaxSerivce.getActiveOnly()
            .subscribe((data) => {
                this.blockUI.stop();
                Object.assign(this.salesTaxes, data);
                console.log("taxlist",this.salesTaxes)
            },
                error => {
                    this.blockUI.stop();
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
    }

    loadIncomeAccounts(){
      
              this.chartofaccService.getAccountsByMasterType(this.incomeaccId).subscribe(
                  (data: any) => {
                      this.incomeAccount=[];
                      var tempacc=[];
                      var incacclist=[];
                      Object.assign(tempacc, data);
                     
                      tempacc.map(function (item) {
                          if(item.bankAccount.length!==0){
                            item.bankAccount.map(function (acc) {
                                  incacclist.push(acc)
                             
                            });
                            
                          }
                        
                       
                      });
                      this.incomeAccount=incacclist;
                      console.log("icmacc",this.incomeAccount)
                  },
                  error => {
                      this.blockUI.stop();
                      this.appUtils.ProcessErrorResponse(this.toastr, error);
                  });
          
    }

    getItemDetail() {
        
        if (this.SelectedIncomeAccountId != undefined) {
            this.model.bankAccountId = this.SelectedIncomeAccountId.keyInt;

            this.itemService.getDetail(Number(this.model.bankAccountId))
                .subscribe(
                    (data) => {
                        Object.assign(this.item, data);
                    });
        }
    }

    loadExpenseAccounts(){
       
              this.chartofaccService.getAccountsByMasterType(this.expenseaccId).subscribe(
                  (data: any) => {
                      this.expenseAccount=[];
                      var tempacc=[];
                      var incacclist=[];
                      Object.assign(tempacc, data);
                     
                      tempacc.map(function (item) {
                          if(item.bankAccount.length!==0){
                            item.bankAccount.map(function (acc) {
                                  incacclist.push(acc)
                             
                            });
                            
                          }
                        
                       
                      });
                      this.expenseAccount=incacclist;
                      console.log("icmacc",this.expenseAccount)
                     
                  },
                  error => {
                      this.blockUI.stop();
                      this.appUtils.ProcessErrorResponse(this.toastr, error);
                  });
          
    }

    submit() {
        
        this.blockUI.start();
        if(this.model.rate==undefined || this.model.rate==Number("")){
            this.model.rate=0;
        }
        this.itemService.add(this.model).subscribe(
            () => {
                this.blockUI.stop();
                setTimeout(() => {
                    this.router.navigate(['item/manage']);
                }, 100);
                setTimeout(() => {
                    this.toastr.success('Item & service has been added successfully');
                }, 500);
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }
    getIncome(){
        
       
        this.model.bankAccountId=this.SelectedIncomeAccountId.id;
       
    }

    changeTax(){
        
        console.log("tax ngmodel after")
        this.model.salesTaxId=this.selectedTax.id;
    }

    changeExpenseAcc(){
        console.log("ExpenseAcc",this.model.bankAccountId)
        this.model.bankAccountId=this.selectedExpAcc.id;   
     }
}