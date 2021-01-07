import { AppComponent } from './app.component';

import { HeaderComponent, HeaderMobileComponent, SideNavComponent, FooterComponent } from '../components/shared';

import {
    LoginComponent, LogoutComponent, ChangePasswordComponent, AccountManageComponent, AccountAddComponent
} from '../components/account';

import { DashboardComponent } from '../components/dashboard/dashboard.component';

import {
    BankAccountAddComponent, BankAccountDetailComponent, BankAccountEditComponent,
    BankAccountManageComponent
} from '../components/bank-account';

import {
    CustomerFromWizarNavigatorComponent, CustomerFromWizardAsideComponent, CustomerPersonalInformationComponent,
    CustomerAddressDetailComponent, CustomerPaymentDetailComponent, CustomerDiscountDetailComponent,
    CustomerDetailComponent, CustomerAddComponent, CustomerEditComponent, CustomerManageComponent, CustomerShippingaddressComponent, AddCustomerPopupComponent
} from '../components/customer';

import {
    CreditCardAddComponent, CreditCardDetailComponent, CreditCardEditComponent, CreditCardManageComponent
} from '../components/credit-card';

import {
    VendorFromWizardAsideComponent, VendorFromWizarNavigatorComponent, VendorPersonalInformationComponent,
    VendorBillingAddressDetailComponent, VendorShippingAddressDetailComponent, VendorContactDetailComponent, VendorPaymentDetailComponent,
    VendorDiscountDetailComponent, VendorManageComponent, VendorAddComponent, VendorDetailComponent, VendorEditComponent
} from '../components/vendor';


import {
    SalesTaxListComponent, SalesTaxManageComponent, SalesTaxAddComponent, SalesTaxEditComponent, SalesTaxDetailComponent
} from '../components/sales-tax';

import {
    ItemAddComponent, ItemManageComponent, ItemEditComponent, ItemDetailComponent,
    ItemSelectorComponent, ItemSelectedComponent
} from '../components/item';

import {
    InvoiceAddComponent, InvoiceManageComponent, InvoiceEditComponent, InvoiceDetailComponent, InvoiceListComponent,
    InvoiceRecentComponent, InvoicePaymentAddComponent, InvoicePaymentManageComponent, InvoicePaymentListComponent
} from '../components/invoice';

import {
    BillAddComponent, BillEditComponent, BillManageComponent, BillDetailComponent, BillPaymentAddComponent, BillPaymentManageComponent,
    BillListComponent, BillRecentPendingComponent, BillPaymentListComponent
} from '../components/bill';

import { CalendarManageComponent } from '../components/calendar/calendar.component';

import { DefaultIfEmpty } from '../helpers/app.pipes';

import {
    AlphabatesOnlyDirective, AlphabatesWithSpaceOnlyDirective, AlphabatesALevelOneDirective, AlphabatesALevelTwoDirective,
    NumbersOnlyDirective, DecimalNumbersOnlyDirective, AlphaNumericsOnlyDirective, AlphaNumericsLevelOneDirective,
    AlphaNumericsLevelTwoDirective, AlphaNumericsLevelThreeDirective, AlphaNumericsLevelFourDirective, AnythingButWhiteSpaceDirective,
    EmailAddressOnlyDirective, PhoneNumberOnlyDirective, WebUrlOnlyDirective, ZipCodeOnlyDirective
} from '../helpers/app.directives';

import { SettingComponent } from '../components/setting/setting.component';
import { QuotationAddComponent,QuotationDetailComponent,QuotationManageComponent,QuotationEditComponent } from '../components/Quotation';
import { CustomerStatementComponent } from 'src/components/customer-statement/customer-statement.component';
import {AddRecurringinvoiceComponent,EditRecurringInvoiceComponent,ManageRecurringInvoiceComponent,RecurringInvoiceDetailsComponent,
    RecInvoiceFromWizarNavigatorComponent,RecInvoiceFromWizardAsideComponent, RecInvoiceBasicDetailComponent, SetrecinvoiceScheduleComponent, GetRecInvoicePaymentComponent, SendRecinvoiceComponent  } from '../components/recurring-invoice';
import { ChartOfAccountsComponent } from 'src/components/chart-of-account/chart-of-accounts/chart-of-accounts.component';
import { AssetsComponent, EquityComponent, ExpensesComponent, IncomeComponent, LiabilitiesAndCreditCardsComponent } from 'src/components/chart-of-account';
import { AccountBalancesComponent } from 'src/components/reports/account-balances/account-balances.component';
import { AccountTransactionsComponent } from 'src/components/reports/account-transactions/account-transactions.component';
import { AgedPayablesComponent } from 'src/components/reports/aged-payables/aged-payables.component';
import { AgedReceivablesComponent } from 'src/components/reports/aged-receivables/aged-receivables.component';
import { BalanceSheetComponent } from 'src/components/reports/balance-sheet/balance-sheet.component';
import { CashFlowComponent } from 'src/components/reports/cash-flow/cash-flow.component';
import { IncomeByCustomerComponent } from 'src/components/reports/income-by-customer/income-by-customer.component';
import { ProfitAndLossComponent } from 'src/components/reports/profit-and-loss/profit-and-loss.component';
import { PurchasesByVendorComponent } from 'src/components/reports/purchases-by-vendor/purchases-by-vendor.component';
import { SalesTaxReportComponent } from 'src/components/reports/sales-tax-report/sales-tax-report.component';
import { TrialBalanceComponent } from 'src/components/reports/trial-balance/trial-balance.component';
import { AddNewAccountComponent } from 'src/components/chart-of-account/add-new-account/add-new-account.component';
import { TransactionComponent } from 'src/components/transaction/transaction/transaction.component';
import { AddCustomerPaymentComponent } from 'src/components/customer/add-customer-payment/add-customer-payment.component';
import { AddVendorPaymentComponent } from 'src/components/vendor/add-vendor-payment/add-vendor-payment.component';
import { ReportMenuComponent } from 'src/components/reports/report-menu/report-menu.component';
import { SubAccountsComponent } from 'src/components/chart-of-account/sub-accounts/sub-accounts.component';

