import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddSwingComponent } from './add-swing/add-swing.component';
import { ParkSaleComponent } from './park-sale/park-sale.component';
import { Route, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
// import { TextMaskModule } from 'angular2-text-mask';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { ParkClosingSheetComponent } from './parkReports/park-closing-sheet/park-closing-sheet.component';
import { SaleRptswingWiseComponent } from './parkReports/sale-rptswing-wise/sale-rptswing-wise.component';
import { SalerptdaywiseComponent } from './parkReports/salerptdaywise/salerptdaywise.component';
import { SaledetailrptdatewiseComponent } from './parkReports/saledetailrptdatewise/saledetailrptdatewise.component';
import { SalesummarydateuserwiseComponent } from './parkReports/salesummarydateuserwise/salesummarydateuserwise.component';
import { AuthGuard } from 'src/app/auth.guard';
import { SalesummaryrptswingwiseComponent } from './parkReports/salesummaryrptswingwise/salesummaryrptswingwise.component';
import { NgxMaterialTimepicker24HoursFaceComponent } from 'ngx-material-timepicker/src/app/material-timepicker/components/timepicker-24-hours-face/ngx-material-timepicker-24-hours-face.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { TicketDetailComponent } from './park-sale/ticket-detail/ticket-detail.component';
import { ParkDashBoardComponent } from './park-dash-board/park-dash-board.component';
import { ChartModule,HIGHCHARTS_MODULES } from 'angular-highcharts';
import { ActiveMemberRptComponent } from './parkReports/active-member-rpt/active-member-rpt.component';
import { PipesModule } from 'src/app/Shared/pipes/pipes.module';
import { DirectivesModule } from 'src/app/Shared/directives/directives.module';



export const parkRoutes: Route[] = [

  {path:'addswng', component:AddSwingComponent,data: { title: 'Swing' },canActivate:[AuthGuard] },
  {path:'psale', component:ParkSaleComponent,data: { title: 'Sale' },canActivate:[AuthGuard] },
  {path:'pcs', component:ParkClosingSheetComponent,data: { title: 'Closing Sheet' },canActivate:[AuthGuard] },
  {path:'srptsw', component:SaleRptswingWiseComponent,data: { title: 'Sale Rpt Swing' },canActivate:[AuthGuard] },
  {path:'srptdw', component:SalerptdaywiseComponent,data: { title: 'Sale Rpt Daywise' },canActivate:[AuthGuard] },
  {path:'sdrptdw', component:SaledetailrptdatewiseComponent,data: { title: 'Sale Detail Datewise' },canActivate:[AuthGuard] },
  {path:'ssrptduw', component:SalesummarydateuserwiseComponent,data: { title: 'Sale Summary Datewise' },canActivate:[AuthGuard] },
  {path:'ssrptdsw', component:SalesummaryrptswingwiseComponent,data: { title: 'Sale Summary Swingwise' },canActivate:[AuthGuard] },
  {path:'prkdshbrd', component:ParkDashBoardComponent,data: { title: 'Park Dashboard' },canActivate:[AuthGuard] },
  {path:'amrpt', component:ActiveMemberRptComponent,data: { title: 'Active Member List' },canActivate:[AuthGuard] },

  
  {path:'**', redirectTo:'home',pathMatch:'full'}


];


@NgModule({
  declarations: [
    AddSwingComponent,
    ParkSaleComponent,
    ParkClosingSheetComponent,
    SaleRptswingWiseComponent,
    SalerptdaywiseComponent,
    SaledetailrptdatewiseComponent,
    SalesummarydateuserwiseComponent,
    SalesummaryrptswingwiseComponent,
    TicketDetailComponent,
    ParkDashBoardComponent,
    ActiveMemberRptComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(parkRoutes),
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxMatSelectSearchModule,
    // TextMaskModule,
    //Ng2SearchPipeModule,
    NgxMaterialTimepickerModule,
    ChartModule,
    PipesModule,
    DirectivesModule
  ],
  exports: [
    RouterModule
  ],
  providers: [{ provide: HIGHCHARTS_MODULES, useFactory: () => [  ] }],
})
export class ParkModuleModule { }
