import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import {RouterModule, Route} from '@angular/router';
import { COAComponent } from './coa/coa.component';
import { VoucherComponent } from './voucher/voucher.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainComponent } from '../Layout/main/main.component';
import { UpdateCoaComponent } from './coa/update-coa/update-coa.component';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppModule } from 'src/app/app.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { AppComponent } from 'src/app/app.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import { BudgettingComponent } from './budgetting/budgetting.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SettingsComponent } from './settings/settings.component';
import { CoaNotesComponent } from './settings/coa-notes/coa-notes.component';
import { AddNoteComponent } from './settings/coa-notes/add-note/add-note.component';
import { VoucherSupervisionComponent } from './voucher-supervision/voucher-supervision.component';
import { LedgerComponent } from './AccountReports/ledger/ledger.component';
import { BudgetReportComponent } from './AccountReports/budget-report/budget-report.component';
import { BalanceSheetComponent } from './AccountReports/balance-sheet/balance-sheet.component';
import { CashbookComponent } from './AccountReports/cashbook/cashbook.component';
import { PLStatComponent } from './AccountReports/plstat/plstat.component';
import { TrialBalanceComponent } from './AccountReports/trial-balance/trial-balance.component';
import { DayTransactionComponent } from './day-transaction/day-transaction.component';
import { VoucherDetailsComponent } from './voucher/voucher-details/voucher-details.component';
import { AuthGuard } from 'src/app/auth.guard';
import { Voucher2Component } from './voucher2/voucher2.component';
import { PriceCheckerComponent } from '../Inventory/price-checker/price-checker.component';
import { PaymentComponent } from './DesiAccounts/payment/payment.component';
import { ExpenseComponent } from './DesiAccounts/expense/expense.component';
import { ReceiptComponent } from './DesiAccounts/receipt/receipt.component';
import { IncomeComponent } from './DesiAccounts/income/income.component';
import { BankDepositAndWithdrawComponent } from './DesiAccounts/bank-deposit-and-withdraw/bank-deposit-and-withdraw.component';
import { AddBankComponent } from './DesiAccounts/add-bank/add-bank.component';
import { AddCoaComponent } from './DesiAccounts/add-coa/add-coa.component';
import { ProfitWithdrawalComponent } from './DesiAccounts/profit-withdrawal/profit-withdrawal.component';
import { OpeningCashComponent } from './DesiAccounts/opening-cash/opening-cash.component';
import { AccountAdjustmentComponent } from './DesiAccounts/account-adjustment/account-adjustment.component';
import { PartyOpeningBalanceComponent } from './DesiAccounts/party-opening-balance/party-opening-balance.component';
import { AddReceiptComponent } from './DesiAccounts/receipt/add-receipt/add-receipt.component';
import { AdddwComponent } from './DesiAccounts/bank-deposit-and-withdraw/adddw/adddw.component';
import { AddExpenseComponent } from './DesiAccounts/expense/add-expense/add-expense.component';
import { AddIncomeComponent } from './DesiAccounts/income/add-income/add-income.component';
import { AddOpeningComponent } from './DesiAccounts/opening-cash/add-opening/add-opening.component';
import { AddPaymentComponent } from './DesiAccounts/payment/add-payment/add-payment.component';
import { AddWithdrawalComponent } from './DesiAccounts/profit-withdrawal/add-withdrawal/add-withdrawal.component';
import { FilterPipe } from 'src/app/Shared/pipes/filter/filter.pipe';
import { LFilterPipe } from 'src/app/Shared/Pipe/LFilter/lfilter.pipe';
import { PipesModule } from 'src/app/Shared/pipes/pipes.module';
import { AddBalanceComponent } from './DesiAccounts/party-opening-balance/add-balance/add-balance.component';








