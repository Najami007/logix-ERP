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
import { ShippingCompanyComponent } from './shipping-company/shipping-company.component';
import { AddShippingCompanyComponent } from './shipping-company/add-shipping-company/add-shipping-company.component';
import { ItemCategoriesComponent } from './item-categories/item-categories.component';
import { AddCategoryComponent } from './item-categories/add-category/add-category.component';
import { ManufacturingSaleRptComponent } from './ManufacturingReports/manufacturing-sale-rpt/manufacturing-sale-rpt.component';
import { ManufacturingSaleItemwiseComponent } from './ManufacturingReports/manufacturing-sale-itemwise/manufacturing-sale-itemwise.component';
import { ManufacturingSalePartywiseComponent } from './ManufacturingReports/manufacturing-sale-partywise/manufacturing-sale-partywise.component';
import { MaterialConsumptionRptComponent } from './ManufacturingReports/material-consumption-rpt/material-consumption-rpt.component';
import { ManufacturingSaleCategoryComponent } from './ManufacturingReports/manufacturing-sale-category/manufacturing-sale-category.component';
import { DeliveryChallanComponent } from './ManufacturingComFiles/delivery-challan/delivery-challan.component';
import { OrderPrintComponent } from './ManufacturingComFiles/order-print/order-print.component';
import { MnuInvoicePrintComponent } from './ManufacturingComFiles/mnu-invoice-print/mnu-invoice-print.component';
import { ContractorProfileComponent } from './contractor-profile/contractor-profile.component';
import { AddContractorProfileComponent } from './contractor-profile/add-contractor-profile/add-contractor-profile.component';
import { ProductionAuditComponent } from './production-audit/production-audit.component';
import { ProductionItemReceivingComponent } from './production-item-receiving/production-item-receiving.component';
import { ProductionAuditInvPrintComponent } from './production-audit/production-audit-inv-print/production-audit-inv-print.component';
import { ProductionPrintComponent } from './production-item-receiving/production-print/production-print.component';



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
  { path: 'shipmentCompany', component: ShippingCompanyComponent, data: { title: 'Shipment Company' }, canActivate: [AuthGuard] },
  { path: 'itemcategory', component: ItemCategoriesComponent, data: { title: 'Item Category' }, canActivate: [AuthGuard] },
  { path: 'contractorProfile', component: ContractorProfileComponent, data: { title: 'Contractor Profile' }, canActivate: [AuthGuard] },
  { path: 'itemReceiving', component: ProductionItemReceivingComponent, data: { title: 'Item Receiving' }, canActivate: [AuthGuard] },
  { path: 'productionAudit', component: ProductionAuditComponent, data: { title: 'Audit' }, canActivate: [AuthGuard] },


  /////////////////////////////////////////////////Reports ///////////////////////////////////////

  { path: 'salereport', component: ManufacturingSaleRptComponent, data: { title: 'Sale Report' }, canActivate: [AuthGuard] },
  { path: 'itemsalerpt', component: ManufacturingSaleItemwiseComponent, data: { title: 'Sale Report Itemwise' }, canActivate: [AuthGuard] },
  { path: 'customersalerpt', component: ManufacturingSalePartywiseComponent, data: { title: 'Sale Report Customer' }, canActivate: [AuthGuard] },
  { path: 'categorysalerpt', component: ManufacturingSaleCategoryComponent, data: { title: 'Sale Report Category' }, canActivate: [AuthGuard] },

  { path: 'materialconsumption', component: MaterialConsumptionRptComponent, data: { title: 'Material Consumption' }, canActivate: [AuthGuard] },


]



@NgModule({
  declarations: [
    MarbleSaleComponent,
    ItemProductionComponent,
    AddFinishedItemComponent,
    ShippingCompanyComponent,
    AddShippingCompanyComponent,
    ItemCategoriesComponent,
    AddCategoryComponent,
    ManufacturingSaleRptComponent,
    ManufacturingSaleItemwiseComponent,
    ManufacturingSalePartywiseComponent,
    MaterialConsumptionRptComponent,
    ManufacturingSaleCategoryComponent,
    DeliveryChallanComponent,
    OrderPrintComponent,
    MnuInvoicePrintComponent,
    ContractorProfileComponent,
    AddContractorProfileComponent,
    ProductionAuditComponent,
    ProductionItemReceivingComponent,
    ProductionAuditInvPrintComponent,
    ProductionPrintComponent,


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
