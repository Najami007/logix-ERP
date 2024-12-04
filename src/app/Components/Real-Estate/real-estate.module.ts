import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { ReservationComponent } from './reservation/reservation.component';
import { CheckInComponent } from './check-in/check-in.component';
import { FeatureCategoryComponent } from './feature-category/feature-category.component';
import { FeaturesComponent } from './features/features.component';
import { PropertyTypeComponent } from './property-type/property-type.component';
import { PropertyComponent } from './property/property.component';
import { AddPropertyComponent } from './property/add-property/add-property.component';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChartModule } from 'angular-highcharts';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { TextMaskModule } from 'angular2-text-mask';
import { PipesModule } from 'src/app/Shared/pipes/pipes.module';
import { AuthGuard } from 'src/app/auth.guard';
import { AddReservationComponent } from './reservation/add-reservation/add-reservation.component';
import { RestDashboardComponent } from './rest-dashboard/rest-dashboard.component';

import HotelDatePicker from 'vue-hotel-datepicker';
import { PropertyDetailComponent } from './property/property-detail/property-detail.component'
import { NgImageSliderModule } from 'ng-image-slider';


export const realEstateRoutes: Route[] = [

  {path:'restdsbrd', component:RestDashboardComponent,  canActivate:[AuthGuard] },
  {path:'prprty', component:PropertyComponent,  canActivate:[AuthGuard] },
  {path:'rsrvtn', component:ReservationComponent,  canActivate:[AuthGuard] },
  {path:'chkin', component:CheckInComponent,  canActivate:[AuthGuard] },
  {path:'ftrs', component:FeaturesComponent,  canActivate:[AuthGuard] },
  {path:'ftrcat', component:FeatureCategoryComponent,  canActivate:[AuthGuard] },
  {path:'prptytyp', component:PropertyTypeComponent,  canActivate:[AuthGuard] },
 
  {path:'**', redirectTo:'home',pathMatch:'full'}


];


@NgModule({
  declarations: [
    ReservationComponent,
    CheckInComponent,
    FeatureCategoryComponent,
    FeaturesComponent,
    PropertyTypeComponent,
    PropertyComponent,
    AddPropertyComponent,
    AddReservationComponent,
    RestDashboardComponent,
    PropertyDetailComponent,
   
  
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(realEstateRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    //Ng2SearchPipeModule,
    MatFormFieldModule,
    ChartModule,
    NgxMatSelectSearchModule,
    TextMaskModule,
    PipesModule,
    NgImageSliderModule
  
    
  

  ]
})
export class RealEstateModule { }
