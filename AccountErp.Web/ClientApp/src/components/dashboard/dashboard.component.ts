import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { DataTableDirective } from 'angular-datatables';
import { SelectListItemModel, InvoiceFilterModel, DataTableResponseModel } from 'src/models';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InvoiceService, CustomerService } from 'src/services';
import { AppUtils, AppSettings } from 'src/helpers';
import { AUTO_STYLE } from '@angular/animations';
import { DashboardService } from 'src/services/dashboard.service';

declare var appConfig: any;

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit {
  @BlockUI('container-blockui') blockUI: NgBlockUI;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  dtOptionsInvoice: DataTables.Settings = {};
  dtOptionsBills: DataTables.Settings = {};
  
  dtInstance: DataTables.Api;
  rowIndex = 0;
  pageLength = 10;
  search: any = null;
  customers: Array<SelectListItemModel> = new Array<SelectListItemModel>();
  filterModel: InvoiceFilterModel = new InvoiceFilterModel();
  chartData={expenseData:[],salesData:[]};
  salesChartData=[];
  expenseChartData=[];
 
  constructor(private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private invoiceService: InvoiceService,
    private appUtils: AppUtils,
    private appSettings: AppSettings,
    private dashboardService:DashboardService,
    private customerService: CustomerService) { 
        let body = document.getElementsByTagName('body')[0];
        body.classList.remove("loginScreen");   //remove the class
    }


   
    ngOnInit() {
        setTimeout(() => {
            appConfig.initKTDefaults();
            
        }, 500);
        if(localStorage.getItem("sidebarValue") == "1"){
             $.getScript('assets/js/sideNav.js');
             localStorage.setItem("sidebarValue","2");
        }
           this.loadChartData();
            this.getTopfiveInoices();
            this.getTopfiveBills();
     
    }
    loadChartData(){
        this.barChartData=[ { data: [], label: 'Sales' }];
        this.lineChartData=[ { data: [], label: 'Expense' }];
      this.blockUI.start();
      this.dashboardService.getSalesExpenseChartData().subscribe(
          (data: any) => {
              this.blockUI.stop();
              
              Object.assign(this.chartData, data);
           
            this.salesChartData=this.chartData.salesData;

            this.expenseChartData=this.chartData.expenseData;
            this.barChartData=[ { data: this.salesChartData, label: 'Sales' }];
            this.lineChartData=[ { data: this.expenseChartData, label: 'Expense' }];
              console.log("chart data",this.salesChartData)
          },
          error => {
              this.blockUI.stop();
              this.appUtils.ProcessErrorResponse(this.toastr, error);
          });
    }
    getTopfiveInoices(){
      const self = this;
      this.dtOptionsInvoice = {
          dom: '<"top">rt<"clear">',
          serverSide: true,
          processing: true,
          language: {
              loadingRecords: '&nbsp;',
              processing: '<div class="block-ui-spinner"><div class="loader"></div></div>',
              searchPlaceholder: 'Filter invoice...',
            
          },
          search: { search: self.search },
          stateSave: true,
          ajax: (dataTablesParameters: any, callback) => {

              dataTablesParameters.customerId = self.filterModel.customerId;
              dataTablesParameters.filterKey = self.filterModel.filterKey;
              
            

              self.http
                  .post<DataTableResponseModel>(this.appSettings.ApiBaseUrl + 'Invoice/getTopFiveInvoice', dataTablesParameters, {})
                  .subscribe(resp => {
                      callback({
                          recordsTotal: resp.recordsTotal,
                          recordsFiltered: resp.recordsFiltered,
                          data: resp.data
                      });
                  });
          },
          columns: [
              {
                  data: 'invoiceNumber',
                  title: 'Invoice#',
                  width: '20%',
                 
              },
              {
                  data: 'customerName',
                  title: 'Customer',
                  width: '25%'
              },
              {
                  className: 'text-right',
                  data: 'totalAmount',
                  title: 'Amount',
                  width: '15%',
                  render: function (data, type, row) {
                      return `<span class='m-r-15'>${self.appUtils.toMoney(data)}</span>`;
                  }
              },
              {
                  data: 'status',
                  title: 'Status',
                  width: '15%',
                  render: function (data, type, row) {
                      return data === 0
                          ? `<span class='badge badge-dark'>Pending</span>`
                          : data === 1 ?
                              `<span class='badge badge-success'>Paid</span>`
                          : data === 2 ?
                              `<span class='inactiveStatus'>Deleted</span>`
                              : `<span class='badge overdue'>Overdue</span>`;
                  }
              },
              {
                  data: 'createdOn',
                  title: 'Date',
                  width: '15%',
                  render: function (data) {
                      return self.appUtils.getFormattedDate(data, null);
                  }
              },
             
          ],
        
        
      };
    }

    getTopfiveBills(){
      const self = this;
      this.dtOptionsBills = {
          dom: '<"top">rt<"clear">',
          serverSide: true,
          processing: true,
          language: {
              loadingRecords: '&nbsp;',
              processing: '<div class="block-ui-spinner"><div class="loader"></div></div>',
              searchPlaceholder: 'Filter invoice...',
            
          },
          search: { search: self.search },
          stateSave: true,
          ajax: (dataTablesParameters: any, callback) => {

              dataTablesParameters.customerId = self.filterModel.customerId;
              dataTablesParameters.filterKey = self.filterModel.filterKey;
              
            

              self.http
                  .post<DataTableResponseModel>(this.appSettings.ApiBaseUrl + 'Bill/getTopFiveBills', dataTablesParameters, {})
                  .subscribe(resp => {
                      callback({
                          recordsTotal: resp.recordsTotal,
                          recordsFiltered: resp.recordsFiltered,
                          data: resp.data
                      });
                  });
          },
          columns: [
            {
            data: 'billNumber',
                  title: 'Bill#',
                  width: '20%',
                 
            },
            {
                data: 'vendorName',
                title: 'Vendor',
                width: '25%'
            },
            {
                className: 'text-right',
                data: 'totalAmount',
                title: 'Amount',
                width: '15%',
                render: function (data, type, row) {
                    return `<span class="m-r-15">${self.appUtils.toMoney(data)}</span>`;
                }
            },
            {
                data: 'status',
                title: 'Status',
                width: '15%',
                render: function (data, type, row) {
                    return data === 0
                        ? `<span class='badge badge-dark'>Pending</span>`
                        : data === 1 ?
                            `<span class='badge badge-success'>Paid</span>`
                        : data === 2 ?
                            `<span class='inactiveStatus'>Deleted</span>`
                            : `<span class='badge overdue'>Overdue</span>`;
                }
            },
            {
                data: 'createdOn',
                title: 'Date',
                width: '15%',
                render: function (data) {
                    return self.appUtils.getFormattedDate(data, null);
                }
            },
          
        ],
        
        
      };
    }
    // Expense chart
   
    lineChartData: ChartDataSets[] = [];
    
      lineChartLabels: Label[] = ['','Jan', 'Feb', 'Mar', 'Apr', 'May', 'June','July','Aug','Sept','Oct','Nov','Dec'];
    
      lineChartOptions = {
        responsive: true,
      };
    
      lineChartColors: Color[] = [
        {
         
          backgroundColor: '#5d78ff',
        },
      ];
    
      lineChartLegend = true;
      lineChartPlugins = [];
      lineChartType = 'bar';

    // Sales chart 

    barChartData: ChartDataSets[] = [];
    
      barChartLabels: Label[] = ['','Jan', 'Feb', 'Mar', 'Apr', 'May', 'June','July','Aug','Sept','Oct','Nov','Dec'];
    
      barChartOptions = {
        responsive: true,
      };
    
      barChartColors: Color[] = [
        {
          borderColor: 'rgb(2, 105, 2)',
          backgroundColor: '#0abb87',
        },
      ];
    
      barChartLegend = true;
      barChartPlugins = [];
      barChartType = 'bar';

    // //   pie chart
    // pieChartData: ChartDataSets[] = [
    //     { data: [185, 72, 78, 75, 77, 75], label: 'Sales' },
       
    //   ];
    
    //   pieChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June'];
    
    //   pieChartOptions = {
    //     responsive: true,
    //   };
    
    // //   pieChartColors: Color[] = [
    // //     {
    // //       borderColor: 'rgb(2, 105, 2)',
    // //       backgroundColor: '#0abb87',
    // //     },
    // //   ];
    
    //   pieChartLegend = true;
    //   pieChartPlugins = [];
    //   pieChartType = 'pie';


      
}