export const accountRountes: Route[] = [
  
    {path:'dashboard', component:DashboardComponent,  canActivate:[AuthGuard]},
    {path:'coa', component:COAComponent,  canActivate:[AuthGuard]},
    {path:'voucher', component:Voucher2Component,canActivate:[AuthGuard]  },
    {path:'bdgtng', component:BudgettingComponent, canActivate:[AuthGuard] },
    {path:'setting', component:SettingsComponent, canActivate:[AuthGuard] },
    {path:'dtran', component:DayTransactionComponent, canActivate:[AuthGuard] },
    {path:'spvn', component:VoucherSupervisionComponent,canActivate:[AuthGuard]  },
    {path:'ldgrrpt', component:LedgerComponent, canActivate:[AuthGuard] },
    {path:'bdgrpt', component:BudgetReportComponent, canActivate:[AuthGuard] },
    {path:'bsrpt', component:BalanceSheetComponent, canActivate:[AuthGuard] },
    {path:'cbrpt', component:CashbookComponent, canActivate:[AuthGuard] },
    {path:'plrpt', component:PLStatComponent, canActivate:[AuthGuard] },
    {path:'tbrpt', component:TrialBalanceComponent, canActivate:[AuthGuard] },

    /// Desi Accounts Imports
    {path: 'pmt',component: PaymentComponent,canActivate: [AuthGuard]},
    {path: 'exp',component: ExpenseComponent, canActivate: [AuthGuard]}, 
    {path: 'rcpt',component: ReceiptComponent,canActivate: [AuthGuard]},
    {path: 'inc',component: IncomeComponent, canActivate: [AuthGuard]},
    {path: 'bdw',component: BankDepositAndWithdrawComponent,canActivate: [AuthGuard]},
    {path: 'adbnk',component: AddBankComponent,canActivate: [AuthGuard]},
    {path: 'acoa',component: AddCoaComponent,canActivate: [AuthGuard]},
    {path: 'pftwd',component: ProfitWithdrawalComponent,canActivate: [AuthGuard]},  
    {path: 'opc',component: OpeningCashComponent,canActivate: [AuthGuard]},
    {path: 'accadj', component: AccountAdjustmentComponent,canActivate: [AuthGuard]},     
    {path: 'pob',component: PartyOpeningBalanceComponent,canActivate: [AuthGuard]},    
  
    {path:'**', redirectTo:'home',pathMatch:'full'}
  
 
  ];

@NgModule({
  declarations: [
    DashboardComponent,
    UpdateCoaComponent,
    VoucherComponent,
    BudgettingComponent,
    SettingsComponent,
    CoaNotesComponent,
    AddNoteComponent,
    VoucherSupervisionComponent,
    LedgerComponent,
    BudgetReportComponent,
    BalanceSheetComponent,
    CashbookComponent,
    PLStatComponent,
    TrialBalanceComponent,
    DayTransactionComponent,
    VoucherDetailsComponent,
    Voucher2Component,
    PaymentComponent,
    ExpenseComponent,
    ReceiptComponent,
    IncomeComponent,
    BankDepositAndWithdrawComponent,
    AddBankComponent,
    AddCoaComponent,
    ProfitWithdrawalComponent,
    OpeningCashComponent,
    AccountAdjustmentComponent,
    PartyOpeningBalanceComponent,
    AddReceiptComponent,
    AdddwComponent,
    AddExpenseComponent,
    AddIncomeComponent,
    AddOpeningComponent,
    AddPaymentComponent,
    AddWithdrawalComponent,
    COAComponent,
    AddBalanceComponent
   
    
    
  

    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(accountRountes),
    MaterialModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
 
    //Ng2SearchPipeModule,
    MatFormFieldModule,
    ChartModule,
    NgxMatSelectSearchModule
    
    
    
  ],
  exports:[
    RouterModule,
  
  
    
    
  ],
  providers: [{ provide: HIGHCHARTS_MODULES, useFactory: () => [  ] }, NotificationService],

})
export class AccountsModule { }
