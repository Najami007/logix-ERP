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






export const accountRountes: Route[] = [
  
    {path:'dashboard', component:DashboardComponent,  canActivate:[AuthGuard]},
    {path:'coa', component:COAComponent,  canActivate:[AuthGuard]},
    {path:'voucher', component:VoucherComponent,canActivate:[AuthGuard]  },
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

    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(accountRountes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    MatFormFieldModule,
    GlobalDataModule,
    ChartModule,
    NgxMatSelectSearchModule
    
    
    
  ],
  exports:[
    RouterModule
    
  ],
  providers: [{ provide: HIGHCHARTS_MODULES, useFactory: () => [  ] }, NotificationService,GlobalDataModule],

})
export class AccountsModule { }
