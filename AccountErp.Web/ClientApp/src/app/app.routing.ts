import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../helpers';

import {
    LoginComponent, LogoutComponent, ChangePasswordComponent, AccountAddComponent, AccountManageComponent
} from '../components/account';

import { DashboardComponent } from '../components/dashboard/dashboard.component';

import {
    BankAccountAddComponent, BankAccountDetailComponent, BankAccountEditComponent, BankAccountManageComponent
} from '../components/bank-account';

import { CustomerAddComponent, CustomerEditComponent, CustomerDetailComponent, CustomerManageComponent,CustomerShippingaddressComponent, AddCustomerPopupComponent } from 'src/components/customer';

import {
    CreditCardAddComponent, CreditCardDetailComponent, CreditCardEditComponent, CreditCardManageComponent
} from 'src/components/credit-card';

import {
    VendorManageComponent, VendorAddComponent, VendorDetailComponent, VendorEditComponent
} from 'src/components/vendor';

import {
    ItemAddComponent, ItemManageComponent, ItemEditComponent, ItemDetailComponent
} from 'src/components/item';

import {
    InvoiceAddComponent, InvoiceManageComponent, InvoiceEditComponent, InvoiceDetailComponent, InvoicePaymentAddComponent,
    InvoicePaymentManageComponent
} from '../components/invoice';

import {
    BillAddComponent, BillEditComponent, BillManageComponent, BillDetailComponent, BillPaymentAddComponent, BillPaymentManageComponent
} from '../components/bill';

import { CalendarManageComponent } from '../components/calendar/calendar.component';

import { SettingComponent } from '../components/setting/setting.component';

import { SalesTaxAddComponent, SalesTaxEditComponent, SalesTaxDetailComponent, SalesTaxManageComponent } from '../components/sales-tax';
import { QuotationAddComponent } from 'src/components/Quotation/Add/quotation.add/quotation.add.component';
import { QuotationDetailComponent, QuotationManageComponent, QuotationEditComponent } from 'src/components/Quotation';
import { CustomerStatementComponent } from 'src/components/customer-statement/customer-statement.component';
import { AddRecurringinvoiceComponent } from 'src/components/recurring-invoice/add/add.recurringinvoice/add.recurringinvoice.component';
import { EditRecurringInvoiceComponent } from 'src/components/recurring-invoice/Edit/edit-recurring-invoice/edit-recurring-invoice.component';
import { ManageRecurringInvoiceComponent } from 'src/components/recurring-invoice/manage/manage.recurring-invoice/manage.recurring-invoice.component';
import { RecurringInvoiceDetailsComponent } from 'src/components/recurring-invoice/detail/recurring-invoice.details/recurring-invoice.details.component';
import { ChartOfAccountsComponent } from 'src/components/chart-of-account/chart-of-accounts/chart-of-accounts.component';
import { ProfitAndLossComponent } from 'src/components/reports/profit-and-loss/profit-and-loss.component';
import { TransactionComponent } from 'src/components/transaction/transaction/transaction.component';
import { AddCustomerPaymentComponent } from 'src/components/customer/add-customer-payment/add-customer-payment.component';
import { PurchasesByVendorComponent } from 'src/components/reports/purchases-by-vendor/purchases-by-vendor.component';
import { IncomeByCustomerComponent } from 'src/components/reports/income-by-customer/income-by-customer.component';
import { SalesTaxReportComponent } from 'src/components/reports/sales-tax-report/sales-tax-report.component';
import { AccountBalancesComponent } from 'src/components/reports/account-balances/account-balances.component';
import { TrialBalanceComponent } from 'src/components/reports/trial-balance/trial-balance.component';
import { AccountTransactionsComponent } from 'src/components/reports/account-transactions/account-transactions.component';
import { AgedPayablesComponent } from 'src/components/reports/aged-payables/aged-payables.component';
import { AgedReceivablesComponent } from 'src/components/reports/aged-receivables/aged-receivables.component';
import { CashFlowComponent } from 'src/components/reports/cash-flow/cash-flow.component';
import { BalanceSheetComponent } from 'src/components/reports/balance-sheet/balance-sheet.component';
import { AddVendorPaymentComponent } from 'src/components/vendor/add-vendor-payment/add-vendor-payment.component';
import { ReportMenuComponent } from 'src/components/reports/report-menu/report-menu.component';


