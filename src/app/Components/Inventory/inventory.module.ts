import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductSubCategoryComponent } from './product-sub-category/product-sub-category.component';
import { BrandComponent } from './brand/brand.component';
import { Route, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth.guard';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { TextMaskModule } from 'angular2-text-mask';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { LocationsComponent } from './locations/locations.component';
import { RacksComponent } from './racks/racks.component';
import { UnitOfMeasurementComponent } from './unit-of-measurement/unit-of-measurement.component';
import { ProductComponent } from './product/product.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { AddBrandComponent } from './brand/add-brand/add-brand.component';
import { AddRackComponent } from './racks/add-rack/add-rack.component';
import { AddUOMComponent } from './unit-of-measurement/add-uom/add-uom.component';
import { AddCategoryComponent } from './product-category/add-category/add-category.component';
import { AddProdSubCategoryComponent } from './product-sub-category/add-prod-sub-category/add-prod-sub-category.component';
import { IssuanceComponent } from './issuance/issuance.component';
import { PurchaseReturnComponent } from './purchase-return/purchase-return.component';
import { IssueStockRerturnComponent } from './issue-stock-rerturn/issue-stock-rerturn.component';
import { StockAdjustmentComponent } from './stock-adjustment/stock-adjustment.component';
import { OpeningStockComponent } from './opening-stock/opening-stock.component';
import { ProductImgComponent } from './product/product-img/product-img.component';
import { LimittoPipe } from 'src/app/Shared/pipes/limitto.pipe';
import { InvreportcatwiseComponent } from './InventoryReports/invreportcatwise/invreportcatwise.component';
import { InvcredComponent } from './InventoryReports/invreportcatwise/invcred/invcred.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { InvrptprodwiseComponent } from './InventoryReports/invrptprodwise/invrptprodwise.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SalePurchaseRptdatewiseComponent } from './InventoryReports/sale-purchase-rptdatewise/sale-purchase-rptdatewise.component';
import { TopLeastSaleQtyAmountwiseComponent } from './InventoryReports/top-least-sale-qty-amountwise/top-least-sale-qty-amountwise.component';

import {ScrollingModule} from '@angular/cdk/scrolling';
import { EnterQtyComponent } from './Sale/retailer-sale/enter-qty/enter-qty.component';
import { RtlSavedBillComponent } from './Sale/retailer-sale/rtl-saved-bill/rtl-saved-bill.component';


import { VsenterqtyComponent } from './Sale/void-sale/vsenterqty/vsenterqty.component';
import { VssavedbillComponent } from './Sale/void-sale/vssavedbill/vssavedbill.component';
import { VrtnenterqtyComponent } from './Sale/void-sale-return/vrtnenterqty/vrtnenterqty.component';
import { VrtnsavedbillComponent } from './Sale/void-sale-return/vrtnsavedbill/vrtnsavedbill.component';
import { InvDashboardComponent } from './inv-dashboard/inv-dashboard.component';
import { SaleRptPaymentTypewiseComponent } from './InventoryReports/sale-rpt-payment-typewise/sale-rpt-payment-typewise.component';
import { ChartModule } from 'angular-highcharts';
import { PurchaseReportSupplierwiseComponent } from './InventoryReports/purchase-report-supplierwise/purchase-report-supplierwise.component';
import { PurchaseReportProdSupplierwiseComponent } from './InventoryReports/purchase-report-prod-supplierwise/purchase-report-prod-supplierwise.component';
import { BarcodeReportComponent } from './InventoryReports/barcode-report/barcode-report.component';
import { SalePurchaseComparisonRptDatewiseComponent } from './InventoryReports/sale-purchase-comparison-rpt-datewise/sale-purchase-comparison-rpt-datewise.component';
import { SalePurchaseComparisonRptsupplierwiseComponent } from './InventoryReports/sale-purchase-comparison-rptsupplierwise/sale-purchase-comparison-rptsupplierwise.component';
import { VoidListReportComponent } from './InventoryReports/void-list-report/void-list-report.component';
import { CashierClosingRptComponent } from './InventoryReports/cashier-closing-rpt/cashier-closing-rpt.component';

