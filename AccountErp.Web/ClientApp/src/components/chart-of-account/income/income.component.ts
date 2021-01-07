import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppUtils } from 'src/helpers';
import { ChartOfAccountsService } from 'src/services/chart-of-accounts.service';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css']
})
export class IncomeComponent implements OnInit {
  @Output() openAddAccountModal = new EventEmitter();
  @BlockUI('container-blockui') blockUI: NgBlockUI;
  accType=3;
  accountList;
  constructor(
    router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private appUtils: AppUtils,
private chartofaccService:ChartOfAccountsService
  ) { }

  ngOnInit() {
    this.getIncomeAccounts();
  }

  getIncomeAccounts(){
    
      this.chartofaccService.getAccountsByMasterType(this.accType).subscribe(
          (data: any) => {
              this.accountList=[];
              Object.assign(this.accountList, data);
              console.log("equity",this.accountList)
             
          },
          error => {
              this.blockUI.stop();
              this.appUtils.ProcessErrorResponse(this.toastr, error);
          });
  }
}
