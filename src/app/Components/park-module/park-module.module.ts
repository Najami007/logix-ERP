import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddSwingComponent } from './add-swing/add-swing.component';
import { ParkSaleComponent } from './park-sale/park-sale.component';
import { Route, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { TextMaskModule } from 'angular2-text-mask';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { ParkClosingSheetComponent } from './parkReports/park-closing-sheet/park-closing-sheet.component';
import { SaleRptswingWiseComponent } from './parkReports/sale-rptswing-wise/sale-rptswing-wise.component';
import { SalerptdaywiseComponent } from './parkReports/salerptdaywise/salerptdaywise.component';
import { SaledetailrptdatewiseComponent } from './parkReports/saledetailrptdatewise/saledetailrptdatewise.component';
import { SalesummarydateuserwiseComponent } from './parkReports/salesummarydateuserwise/salesummarydateuserwise.component';
import { AuthGuard } from 'src/app/auth.guard';
import { SalesummaryrptswingwiseComponent } from './parkReports/salesummaryrptswingwise/salesummaryrptswingwise.component';



export const parkRoutes: Route[] = [

  {path:'addswng', component:AddSwingComponent,canActivate:[AuthGuard] },
  {path:'psale', component:ParkSaleComponent,canActivate:[AuthGuard] },
  {path:'pcs', component:ParkClosingSheetComponent,canActivate:[AuthGuard] },
  {path:'srptsw', component:SaleRptswingWiseComponent,canActivate:[AuthGuard] },
  {path:'srptdw', component:SalerptdaywiseComponent,canActivate:[AuthGuard] },
  {path:'sdrptdw', component:SaledetailrptdatewiseComponent,canActivate:[AuthGuard] },
  {path:'ssrptduw', component:SalesummarydateuserwiseComponent,canActivate:[AuthGuard] },
  {path:'ssrptdsw', component:SalesummaryrptswingwiseComponent,canActivate:[AuthGuard] },

  
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
    SalesummaryrptswingwiseComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(parkRoutes),
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxMatSelectSearchModule,
    TextMaskModule,
    Ng2SearchPipeModule,
  ],
  exports: [
    RouterModule
  ]
})
export class ParkModuleModule { }