import { RetailRtnSavedbillComponent } from './Sale/retailer-sale-return/retail-rtn-savedbill/retail-rtn-savedbill.component';
import { RetailRtnEnterQtyComponent } from './Sale/retailer-sale-return/retail-rtn-enter-qty/retail-rtn-enter-qty.component';


import { PriceCheckerComponent } from './price-checker/price-checker.component';

import { WholeSaleComponent } from './whole-sale/whole-sale.component';
import { WhsSavedBillComponent } from './whole-sale/whs-saved-bill/whs-saved-bill.component';
import { PipesModule } from 'src/app/Shared/pipes/pipes.module';

import { GarmentSavedBillComponent } from './Sale/garment-sale/garment-saved-bill/garment-saved-bill.component';
import { SaleReportCustomerwiseComponent } from './InventoryReports/sale-report-customerwise/sale-report-customerwise.component';
import { InvAuditComponent } from './inv-audit/inv-audit.component';
import { GarmentSaleReturnComponent } from './Sale/garment-sale-return/garment-sale-return.component';
import { GarmentRtnSavedBillComponent } from './Sale/garment-sale-return/garment-rtn-saved-bill/garment-rtn-saved-bill.component';
import { GarmentSaleComponent } from './Sale/garment-sale/garment-sale.component';
import { SaleReportBookerwiseComponent } from './InventoryReports/sale-report-bookerwise/sale-report-bookerwise.component';
import { CustomerBalanceReportComponent } from './InventoryReports/customer-balance-report/customer-balance-report.component';
import { SupplierBalanceReportComponent } from './InventoryReports/supplier-balance-report/supplier-balance-report.component';
import { SaleReportProdCustomerwiseComponent } from './InventoryReports/sale-report-prod-customerwise/sale-report-prod-customerwise.component';
import { RetailerSaleComponent } from './Sale/retailer-sale/retailer-sale.component';
import { RetailerSaleReturnComponent } from './Sale/retailer-sale-return/retailer-sale-return.component';
import { VoidSaleComponent } from './Sale/void-sale/void-sale.component';
import { VoidSaleReturnComponent } from './Sale/void-sale-return/void-sale-return.component';
import { NgxBarcode6Module } from 'ngx-barcode6';













