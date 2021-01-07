import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppUtils } from '../../../helpers';
import { VendorDetailModel } from '../../../models';
import { VendorService } from '../../../services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-vendor-detail',
    templateUrl: './vendor.detail.component.html'
})

export class VendorDetailComponent implements OnInit {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    model: VendorDetailModel = new VendorDetailModel();
    isModelLoaded = false;
    modalReference: any;
    constructor(private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private appUtils: AppUtils,
        private vendorService: VendorService,
        private modalService: NgbModal) {
        this.route.params.subscribe((params) => {
            this.model.id = params['id'];
        });
    }

    ngOnInit() {
        this.blockUI.start();
        this.vendorService.getDetail(this.model.id).subscribe(
            (data: any) => {
                this.blockUI.stop();
                Object.assign(this.model, data);
                console.log("vendorDetail",this.model, data);
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
        this.vendorService.delete(this.model.id).subscribe(
            () => {
                this.blockUI.stop();
                this.router.navigate(['/vendor/manage']);
                setTimeout(() => {
                    this.toastr.success('Vendor has been deleted successfully.');
                }, 100);
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }
}

