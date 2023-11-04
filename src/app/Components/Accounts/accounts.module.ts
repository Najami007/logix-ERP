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






export const accountRountes: Route[] = [
  
    {path:'dashboard', component:DashboardComponent,  },
    {path:'coa', component:COAComponent,  },
    {path:'voucher', component:VoucherComponent,  },
    {path:'bdgtng', component:BudgettingComponent,  },
    {path:'setting', component:SettingsComponent,  },
    {path:'dtran', component:DayTransactionComponent,  },
    {path:'spvn', component:VoucherSupervisionComponent,  },
    {path:'ldgrrpt', component:LedgerComponent,  },
    {path:'bdgrpt', component:BudgetReportComponent,  },
    {path:'bsrpt', component:BalanceSheetComponent,  },
    {path:'cbrpt', component:CashbookComponent,  },
    {path:'plrpt', component:PLStatComponent,  },
    {path:'tbrpt', component:TrialBalanceComponent,  },
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
