import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderManagementComponent } from './order-management/order-management.component';
import { RiderProfileComponent } from './rider-profile/rider-profile.component';
import { AddRiderProfileComponent } from './rider-profile/add-rider-profile/add-rider-profile.component';
import { Route, RouterModule } from '@angular/router';
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
import { AuthGuard } from 'src/app/auth.guard';







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


export const deliveryRoutes: Route[] = [


    { path: 'ordermanage', component: OrderManagementComponent, canActivate: [AuthGuard] },
      { path: 'riderProfile', component: RiderProfileComponent, canActivate: [AuthGuard] },

]


@NgModule({
  declarations: [
    OrderManagementComponent,
    RiderProfileComponent,
    AddRiderProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(deliveryRoutes),
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
export class DeliveryModuleModule { }
