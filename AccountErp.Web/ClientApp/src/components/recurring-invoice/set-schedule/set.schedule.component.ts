import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { SelectListItemModel, CustomerUpsertModel } from '../../../models';
import { AppUtils } from '../../../helpers';
import { MasterDataService } from '../../../services';
import { recurringOptions } from 'src/helpers/recurringOptions';

@Component({
  selector: 'app-set-schedule',
  templateUrl: './set.schedule.component.html',
  
})
export class SetrecinvoiceScheduleComponent implements OnInit {
 
  @Input() model: CustomerUpsertModel;
  @Output() moveForward = new EventEmitter();
  @Output() moveBackward = new EventEmitter();
  @BlockUI('conatiner-blockui') blockUI: NgBlockUI;
  wizardStep = 2;
  repeatList;
  mothdays;
  repeatMode='Monthly';
  weekdayList;
  monthList;
  invoiceDate;
  lastInvoiceDate;
  startDay;
  yearlyMonth;
  selectedWeekDay;
  selectedEndMode;
  yearlyMonthDays;
  countries: Array<SelectListItemModel> = new Array<SelectListItemModel>();

  constructor(private toastr: ToastrService,
      private masterDataService: MasterDataService,
      private recurringOptions: recurringOptions,
      private appUtils: AppUtils) { }

  next() {
      this.moveForward.emit();
  }

  prev() {
      this.moveBackward.emit();
  }

 

  selectRepeatMode(){
      
      if(this.repeatMode==='Monthly'){
          this.setInvStartDate(1);
    }else if(this.repeatMode==='Weekly'){
        this.setInvStartDate(8);
       
    }else if(this.repeatMode==='Daily'){
        this.setInvStartDate(1);
    }else if(this.repeatMode==='Yearly'){

        this.setInvStartDate(0);
    }
   

     // alert(event.target.value);
  }
  changeInvoiceDate(){
      console.log("dt",this.invoiceDate)
  }

  selectStartingDay(){
      
      if(this.startDay==0){
       this.setLastDateOfMonth();
      }else{
        this.setInvStartDate(this.startDay);
      }
    
  }

  selectYearlyMonthDays(){
      
    if(this.yearlyMonthDays==0){
        this.setLastDateOfMonth();
    }else{
      this.setInvStartDate(this.yearlyMonthDays);
    }
  }

  selectEndMode(){
      if(this.selectedEndMode==2){
        this.lastInvoiceDate=this.invoiceDate;
      }
      
  }

  setInvStartDate(daystoAdd:number){
      
    
    var qdt = new Date();
    if(daystoAdd==0){
       
        this.yearlyMonth=qdt.getMonth()+2;
        qdt.setMonth(qdt.getMonth()+1);
        qdt.setDate(1);
        this.yearlyMonthDays=1;
        this.invoiceDate = { day: qdt.getDate(), month: qdt.getMonth() + 1, year: qdt.getFullYear() };
        const jsqtnDate = new Date(this.invoiceDate.year, this.invoiceDate.month - 1, this.invoiceDate.day + 1);
        //this.model.quotationDate = jsqtnDate.toISOString();
    }else{
        qdt.setDate(qdt.getDate()+Number(daystoAdd))
        this.selectedWeekDay=qdt.getDay();
        this.invoiceDate = { day: qdt.getDate(), month: qdt.getMonth() + 1, year: qdt.getFullYear() };
        const jsqtnDate = new Date(this.invoiceDate.year, this.invoiceDate.month - 1, this.invoiceDate.day + 1);
        //this.model.quotationDate = jsqtnDate.toISOString();
    }
        
  }

  setLastDateOfMonth(){
    const jsqtnDate = new Date(this.invoiceDate.year, this.invoiceDate.month - 1, this.invoiceDate.day);
    var lastDateOfMonth=new Date(jsqtnDate.getFullYear(), jsqtnDate.getMonth() + 1, 0)
    this.invoiceDate = { day: lastDateOfMonth.getDate(), month: lastDateOfMonth.getMonth() + 1, year: lastDateOfMonth.getFullYear() }; 
  }

  selectWeekDay(){
    // const jsqtnDate = new Date(this.invoiceDate.year, this.invoiceDate.month - 1, this.invoiceDate.day);
    // jsqtnDate.setDate()
  }

  ngOnInit() {
     this.resetSchedule();
    
  }

  resetSchedule(){
    this.repeatList=this.recurringOptions.invRepeatList;
    this.mothdays=this.recurringOptions.mnthdaylist;
    this.weekdayList=this.recurringOptions.weekdayList;
    this.monthList=this.recurringOptions.monthList;
    this.repeatMode="Monthly";
    this.startDay=1;
    this.selectedEndMode=0;
    this.selectRepeatMode();
  }

}
