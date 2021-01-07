import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SalesTaxAddModel } from 'src/models';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppUtils } from 'src/helpers';
import { SalesTaxService, BankAccountService } from 'src/services';
import { chartOfAccountsList } from '../chartOfAccountsList';
import { ChartOfAccountsService } from 'src/services/chart-of-accounts.service';
import { customerAccountModel } from 'src/models/chartofaccount/customeraccount';

@Component({
  selector: 'app-add-new-account',
  templateUrl: './add-new-account.component.html',
  styleUrls: ['./add-new-account.component.css']
})
export class AddNewAccountComponent implements OnInit {
  @BlockUI('container-blockui') blockUI: NgBlockUI;
    model: customerAccountModel = new customerAccountModel();
    @Output() closeAddAccountModal = new EventEmitter();
    @Output() reloadAccounts = new EventEmitter();
    
    @Input() accType:number;
    @Input() accId:number;

    selectedAccountType;
    selectedLedgerType;
    acctypeList;
    config = {displayKey:"accountTypeName",search:true,limitTo:10,height: 'auto',placeholder:'Select Value',
    customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!',searchPlaceholder:'Search',
    searchOnKey: 'accountTypeName',clearOnSelection: false,inputDirection: 'ltr',}

    config1 = {displayKey:"value",search:true,limitTo:10,height: 'auto',placeholder:'Select Value',
    customComparator: ()=>{},moreText: 'more',noResultsFound: 'No results found!',searchPlaceholder:'Search',
    searchOnKey: 'value',clearOnSelection: false,inputDirection: 'ltr',}

    ledgerList  = [{value:'select ledger type',keyInt:'0'},
                   {value:'Cash',keyInt:'1'},
                   {value:'Bank',keyInt:'2'},
                   {value:'other',keyInt:'3'}]

    constructor(private router: Router,
        private toastr: ToastrService,
        private appUtils: AppUtils,
        private accountList:chartOfAccountsList,
        private bankAccountService: BankAccountService,
        private route: ActivatedRoute,
        private chartofaccService: ChartOfAccountsService) {
        this.route.params.subscribe((params) => {

          if(params['id']!=undefined){
            // this.model.invoiceId = params['id'];
            // this.model.coA_AccountTypeId=1
        }
      });
    }

    ngOnInit() {
     
      if(this.accId!== undefined){
        this.model.id=this.accId;
        this.getForEdit();
      }
     if(this.accType!== undefined ){
     this.getAccountTypes();
     }
    }

    getAccountTypes(){
    
        this.chartofaccService.getAccountsByMasterType(this.accType).subscribe(
            (data: any) => {
                this.acctypeList=[];
                Object.assign(this.acctypeList, data);
                console.log("assets",this.acctypeList)
               
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }

    submit() {
        this.blockUI.start();
        if(this.model.id===undefined){
          this.chartofaccService.add(this.model).subscribe(
            () => {
                this.blockUI.stop();
                setTimeout(() => {
                  this.closeAddAccountModal.emit();
                }, 100);
                setTimeout(() => {
                    this.toastr.success('Account  has been added successfully');
                    
                }, 500);
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
        }else{
          this.chartofaccService.edit(this.model).subscribe(
            () => {
                this.blockUI.stop();
                setTimeout(() => {
                  this.closeAddAccountModal.emit();
                }, 100);
                setTimeout(() => {
                  this.reloadAccounts.emit();
                    this.toastr.success('Account  has been updated successfully');
                   
                }, 500);
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
                
            });
        }
       
    }

    getForEdit() {
     
     
      this.chartofaccService.getForEdit(this.model.id).subscribe(
          (data: any) => {
              Object.assign(this.model, data);
              console.log("accmodel",this.model)
          },
          error => {
              this.blockUI.stop();
              this.appUtils.ProcessErrorResponse(this.toastr, error);
          });
    }
    getAccountType(){
      this.model.coA_AccountTypeId=this.selectedAccountType.id;
    }

    changeLedgerType(){
      
      this.model.ledgerType=Number(this.selectedLedgerType.keyInt);
    }
}