export const inventoryRoutes: Route[] = [

  {
    path: 'pcat',
    component: ProductCategoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pscat',
    component: ProductSubCategoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pbrnd',
    component: BrandComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'prac',
    component: RacksComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'ploc',
    component: LocationsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'uom',
    component: UnitOfMeasurementComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'prod',
    component: ProductComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pur',
    component: PurchaseComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'vblsale',
    component: VoidSaleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'vblsalertn',
    component: VoidSaleReturnComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'retsl',
    component: RetailerSaleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'retslrtn',
    component: RetailerSaleReturnComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'purtn',
    component: PurchaseReturnComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'isnc',
    component: IssuanceComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'isncrtn',
    component: IssueStockRerturnComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'stkadj',
    component: StockAdjustmentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'opnstk',
    component: OpeningStockComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'invrpt',
    component: InvreportcatwiseComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'invrptpw',
    component: InvrptprodwiseComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'sprptdw',
    component: SalePurchaseRptdatewiseComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tlsrpt',
    component: TopLeastSaleQtyAmountwiseComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'invdsbrd',
    component: InvDashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'isrptptw',
    component: SaleRptPaymentTypewiseComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'prptsw',
    component: PurchaseReportSupplierwiseComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'prptpsw',
    component: PurchaseReportProdSupplierwiseComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'spcrptdw',
    component: SalePurchaseComparisonRptDatewiseComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'spcrptsw',
    component: SalePurchaseComparisonRptsupplierwiseComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'brpt',
    component: BarcodeReportComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'vrptuw',
    component: VoidListReportComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'ccrpt',
    component: CashierClosingRptComponent,
    canActivate: [AuthGuard]
  },
  
  {
    path: 'pckr',
    component: PriceCheckerComponent,
    canActivate: [AuthGuard]
  }, 
     
  {
    path: 'whsl',
    component: WholeSaleComponent,
    canActivate: [AuthGuard]
  },    
  {
    path: 'gmsale',
    component: GarmentSaleComponent,
    canActivate: [AuthGuard]
  }, 
  {
    path: 'slrptcw',
    component: SaleReportCustomerwiseComponent,
    canActivate: [AuthGuard]
  }, 
  {
    path: 'invadt',
    component: InvAuditComponent,
    canActivate: [AuthGuard]
  }, 
  {
    path: 'gmslrtn',
    component: GarmentSaleReturnComponent,
    canActivate: [AuthGuard]
  }, 
  {
    path: 'cbrpt',
    component: CustomerBalanceReportComponent,
    canActivate: [AuthGuard]
  }, 
  {
    path: 'sbrpt',
    component: SupplierBalanceReportComponent,
    canActivate: [AuthGuard]
  }, 
  {
    path: 'srptbkrw',
    component: SaleReportBookerwiseComponent,
    canActivate: [AuthGuard]
  }, 
  {
    path: 'srptprodcw',
    component: SaleReportProdCustomerwiseComponent,
    canActivate: [AuthGuard]
  }, 







  { path: '**', redirectTo: 'home', pathMatch: 'full' }


];

@NgModule({
  declarations: [
    ProductCategoryComponent,
    ProductSubCategoryComponent,
    BrandComponent,
    LocationsComponent,
    RacksComponent,
    UnitOfMeasurementComponent,
    ProductComponent,
    PurchaseComponent,
    AddBrandComponent,
    AddRackComponent,
    AddUOMComponent,
    AddCategoryComponent,
    AddProdSubCategoryComponent,
    IssuanceComponent,
    PurchaseReturnComponent,
    IssueStockRerturnComponent,
    StockAdjustmentComponent,
    OpeningStockComponent,
    ProductImgComponent,
    LimittoPipe,
    InvreportcatwiseComponent,
    InvcredComponent,
    InvrptprodwiseComponent,
    SalePurchaseRptdatewiseComponent,
    TopLeastSaleQtyAmountwiseComponent,
 
    EnterQtyComponent,
    RtlSavedBillComponent,
    VsenterqtyComponent,
    VssavedbillComponent,

    VrtnenterqtyComponent,
    VrtnsavedbillComponent,
    InvDashboardComponent,
    SaleRptPaymentTypewiseComponent,
    PurchaseReportSupplierwiseComponent,
    PurchaseReportProdSupplierwiseComponent,
    BarcodeReportComponent,
    SalePurchaseComparisonRptDatewiseComponent,
    SalePurchaseComparisonRptsupplierwiseComponent,
    VoidListReportComponent,
    CashierClosingRptComponent,
    RetailRtnSavedbillComponent,
    RetailRtnEnterQtyComponent,
   
    PriceCheckerComponent,
   
    WholeSaleComponent,
    WhsSavedBillComponent,
    GarmentSaleComponent,
    GarmentSavedBillComponent,
    SaleReportCustomerwiseComponent,
    InvAuditComponent,
    GarmentSaleReturnComponent,
    GarmentRtnSavedBillComponent,
    SaleReportBookerwiseComponent,
    CustomerBalanceReportComponent,
    SupplierBalanceReportComponent,
    SaleReportProdCustomerwiseComponent,
    RetailerSaleComponent,
    RetailerSaleReturnComponent,
    VoidSaleComponent,
    VoidSaleReturnComponent,
    
  
    
   
    

 

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(inventoryRoutes),
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
    
  ],
  exports: [
    RouterModule
  ],
  providers: []

})
export class InventoryModule { }
