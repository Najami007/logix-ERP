import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlotNatureComponent } from './Configuration/plot-nature/plot-nature.component';
import { PlotTypeComponent } from './Configuration/plot-type/plot-type.component';
import { PlotCategoryComponent } from './Configuration/plot-category/plot-category.component';
import { PaymentPlanComponent } from './Configuration/payment-plan/payment-plan.component';
import { PlotComponent } from './Configuration/plot/plot.component';
import { AuthGuard } from 'src/app/auth.guard';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChartModule } from 'angular-highcharts';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { PipesModule } from 'src/app/Shared/pipes/pipes.module';
import { PlotCategoryTableComponent } from './Configuration/plot-category/plot-category-table/plot-category-table.component';
import { PlotTypeTableComponent } from './Configuration/plot-type/plot-type-table/plot-type-table.component';
import { PlotNatureTableComponent } from './Configuration/plot-nature/plot-nature-table/plot-nature-table.component';
import { PlotTableComponent } from './Configuration/plot/plot-table/plot-table.component';
import { MemberProfileComponent } from './member-profile/member-profile.component';
import { SocietyDashboardComponent } from './society-dashboard/society-dashboard.component';
import { FileOwnershipComponent } from './file-ownership/file-ownership.component';
import { FileComponent } from './file/file.component';
import { MapPlotComponent } from './map-plot/map-plot.component';
import { FileTransferComponent } from './file-transfer/file-transfer.component';
import { TextMaskModule } from 'angular2-text-mask';





export const societyRoutes: Route[] = [

  {path:'plt', component:PlotComponent,  canActivate:[AuthGuard] },
  {path:'pltcat', component:PlotCategoryComponent,  canActivate:[AuthGuard]},
  {path:'pltntr', component:PlotNatureComponent,  canActivate:[AuthGuard]},
  {path:'plttype', component:PlotTypeComponent,  canActivate:[AuthGuard]},
  {path:'pmtpln', component:PaymentPlanComponent,  canActivate:[AuthGuard]},
  {path:'socdshbrd', component:SocietyDashboardComponent,  canActivate:[AuthGuard]},
  {path:'mmbrprof', component:MemberProfileComponent,  canActivate:[AuthGuard]},
  {path:'file', component:FileComponent,  canActivate:[AuthGuard]},
  {path:'mplt', component:MapPlotComponent,  canActivate:[AuthGuard]},
  {path:'fltrnsfr', component:FileTransferComponent,  canActivate:[AuthGuard]},
  {path:'flownrshp', component:FileOwnershipComponent,  canActivate:[AuthGuard]},
 
  {path:'**', redirectTo:'home',pathMatch:'full'}


];


@NgModule({
  declarations: [
    PlotNatureComponent,
    PlotTypeComponent,
    PlotCategoryComponent,
    PaymentPlanComponent,
    PlotComponent,
    PlotCategoryTableComponent,
    PlotTypeTableComponent,
    PlotNatureTableComponent,
    PlotTableComponent,
    MemberProfileComponent,
    SocietyDashboardComponent,
    FileOwnershipComponent,
    FileComponent,
    MapPlotComponent,
    FileTransferComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(societyRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    //Ng2SearchPipeModule,
    MatFormFieldModule,
    ChartModule,
    NgxMatSelectSearchModule,
     TextMaskModule,
    PipesModule
  ]
})
export class SocietyModule { }