export const appDeclarations = [
    DefaultIfEmpty,
    AlphabatesOnlyDirective,
    AlphabatesWithSpaceOnlyDirective,
    AlphabatesALevelOneDirective,
    AlphabatesALevelTwoDirective,
    DecimalNumbersOnlyDirective,
    NumbersOnlyDirective,
    AlphaNumericsOnlyDirective,
    AlphaNumericsLevelOneDirective,
    AlphaNumericsLevelTwoDirective,
    AlphaNumericsLevelThreeDirective,
    AlphaNumericsLevelFourDirective,
    AnythingButWhiteSpaceDirective,
    EmailAddressOnlyDirective,
    PhoneNumberOnlyDirective,
    WebUrlOnlyDirective,
    ZipCodeOnlyDirective,
    AppComponent,
    HeaderMobileComponent,
    HeaderComponent,
    SideNavComponent,
    FooterComponent,
    LoginComponent,
    LogoutComponent,
    ChangePasswordComponent,
    DashboardComponent,
    AccountAddComponent,
    AccountManageComponent,
    BankAccountAddComponent,
    BankAccountDetailComponent,
    BankAccountEditComponent,
    BankAccountManageComponent,
    CustomerFromWizarNavigatorComponent,
    CustomerFromWizardAsideComponent,
    CustomerPersonalInformationComponent,
    CustomerAddressDetailComponent,
    CustomerShippingaddressComponent,
    CustomerPaymentDetailComponent,
    CustomerDiscountDetailComponent,
    CustomerAddComponent,
    AddCustomerPopupComponent,
   
    CustomerDetailComponent,
    CustomerEditComponent,
    CustomerManageComponent,
    CreditCardAddComponent,
    CreditCardDetailComponent,
    CreditCardEditComponent,
    CreditCardManageComponent,
    VendorFromWizardAsideComponent,
    VendorFromWizarNavigatorComponent,
    VendorPersonalInformationComponent,
    VendorBillingAddressDetailComponent,
    VendorShippingAddressDetailComponent,
    VendorContactDetailComponent,
    VendorPaymentDetailComponent,
    VendorDiscountDetailComponent,
    VendorAddComponent,
    VendorDetailComponent,
    VendorEditComponent,
    VendorManageComponent,
    SalesTaxListComponent,
    ItemAddComponent,
    ItemEditComponent,
    ItemManageComponent,
    ItemDetailComponent,
    ItemSelectorComponent,
    ItemSelectedComponent,
    InvoiceAddComponent,
    InvoiceManageComponent,
    InvoiceEditComponent,
    InvoiceDetailComponent,
    InvoiceRecentComponent,
    InvoicePaymentAddComponent,
    InvoicePaymentManageComponent,
    InvoicePaymentListComponent,
    BillAddComponent,
    BillManageComponent,
    BillDetailComponent,
    BillEditComponent,
    BillListComponent,
    BillPaymentAddComponent,
    BillPaymentListComponent,
    BillRecentPendingComponent,
    BillPaymentManageComponent,
    SettingComponent,
    CalendarManageComponent,
    InvoiceListComponent,
    SalesTaxManageComponent,
    SalesTaxAddComponent,
    SalesTaxEditComponent,
    SalesTaxDetailComponent,
    QuotationAddComponent,
    QuotationDetailComponent,
    QuotationManageComponent,
    QuotationEditComponent,
    CustomerStatementComponent,
    AddRecurringinvoiceComponent,
    EditRecurringInvoiceComponent,
    ManageRecurringInvoiceComponent,
    RecurringInvoiceDetailsComponent,
    RecInvoiceFromWizarNavigatorComponent,
    RecInvoiceFromWizardAsideComponent,
    RecInvoiceBasicDetailComponent,
    SetrecinvoiceScheduleComponent,
    GetRecInvoicePaymentComponent,
    SendRecinvoiceComponent,
    ChartOfAccountsComponent,
    AssetsComponent,
    EquityComponent,
    ExpensesComponent,
    IncomeComponent,
    LiabilitiesAndCreditCardsComponent,
    AccountBalancesComponent,
    AccountTransactionsComponent,
    AgedPayablesComponent,
    AgedReceivablesComponent,
    BalanceSheetComponent,
    CashFlowComponent,
    IncomeByCustomerComponent,
    ProfitAndLossComponent,
    PurchasesByVendorComponent,
    SalesTaxReportComponent,
    TrialBalanceComponent,
    AddNewAccountComponent,
    TransactionComponent,
    AddCustomerPaymentComponent,
    AddVendorPaymentComponent,
    ReportMenuComponent,
    SubAccountsComponent
    

];
