import { Component, OnInit, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ChartOfAccountsService } from 'src/services/chart-of-accounts.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppUtils } from 'src/helpers';
import { EventEmitter } from 'protractor';
import { AssetsComponent } from '../assets/assets.component';
import { LiabilitiesAndCreditCardsComponent } from '../liabilities-and-credit-cards/liabilities-and-credit-cards.component';
import { IncomeComponent } from '../income/income.component';
import { ExpensesComponent } from '../expenses/expenses.component';
import { EquityComponent } from '../equity/equity.component';

@Component({
  selector: 'app-chart-of-accounts',
  templateUrl: './chart-of-accounts.component.html',
  styleUrls: ['./chart-of-accounts.component.css'],
  
})
export class ChartOfAccountsComponent implements OnInit {
  @BlockUI('container-blockui') blockUI: NgBlockUI;
  @ViewChild(AssetsComponent, { static: true }) assets: AssetsComponent;
  @ViewChild(LiabilitiesAndCreditCardsComponent, { static: true }) liabCredit: LiabilitiesAndCreditCardsComponent;
  @ViewChild(IncomeComponent, { static: true }) income: IncomeComponent;
  @ViewChild(ExpensesComponent, { static: true }) expenses: ExpensesComponent;
  @ViewChild(EquityComponent, { static: true }) equity: EquityComponent;
  modalReference: any;
  accTypes;
  accId;
  accType;
  constructor(private modalService: NgbModal,private chartOfAccService:ChartOfAccountsService,private router: Router,
    private route: ActivatedRoute,
   
    private toastr: ToastrService,
    private appUtils: AppUtils,) { }

  ngOnInit() {
    // this.getAllAccountTypes();
    
  }
 
  openAddAccountModal(content: any,accType,accid){
    this.accId=accid;
    this.accType=accType;
    this.modalReference = this.modalService.open(content,
      {
          backdrop: 'static',
          keyboard: false,
          size: 'lg'
      });
  }

  getAllAccountTypes(){
    
    this.chartOfAccService.getAllAccountTypes()
        .subscribe((data) => {
           
          
           
            this.accTypes=[];
            Object.assign(this.accTypes, data);
            console.log("allaccus",this.accTypes)
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


  closeAddAccountModal() {
    //this.updateTotalAmount();
    this.modalReference.close();
    this.reloadAccounts();
}

reloadAccounts(){
  
  switch (this.accType) {
      case '1':
        this.assets.getAssetAccounts();
          break;
      case '2':
        this.liabCredit.getLiabilitiesAccounts();
          break;
      case '3':
        this.income.getIncomeAccounts();
          break;
      case '4':
        this.expenses.getExpenseAccounts();
          break;
      case '5':
        this.equity.getEquityAccounts();
        break;
  }
  
  
  
  
  
}
}
