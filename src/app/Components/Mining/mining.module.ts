import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleComponent } from './machinery/vehicle/vehicle.component';
import { VehicleIssuanceComponent } from './machinery/vehicle-issuance/vehicle-issuance.component';
import { VehicleWorkbookComponent } from './machinery/vehicle-workbook/vehicle-workbook.component';
import { AddVehicleComponent } from './machinery/vehicle/add-vehicle/add-vehicle.component';
import { AuthGuard } from 'src/app/auth.guard';
import { Route, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ChartModule } from 'angular-highcharts';
import { PipesModule } from 'src/app/Shared/pipes/pipes.module';
import { DirectivesModule } from 'src/app/Shared/directives/directives.module';
import { SavedVehiclesComponent } from './machinery/vehicle/saved-vehicles/saved-vehicles.component';



export const miningRoutes: Route[] = [

  { path: 'addvehicle', component: VehicleComponent, data: { title: 'Vehicle' }, canActivate: [AuthGuard] },
  { path: 'vehworkbook', component: VehicleWorkbookComponent, data: { title: 'Vehicle Workbook' }, canActivate: [AuthGuard] },
  { path: 'vehissuance', component: VehicleIssuanceComponent, data: { title: 'Vehicle Issuance' }, canActivate: [AuthGuard] },


  { path: '**', redirectTo: 'home', pathMatch: 'full' }


];


@NgModule({
  declarations: [
    VehicleComponent,
    VehicleIssuanceComponent,
    VehicleWorkbookComponent,
    AddVehicleComponent,
    SavedVehiclesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(miningRoutes),
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
  ]
})
export class MiningModule { }
