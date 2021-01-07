import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ChartOfAccountsService } from 'src/services/chart-of-accounts.service';
import { AppUtils } from '../../../helpers';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css']
})
export class AssetsComponent implements OnInit {
  @Output() openAddAccountModal = new EventEmitter();
  @Output() closeAddAccountModal = new EventEmitter();
  @BlockUI('container-blockui') blockUI: NgBlockUI;
  accType = 1
  accountList;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private appUtils: AppUtils,
    private chartofaccService: ChartOfAccountsService) { }

  ngOnInit() {
    this.accountList = [
      {
        "id": 1,
        "coA_AccountMasterId": 1,
        "accountTypeName": "Cash and Bank",
        "bankAccount": [
          {
            "id": 40000,
            "accountName": "Cash on Hand",

            "bankAccount": [
              {
                "id": 403001,
                "accountName": "COH Subacc",
                "bankAccount": [
                  {
                    "id": 403012,
                    "accountName": "Cod subaaccleve2",
                  }, {
                    "id": 403012,
                    "accountName": "Cod subaaccleve2",
                    "bankAccount": [
                      {
                        "id": 888888,
                        "accountName": "Cod subaaccleve8888",
                      }, {
                        "id": 9999,
                        "accountName": "Cod subaaccleve999",
                      }]
                  }]
              },
              {
                "id": 403001,
                "accountName": "COH Subacc",
              },
              {
                "id": 403001,
                "accountName": "COH Subacc",
              },
              {
                "id": 403001,
                "accountName": "COH Subacc",
                "bankAccount": [
                  {
                    "id": 403012,
                    "accountName": "Cod subaaccleve2",
                  }, {
                    "id": 403012,
                    "accountName": "Cod subaaccleve2",
                  }]
              }
            ]
          },
          {
            "id": 500000,
            "accountName": "iClose acc",
            "bankAccount": [{
              "id": 50200,
              "accountName": "iClose subaccount",
            }]
          }
        ]
      },
      {
        "id": 2,
        "coA_AccountMasterId": 1,
        "accountTypeName": "Money in Transit",
        "bankAccount": []
      },
      {
        "id": 3,
        "coA_AccountMasterId": 1,
        "accountTypeName": "Expected Payments from Customers",
        "bankAccount": [
          {
            "id": 1,
            "accountName": "Accounts Receivable",
          }
        ]
      },
      {
        "id": 4,
        "coA_AccountMasterId": 1,
        "accountTypeName": "Inventory",
        "bankAccount": []
      },
      {
        "id": 5,
        "coA_AccountMasterId": 1,
        "accountTypeName": "Property,Plant,Equipment",
        "bankAccount": []
      }
    ]
    // this.getAssetAccounts();
  }

  getAssetAccounts() {

    // this.chartofaccService.getAccountsByMasterType(this.accType).subscribe(
    //   (data: any) => {
    //     // this.accountList=[];
    //     Object.assign(this.accountList, data);
    //     console.log("assets", this.accountList)

    //   },
    //   error => {
    //     this.blockUI.stop();
    //     this.appUtils.ProcessErrorResponse(this.toastr, error);
    //   });
  }

}
