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
import { SwingFormComponent } from './add-swing/swing-form/swing-form.component';
import { ParkClosingSheetComponent } from './parkReports/park-closing-sheet/park-closing-sheet.component';
import { SaleRptswingWiseComponent } from './parkReports/sale-rptswing-wise/sale-rptswing-wise.component';



export const parkRoutes: Route[] = [

  {path:'addswng', component:AddSwingComponent },
  {path:'psale', component:ParkSaleComponent },
  {path:'pcs', component:ParkClosingSheetComponent },
  {path:'srptsw', component:SaleRptswingWiseComponent },

  
  {path:'**', redirectTo:'home',pathMatch:'full'}


];


@NgModule({
  declarations: [
    AddSwingComponent,
    ParkSaleComponent,
    SwingFormComponent,
    ParkClosingSheetComponent,
    SaleRptswingWiseComponent
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
