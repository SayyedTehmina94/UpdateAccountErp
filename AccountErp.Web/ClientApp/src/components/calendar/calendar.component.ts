import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { OptionsInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarComponent } from 'ng-fullcalendar';
import { AppUtils, AppSettings } from '../../helpers';
declare var appConfig: any;

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html'
})

export class CalendarManageComponent implements OnInit {
    @BlockUI('container-blockui') blockUI: NgBlockUI;
    @ViewChild(CalendarComponent, { static: false })
    options: OptionsInput;
    eventsModel: any;

    constructor(private http: HttpClient,
        private router: Router,
        private toastr: ToastrService,
        private appUtils: AppUtils,
        private appSettings: AppSettings) { }

  ngOnInit() {
    setTimeout(() => {
      appConfig.initKTDefaults();
    }, 500);
        this.options = {
            editable: true,
            events: [{
                title: 'test',
                start: '2019-11-08',
                end: '2019-11-8'
            },{
                title: 'test',
                start: this.yearMonth + '-07',
                end: this.yearMonth + '-7'
            },{
                title: 'test',
                start: this.yearMonth + '-07',
                end: this.yearMonth + '-7'
            },{
                title: 'test',
                start: this.yearMonth + '-07',
                end: this.yearMonth + '-7'
            },{
                title: 'test',
                start: this.yearMonth + '-35',
                end: this.yearMonth + '-35'
            }],
            customButtons: {
                myCustomButton: {
                    text: 'custom!',
                    click: function () {
                      //  alert('clicked the custom button!');
                    }
                }
            },
            header: {
                left: 'prev,next today myCustomButton',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            //TODO add plugin interactionPlugin
            plugins: [dayGridPlugin]
        };
        this.updateEvents();
    }
    eventClick(model) {
        console.log(model);
    }
    eventDragStop(model) {
        console.log(model);
    }
    dateClick(model) {
        console.log(model);
    }
    updateEvents() {
        this.eventsModel = [{
            title: 'Updaten Event',
            start: this.yearMonth + '-08',
            end: this.yearMonth + '-10'
        }];
    }
    get yearMonth(): string {
        const dateObj = new Date();
        return dateObj.getUTCFullYear() + '-' + (dateObj.getUTCMonth() + 1);
    }
}

