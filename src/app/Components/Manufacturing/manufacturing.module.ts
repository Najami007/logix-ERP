import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { MarbleSaleComponent } from './marble-sale/marble-sale.component';
import { AuthGuard } from 'src/app/auth.guard';
import { ItemProductionComponent } from './item-production/item-production.component';
import { AddFinishedItemComponent } from './item-production/add-finished-item/add-finished-item.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ChartModule } from 'angular-highcharts';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { PipesModule } from 'src/app/Shared/pipes/pipes.module';
import { QRCodeModule } from 'angularx-qrcode';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { CompanyModule } from '../Company/company.module';
import { DirectivesModule } from 'src/app/Shared/directives/directives.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';



export const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};



export const manufacturingRoutes: Route[] = [


  { path: 'marbleSale', component: MarbleSaleComponent, data: { title: 'Sale' }, canActivate: [AuthGuard] },
    { path: 'itemproduction', component: ItemProductionComponent, data: { title: 'Item Production' }, canActivate: [AuthGuard] },

]



@NgModule({
  declarations: [
    MarbleSaleComponent,
    ItemProductionComponent,
    AddFinishedItemComponent
  ],
  imports: [
    CommonModule,
    CommonModule,
        RouterModule.forChild(manufacturingRoutes),
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        NgxMatSelectSearchModule,
        TextMaskModule,
        //Ng2SearchPipeModule,
        NgxMaterialTimepickerModule,
        ScrollingModule,
        ChartModule,
        NgxBarcode6Module,
        PipesModule,
        QRCodeModule,
        NgSelectModule,
        SharedComponentsModule,
        CompanyModule,
        DirectivesModule
  ],
  providers: [
      { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
      { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
    ]
})
export class ManufacturingModule { }