const appRoutes: Routes = [
    { path: '', component: DashboardComponent, pathMatch: 'full', canActivate: [AuthGuard] },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'account/login', component: LoginComponent },
    { path: 'account/logout', component: LogoutComponent },
    { path: 'account/change-password', component: ChangePasswordComponent },
    { path: 'account/add', component: AccountAddComponent },
    { path: 'account/manage', component: AccountManageComponent },
    { path: 'bank-account/add', component: BankAccountAddComponent },
    { path: 'bank-account/detail/:id', component: BankAccountDetailComponent },
    { path: 'bank-account/edit/:id', component: BankAccountEditComponent },
    { path: 'bank-account/manage', component: BankAccountManageComponent },
    { path: 'customer/add', component: CustomerAddComponent },
    { path: 'customer/customer.shippingaddress', component: CustomerShippingaddressComponent },
    { path: 'customer/detail/:id', component: CustomerDetailComponent },
    { path: 'customer/edit/:id', component: CustomerEditComponent },
    { path: 'customer/manage', component: CustomerManageComponent },
    { path: 'credit-card/add', component: CreditCardAddComponent },
    { path: 'credit-card/detail/:id', component: CreditCardDetailComponent },
    { path: 'credit-card/edit/:id', component: CreditCardEditComponent },
    { path: 'credit-card/manage', component: CreditCardManageComponent },
    { path: 'vendor/add', component: VendorAddComponent },
    { path: 'vendor/detail/:id', component: VendorDetailComponent },
    { path: 'vendor/edit/:id', component: VendorEditComponent },
    { path: 'vendor/manage', component: VendorManageComponent },
    { path: 'item/add', component: ItemAddComponent },
    { path: 'item/edit/:id', component: ItemEditComponent },
    { path: 'item/manage', component: ItemManageComponent },
    { path: 'item/detail/:id', component: ItemDetailComponent },
    { path: 'invoice/add', component: InvoiceAddComponent },
    { path: 'invoice/add/:id', component: InvoiceAddComponent },
    { path: 'invoice/manage', component: InvoiceManageComponent },
    { path: 'invoice/edit/:id', component: InvoiceEditComponent },
    { path: 'invoice/detail/:id', component: InvoiceDetailComponent },
    { path: 'bill/add', component: BillAddComponent },
    { path: 'bill/add/:id', component: BillAddComponent },
    
    { path: 'bill/payment/add', component: BillPaymentAddComponent },
    { path: 'bill/manage', component: BillManageComponent },
    { path: 'bill/detail/:id', component: BillDetailComponent },
    { path: 'bill/edit/:id', component: BillEditComponent },
    { path: 'bill/payment/:id', component: BillPaymentAddComponent },
    { path: 'bill/payments', component: BillPaymentManageComponent },
    { path: 'setting', component: SettingComponent },
    { path: 'calendar', component: CalendarManageComponent },
    { path: 'sales-tax/add', component: SalesTaxAddComponent },
    { path: 'sales-tax/edit/:id', component: SalesTaxEditComponent },
    { path: 'sales-tax/detail/:id', component: SalesTaxDetailComponent },
    { path: 'sales-tax/manage', component: SalesTaxManageComponent },
    { path: 'invoice/payment/:id', component: InvoicePaymentAddComponent },
    { path: 'invoice/payments', component: InvoicePaymentManageComponent },
    { path: 'cust-payment/add-customer-payment', component: AddCustomerPaymentComponent },
    { path: 'cust-payment/add-customer-payment/:id', component: AddCustomerPaymentComponent },
    
    { path: 'Quotation/add/quotation.add', component: QuotationAddComponent },
    { path: 'Quotation/detail/:id', component: QuotationDetailComponent },
    { path: 'Customer/addPopup/add-customer.popup', component: AddCustomerPopupComponent },
    { path: 'Quotation/quotation-manage', component: QuotationManageComponent },
    { path: 'Quotation/edit/:id', component: QuotationEditComponent },
    { path: 'customerStatement', component: CustomerStatementComponent },
    { path: 'recurring-invoice/add', component: AddRecurringinvoiceComponent },
    { path: 'recurring-invoice/edit/:id', component: EditRecurringInvoiceComponent },
    { path: 'recurring-invoice/manage', component: ManageRecurringInvoiceComponent },
    { path: 'recurring-invoice/detail/:id', component: RecurringInvoiceDetailsComponent },
    { path: 'chart-of-account/chart-of-account', component: ChartOfAccountsComponent },
    { path: 'transaction/transaction', component: TransactionComponent },
    { path: 'vend-payment/add-vendor-payment', component: AddVendorPaymentComponent },
    { path: 'vend-payment/add-vendor-payment/:id', component: AddVendorPaymentComponent },

    
    
    { path: 'reports/profit-and-loss', component: ProfitAndLossComponent },
    { path: 'reports/purchases-by-vendors', component: PurchasesByVendorComponent },
    { path: 'reports/income-by-customer', component: IncomeByCustomerComponent },
    { path: 'reports/sales-tax', component: SalesTaxReportComponent },
    { path: 'reports/account-balances', component: AccountBalancesComponent },
    { path: 'reports/trial-balances', component: TrialBalanceComponent },
    { path: 'reports/account-transactions', component: AccountTransactionsComponent },
    { path: 'reports/account-transactions/:id', component: AccountTransactionsComponent },
    
    { path: 'reports/aged-payables', component: AgedPayablesComponent },
    { path: 'reports/aged-receivables', component: AgedReceivablesComponent },
    { path: 'reports/cash-flow', component: CashFlowComponent },
    { path: 'reports/balance-sheet', component: BalanceSheetComponent },
    { path: 'reports/report-menu', component: ReportMenuComponent },

   
   
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const appRouting = RouterModule.forRoot(appRoutes);
