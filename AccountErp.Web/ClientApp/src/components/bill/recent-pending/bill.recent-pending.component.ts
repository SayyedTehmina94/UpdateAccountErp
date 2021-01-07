import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils, AppSettings } from '../../../helpers';
import { BillService} from 'src/services'
import { ToastrService } from 'ngx-toastr';
import { BillDetailModel } from 'src/models';

@Component({
    selector: 'app-bill-recent-pending',
    templateUrl: './bill.recent-pending.component.html'
})

export class BillRecentPendingComponent implements OnInit {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    billRecents: Array<BillDetailModel> = new Array<BillDetailModel>();

    constructor(private http: HttpClient,
        private appSettings: AppSettings,
        private toastr: ToastrService,
        private router: Router,
        private appUtils: AppUtils,
        private billService: BillService) { }

    ngOnInit(): void {
        this.blockUI.start();
        this.billService.getRecentBills()
            .subscribe((data) => {
                this.blockUI.stop();
                Object.assign(this.billRecents, data);
                this.billRecents.forEach(element => {
                    element.dueDate =  this.appUtils.getFormattedDate(element.dueDate, null);
                });
            },
                error => {
                    this.blockUI.stop();
                    this.appUtils.ProcessErrorResponse(this.toastr, error);
                });
    }
}

