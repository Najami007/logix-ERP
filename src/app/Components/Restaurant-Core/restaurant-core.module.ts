import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { SaleComponent } from './sale/sale.component';
import { AuthGuard } from 'src/app/auth.guard';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChartModule } from 'angular-highcharts';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { TextMaskModule } from 'angular2-text-mask';



export const restCore: Route[] = [

  {path:'sale', component:SaleComponent, canActivate:[AuthGuard] },

  
  {path:'**', redirectTo:'home',pathMatch:'full'}


];


@NgModule({
  declarations: [
    SaleComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(restCore),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    MatFormFieldModule,
    ChartModule,
    NgxMatSelectSearchModule,
    TextMaskModule
  ],
  exports: [
    RouterModule
  ]
})
export class RestaurantCoreModule { }
