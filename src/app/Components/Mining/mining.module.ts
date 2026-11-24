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
import { WorkBookReportComponent } from './machinery/work-book-report/work-book-report.component';
import { VehicleIssuanceReportComponent } from './machinery/vehicle-issuance-report/vehicle-issuance-report.component';
import { AddMineComponent } from './mine/add-mine/add-mine.component';
import { MineIssuanceComponent } from './mine/mine-issuance/mine-issuance.component';
import { MineIssuanceReportComponent } from './mine/mine-issuance-report/mine-issuance-report.component';
import { CreateProductComponent } from './production/create-product/create-product.component';
import { MiningSaleComponent } from './production/mining-sale/mining-sale.component';
import { PrintMinigBillComponent } from './production/mining-sale/print-minig-bill/print-minig-bill.component';
import { MiningSaleReportComponent } from './production/mining-sale-report/mining-sale-report.component';
import { MiningItemSaleReportComponent } from './production/mining-item-sale-report/mining-item-sale-report.component';
import { MiningCategorySaleReportComponent } from './production/mining-category-sale-report/mining-category-sale-report.component';
import { MiningCustomerSaleReportComponent } from './production/mining-customer-sale-report/mining-customer-sale-report.component';
import { MiningTransporterSaleReportComponent } from './production/mining-transporter-sale-report/mining-transporter-sale-report.component';
import { PrintBillTokenComponent } from './production/mining-sale/print-bill-token/print-bill-token.component';
import { CustomerVehicleComponent } from './production/customer-vehicle/customer-vehicle.component';
import { AddCustomerVehicleComponent } from './production/customer-vehicle/add-customer-vehicle/add-customer-vehicle.component';
import { CustomerVehicleReportComponent } from './production/customer-vehicle-report/customer-vehicle-report.component';
import { MiningProductionComponent } from './production/mining-production/mining-production.component';



export const miningRoutes: Route[] = [

  /////////////////////// Machinery //////////////////////////
  { path: 'addvehicle', component: VehicleComponent, data: { title: 'Vehicle' }, canActivate: [AuthGuard] },
  { path: 'vehworkbook', component: VehicleWorkbookComponent, data: { title: 'Vehicle Workbook' }, canActivate: [AuthGuard] },
  { path: 'vehissuance', component: VehicleIssuanceComponent, data: { title: 'Vehicle Issuance' }, canActivate: [AuthGuard] },
  { path: 'workrpt', component: WorkBookReportComponent, data: { title: 'WorkBook Report' }, canActivate: [AuthGuard] },
  { path: 'issuerpt', component: VehicleIssuanceReportComponent, data: { title: 'Vehicle Issuance Report' }, canActivate: [AuthGuard] },

  ////////////////////////////Mine ///////////////////////////////
  { path: 'addmine', component: AddMineComponent, data: { title: 'Add Mine' }, canActivate: [AuthGuard] },
  { path: 'mineissue', component: MineIssuanceComponent, data: { title: 'Mine Issuance' }, canActivate: [AuthGuard] },
  { path: 'mineissuancerpt', component: MineIssuanceReportComponent, data: { title: 'Mine Issuance Report' }, canActivate: [AuthGuard] },

  //////////////////////////    ////////////////////////////////////////

  { path: 'createproduct', component: CreateProductComponent, data: { title: 'Create Product' }, canActivate: [AuthGuard] },
  { path: 'customervehicle', component: CustomerVehicleComponent, data: { title: 'Customer Vehicle' }, canActivate: [AuthGuard] },
  { path: 'cusvehlist', component: CustomerVehicleReportComponent, data: { title: 'Customer Vehicle Report' }, canActivate: [AuthGuard] },

  { path: 'minesale', component: MiningSaleComponent, data: { title: 'Mining Sale' }, canActivate: [AuthGuard] },
  { path: 'minesalerpt', component: MiningSaleReportComponent, data: { title: 'Sale Report' }, canActivate: [AuthGuard] },
  { path: 'mineitemsalerpt', component: MiningItemSaleReportComponent, data: { title: 'Sale Report Itemwise' }, canActivate: [AuthGuard] },
  { path: 'minecategorysalerpt', component: MiningCategorySaleReportComponent, data: { title: 'Sale Report Category' }, canActivate: [AuthGuard] },
  { path: 'minecustomersalerpt', component: MiningCustomerSaleReportComponent, data: { title: 'Sale Report Customer' }, canActivate: [AuthGuard] },
  { path: 'minetransportersalerpt', component: MiningTransporterSaleReportComponent, data: { title: 'Sale Report Transporter' }, canActivate: [AuthGuard] },
  { path: 'miningproduction', component: MiningProductionComponent, data: { title: 'Mining Production' }, canActivate: [AuthGuard] },


  { path: '**', redirectTo: 'home', pathMatch: 'full' }


];


@NgModule({
  declarations: [
    VehicleComponent,
    VehicleIssuanceComponent,
    VehicleWorkbookComponent,
    AddVehicleComponent,
    SavedVehiclesComponent,
    WorkBookReportComponent,
    VehicleIssuanceReportComponent,
    AddMineComponent,
    MineIssuanceComponent,
    MineIssuanceReportComponent,
    CreateProductComponent,
    MiningSaleComponent,
    PrintMinigBillComponent,
    MiningSaleReportComponent,
    MiningItemSaleReportComponent,
    MiningCategorySaleReportComponent,
    MiningCustomerSaleReportComponent,
    MiningTransporterSaleReportComponent,
    PrintBillTokenComponent,
    CustomerVehicleComponent,
    AddCustomerVehicleComponent,
    CustomerVehicleReportComponent,
    MiningProductionComponent
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
