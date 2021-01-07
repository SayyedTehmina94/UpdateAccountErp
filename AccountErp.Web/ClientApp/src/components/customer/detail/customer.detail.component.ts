import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils } from '../../../helpers';
import { CustomerDetailModel } from '../../../models';
import { CustomerService } from '../../../services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-customer-detail',
    templateUrl: './customer.detail.component.html'
})

export class CustomerDetailComponent implements OnInit {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    model: CustomerDetailModel = new CustomerDetailModel();
    modalReference: any;
    isModelLoaded = false;
    constructor(private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private appUtils: AppUtils,
        private customerService: CustomerService,
        private modalService: NgbModal) {
        this.route.params.subscribe((params) => {
            this.model.id = params['id'];
        });
    }
    ngOnInit() {
        this.blockUI.start();
        this.customerService.getDetail(this.model.id).subscribe(
            (data: any) => {
                this.blockUI.stop();
                Object.assign(this.model, data);
                console.log("custDetail",this.model, data);
                this.isModelLoaded = true;
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }

    openDeleteModal(content :any){
        
        this.modalReference = this.modalService.open(content,
          {
              backdrop: 'static',
              keyboard: false,
              size: 'lg'
          });
      }

      closeDeleteModal() {
        this.modalReference.close();
    }

    delete(): void {
        this.closeDeleteModal();
        this.blockUI.start();
        this.customerService.delete(this.model.id).subscribe(
            () => {
                this.blockUI.stop();
                setTimeout(() => {
                    this.router.navigate(['/customer/manage']);
                }, 100);
                setTimeout(() => {
                    this.toastr.success('Customer has been deleted successfully.');
                }, 500);
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }
}

