import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { ToastrModule } from 'ngx-toastr';
import { BlockUIModule } from 'ng-block-ui';
import { NgxMaskModule } from 'ngx-mask';
import { appRouting } from './app.routing';
import { FullCalendarModule } from 'ng-fullcalendar';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { ChartsModule } from 'ng2-charts';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

export const appImports = [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    NgbModule,
  
    CommonModule,
    BrowserAnimationsModule,
    DataTablesModule,
    ToastrModule.forRoot(),
    NgxMaskModule.forRoot(),
    BlockUIModule.forRoot({ message: 'Loading...' }),
    appRouting,
    FullCalendarModule,
    SelectDropDownModule,
    ChartsModule,
    AngularFontAwesomeModule,
    // NgxSelectModule
    
];

