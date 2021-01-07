import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils } from '../../../helpers';
import { ItemEditModel, SelectListItemModel } from '../../../models';
import { ItemService, MasterDataService, SalesTaxService } from '../../../services';
import { ChartOfAccountsService } from 'src/services/chart-of-accounts.service';

@Component({
    selector: 'app-item-edit',
    templateUrl: './item.edit.component.html'
})

export class ItemEditComponent implements OnInit {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    model: ItemEditModel = new ItemEditModel();
    itemType: Array<SelectListItemModel> = new Array<SelectListItemModel>();
    salesTaxes: Array<SelectListItemModel> = new Array<SelectListItemModel>();
    @Input() selectedTax: any=[];

    config = {displayKey:"accountName",search:true,limitTo:10,height: 'auto',placeholder:'Select Item',
    customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!',searchPlaceholder:'Search',
    searchOnKey: 'id',clearOnSelection: false,inputDirection: 'ltr',}

    config2 = {displayKey:"code",search:true,height: '38px',placeholder:'Select sales Tax',
    customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!',searchPlaceholder:'Search',
    searchOnKey: 'code',clearOnSelection: false,inputDirection: 'ltr',}

    config3 = {displayKey:"expenseAccount",search:true,height: '38px',placeholder:'Select Expense',
    customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!',searchPlaceholder:'Search',
    searchOnKey: 'code',clearOnSelection: false,inputDirection: 'ltr',}
    
    incomeAccount;
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
        private salesTaxSerivce: SalesTaxService,
        private chartofaccService:ChartOfAccountsService,
        private masterDataService: MasterDataService) {
       
        this.route.queryParams.subscribe((params) => {
            if (params['cId']) {
                this.model.bankAccountId = params['cId'];
                this.disableItemId = true;
                this.getItemDetail();
            }
        });

        this.loadIncomeAccounts();
        this.loadExpenseAccounts();
        this.loadItemType();
        this.loadSalesTax();
        this.route.params.subscribe((params) => {
            this.model.id = params['id'];

            setTimeout(() => {
            this.loadItem();
            },1000);
              
        });
    }

    ngOnInit() {
      
        
    }

    loadItemType() {
       
        this.masterDataService.getItemType()
            .subscribe((data) => {
                Object.assign(this.itemType, data);
                console.log("ItemType",data)
            },
                error => {
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
    }

    loadSalesTax() {
        
        this.blockUI.start();
        this.salesTaxSerivce.getActiveOnly()
            .subscribe((data) => {
                this.blockUI.stop();
                Object.assign(this.salesTaxes, data);
                console.log("SalesTax",this.salesTaxes)
            },
                error => {
                    this.blockUI.stop();
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
    }

    loadItem() {
        
        this.blockUI.start();
        this.itemService.getForEdit(this.model.id).subscribe(
            (data: any) => {
                this.blockUI.stop();
                Object.assign(this.model, data);
                //code to bind for edit
                var tempModel=this.model;
                var tempaccid;
                var temptax;

                setTimeout(() => {
                if(this.model.isForSell=="1"){
                    this.incomeAccount.map(function (item: any) {
                        if(item.id == tempModel.bankAccountId){
                            tempaccid={};
                            tempaccid=item;
                        }
                          });
                          setTimeout(() => {
                            if(tempaccid!=undefined){
                                this.SelectedIncomeAccountId=tempaccid
                            }
                        }, 500);
                         
                }else{
                    this.expenseAccount.map(function (item: any) {
                        if(item.id == tempModel.bankAccountId){
                            tempaccid={};
                            tempaccid=item;
                        }
                          });
                          setTimeout(() => {
                            if(tempaccid!=undefined){
                                this.selectedExpAcc=tempaccid
                            }
                        }, 500);
                         
                }

                if(this.model.isTaxable == "1"){
                    
                    this.salesTaxes.map(function (item: any) {
                        if(item.id == tempModel.salesTaxId){
                            temptax={};
                            temptax=item;
                        }
                          });
                          setTimeout(() => {
                            if(temptax!=undefined){
                                this.selectedTax=temptax
                            }
                        }, 500);
                          
                }

            },500);
                // Edit code ends here
               
               // this.SelectedIncomeAccountId={'id':this.model.bankAccountId,'accountName': this.model.b}
                // console.log("itemedit",this.model)
                // if (!this.model.salesTaxId) {
                //     this.model.salesTaxId = '';
                // }
              
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
                  console.log("IncomeAccount",this.incomeAccount)
              },
              error => {
                  this.blockUI.stop();
                  this.appUtils.ProcessErrorResponse(this.toastr, error);
              });
      
}

loadExpenseAccounts(){

          this.chartofaccService.getAccountsByMasterType(this.expenseaccId).subscribe(
              (data: any) => {
                  this.expenseAccount=[];
                  var tempacc=[];
                  var incacclist=[];
                  Object.assign(tempacc, data);
                //  console.log("expense drop",this.tempacc)
                  tempacc.map(function (item) {
                      if(item.bankAccount.length!==0){
                        item.bankAccount.map(function (acc) {
                              incacclist.push(acc)
                         
                        });
                        
                      }
                    
                   
                  });
                  this.expenseAccount=incacclist;
                  console.log("ExpenseAcc",this.expenseAccount)
                 
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
        this.itemService.edit(this.model).subscribe(
            () => {
                this.blockUI.stop();
                setTimeout(() => {
                    this.router.navigate(['/item/manage']);
                }, 100);
                setTimeout(() => {
                    this.toastr.success('Item/service has been updated successfully');
                }, 500);
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }

    // (data) => {
    //     this.blockUI.stop();
    //     Object.assign(this.model, data);
    //     console.log(this.model, data)
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
    
}

