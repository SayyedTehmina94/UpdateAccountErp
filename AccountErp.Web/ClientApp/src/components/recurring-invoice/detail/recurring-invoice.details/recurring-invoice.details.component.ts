import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CustomerUpsertModel, AttachmentEditModel } from 'src/models';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppUtils } from 'src/helpers';
import { CustomerService } from 'src/services';
import { RecurringInvoiceService } from 'src/services/recurring-invoice.service';
import { RecurringInvoiceDetailModel } from 'src/models/recurring-invoices/recurringInvoice.detail.model';

@Component({
  selector: 'app-recurring-invoice.details',
  templateUrl: './recurring-invoice.details.component.html',
  styleUrls: ['./recurring-invoice.details.component.css']
})
export class RecurringInvoiceDetailsComponent implements OnInit {

  @BlockUI('container-blockui') blockUI: NgBlockUI;
    model: RecurringInvoiceDetailModel = new RecurringInvoiceDetailModel();
    wizardStep = 1;
    invDate;
    dueDate;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private appUtils: AppUtils,
        private recinvoiceService: RecurringInvoiceService,
        private customerService: CustomerService) {
            this.route.params.subscribe((params) => {
                this.model.id = params['id'];
                this.loadInvoice();
            });
         }

    next() {
      
        switch (this.wizardStep) {
            case 1:
            this.increaseWizard();
              break;
            case 2:
              if (this.model.id) {
               // this.updateCustomer();
            } else {
               // this.addCustomer();
            }
            this.increaseWizard();
            break;
            case 3:
                this.increaseWizard();
            break;
            case 4:
                this.increaseWizard();
            break;
            case 5:
               // this.updateCustomer();
               this.increaseWizard();
               break;
        }
    }

    prev() {
        if (this.wizardStep !== 1) {
            this.wizardStep -= 1;
            setTimeout(() => {
                this.appUtils.scrollToTop();
            }, 100);
        }
    }

    increaseWizard() {
        if (this.wizardStep < 4) {
            this.wizardStep += 1;
            setTimeout(() => {
                this.appUtils.scrollToTop();
            }, 100);
            return;
        } else {
            this.router.navigate(['/recurring-invoice/manage']);
        }
    }

    getRecInvoiceDetail(){

    }

    setWizardStep(step: number) {
        this.wizardStep = step;
       // alert(this.wizardStep);
        // if (this.model.id) {
        //     this.wizardStep = step;
        // } else {
        //     this.toastr.warning('Please save the customer profile');
        //     this.wizardStep = 1;
        // }
    }

  

   

    loadInvoice() {
        this.blockUI.start();
        this.recinvoiceService.getDetail(this.model.id).subscribe(
            (data: any) => {
                this.blockUI.stop();
                Object.assign(this.model, data);
  console.log("recinvdetails",this.model);
                var qdt=new Date(this.model.recInvoiceDate)
                this.invDate={ day: qdt.getDate(), month: qdt.getMonth()+1, year: qdt.getFullYear()};
  
                var expdt=new Date(this.model.recDueDate);
                this.dueDate={ day: expdt.getDate(), month: expdt.getMonth()+1, year: expdt.getFullYear()};
                
  
                if (!this.model.attachments || this.model.attachments.length === 0) {
                    const attachmentFile = new AttachmentEditModel();
                    this.model.attachments.push(attachmentFile);
                }
              
               
            },
            error => {
                this.blockUI.stop();
                this.appUtils.ProcessErrorResponse(this.toastr, error);
            });
    }

  ngOnInit() {
  }

}
