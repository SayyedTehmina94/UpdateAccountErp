import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/helpers';

@Injectable()
export class DashboardService {

  constructor(private http: HttpClient,
    private appSettings: AppSettings) { }

 

  getSalesExpenseChartData() {
    return this.http.get(this.appSettings.ApiBaseUrl + 'Dashboard/get-sales-expense');
  }

  
}
