import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSubCategoryComponent } from './Configurations/product-sub-category/product-sub-category.component';
import { Route, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth.guard';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { TextMaskModule } from 'angular2-text-mask';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { RacksComponent } from './Configurations/racks/racks.component';
import { ProductComponent } from './product/product.component';
import { PurchaseComponent } from './Purchases/purchase/purchase.component';
import { AddBrandComponent } from './Configurations/brand/add-brand/add-brand.component';
import { AddRackComponent } from './Configurations/racks/add-rack/add-rack.component';
import { AddUOMComponent } from './Configurations/unit-of-measurement/add-uom/add-uom.component';
import { AddCategoryComponent } from './Configurations/product-category/add-category/add-category.component';
import { AddProdSubCategoryComponent } from './Configurations/product-sub-category/add-prod-sub-category/add-prod-sub-category.component';

import { PurchaseReturnComponent } from './Purchases/purchase-return/purchase-return.component';
import { StockAdjustmentComponent } from './InvAdjustment/stock-adjustment/stock-adjustment.component';

import { ProductImgComponent } from './product/product-img/product-img.component';
import { LimittoPipe } from 'src/app/Shared/pipes/limitto.pipe';
import { InvreportcatwiseComponent } from './InventoryReports/invreportcatwise/invreportcatwise.component';
import { InvcredComponent } from './InventoryReports/invreportcatwise/invcred/invcred.component';
import { InvrptprodwiseComponent } from './InventoryReports/invrptprodwise/invrptprodwise.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SalePurchaseRptdatewiseComponent } from './InventoryReports/sale-purchase-rptdatewise/sale-purchase-rptdatewise.component';
import { TopLeastSaleQtyAmountwiseComponent } from './InventoryReports/top-least-sale-qty-amountwise/top-least-sale-qty-amountwise.component';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { EnterQtyComponent } from './Sale/retailer-sale/enter-qty/enter-qty.component';



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


import { PipesModule } from 'src/app/Shared/pipes/pipes.module';
import { SaleReportCustomerwiseComponent } from './InventoryReports/sale-report-customerwise/sale-report-customerwise.component';
import { InvAuditComponent } from './InvAdjustment/inv-audit/inv-audit.component';
import { GarmentSaleReturnComponent } from './Sale/garment-sale-return/garment-sale-return.component';
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

import { SaleBillPrintComponent } from './Sale/SaleComFiles/sale-bill-print/sale-bill-print.component';
import { WholeSaleComponent } from './Sale/whole-sale/whole-sale.component';
import { WhsSavedBillComponent } from './Sale/whole-sale/whs-saved-bill/whs-saved-bill.component';
import { WholeSaleReturnComponent } from './Sale/whole-sale-return/whole-sale-return.component';
import { SalePurchaseRptcatwiseComponent } from './InventoryReports/sale-purchase-rptcatwise/sale-purchase-rptcatwise.component';
import { PurchaseMobShopComponent } from './Purchases/purchase-mob-shop/purchase-mob-shop.component';
import { PurchaseReturnMobComponent } from './Purchases/purchase-return-mob/purchase-return-mob.component';
import { SaleMobComponent } from './Sale/sale-mob/sale-mob.component';
import { SaleReturnMobComponent } from './Sale/sale-return-mob/sale-return-mob.component';
import { FastFoodSaleComponent } from './Sale/fast-food-sale/fast-food-sale.component';
import { KOTPrintComponent } from './Sale/SaleComFiles/kotprint/kotprint.component';
import { ProductModalComponent } from './Sale/SaleComFiles/product-modal/product-modal.component';
import { PurchaseBillPrintComponent } from './Purchases/purchase-bill-print/purchase-bill-print.component';
import { OpeningStockComponent } from './InvAdjustment/opening-stock/opening-stock.component';
import { IssuanceComponent } from './InvAdjustment/issuance/issuance.component';
import { IssueStockRerturnComponent } from './InvAdjustment/issue-stock-rerturn/issue-stock-rerturn.component';
import { AdjBillPrintComponent } from './InvAdjustment/adj-bill-print/adj-bill-print.component';
import { BrandComponent } from './Configurations/brand/brand.component';
import { LocationsComponent } from './Configurations/locations/locations.component';
import { ProductCategoryComponent } from './Configurations/product-category/product-category.component';
import { UnitOfMeasurementComponent } from './Configurations/unit-of-measurement/unit-of-measurement.component';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { PurchaseOrderComponent } from './Purchases/purchase-order/purchase-order.component';
import { StockTransferComponent } from './InvAdjustment/stock-transfer/stock-transfer.component';
import { QRCodeModule } from 'angularx-qrcode';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaymentMehtodComponent } from './Sale/SaleComFiles/payment-mehtod/payment-mehtod.component';
import { SavedBillComponent } from './Sale/SaleComFiles/saved-bill/saved-bill.component';

import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { PaymentComponent } from '../Accounts/DesiAccounts/payment/payment.component';
import { DayClosingRptComponent } from './InventoryReports/day-closing-rpt/day-closing-rpt.component';
import { AuditInvoicePrintComponent } from './InvAdjustment/inv-audit/audit-invoice-print/audit-invoice-print.component';
import { VehicleSaleReportComponent } from './InventoryReports/vehicle-sale-report/vehicle-sale-report.component';
import { CompanyModule } from '../Company/company.module';
import { ReorderReportComponent } from './InventoryReports/reorder-report/reorder-report.component';
import { ProductEditBulkComponent } from './product-edit-bulk/product-edit-bulk.component';
import { CustomerIssuanceComponent } from './CusotmerIssuance/customer-issuance/customer-issuance.component';
import { CustomerIssueReturnComponent } from './CusotmerIssuance/customer-issue-return/customer-issue-return.component';
import { ProductBarcodesComponent } from './product/product-barcodes/product-barcodes.component';
import { ProductInOutHistoryComponent } from './InventoryReports/product-in-out-history/product-in-out-history.component';
import { CustomerIssueBillPrintComponent } from './CusotmerIssuance/customer-issue-bill-print/customer-issue-bill-print.component';
import { DirectivesModule } from 'src/app/Shared/directives/directives.module';
import { EditQtyModalComponent } from './Sale/garment-sale/edit-qty-modal/edit-qty-modal.component';
import { SaleVehicleComponent } from './Sale/sale-vehicle/sale-vehicle.component';
import { SaleFurnitureComponent } from './Sale/sale-furniture/sale-furniture.component';
import { BarcodeReportInvoicewiseComponent } from './InventoryReports/barcode-report-invoicewise/barcode-report-invoicewise.component';
import { SupplierLedgerSpecialComponent } from './InventoryReports/supplier-ledger-special/supplier-ledger-special.component';

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








export const inventoryRoutes: Route[] = [

  ////////////////////////// Configuration Pages /////////////

  { path: 'pcat', component: ProductCategoryComponent, data: { title: 'Product Category' }, canActivate: [AuthGuard] },
  { path: 'pscat', component: ProductSubCategoryComponent, data: { title: 'Sub Category' }, canActivate: [AuthGuard] },
  { path: 'pbrnd', component: BrandComponent, data: { title: 'Brand' }, canActivate: [AuthGuard] },
  { path: 'prac', component: RacksComponent, data: { title: 'Racks' }, canActivate: [AuthGuard] },
  { path: 'ploc', component: LocationsComponent, data: { title: 'Location' }, canActivate: [AuthGuard] },
  { path: 'uom', component: UnitOfMeasurementComponent, data: { title: 'UOM' }, canActivate: [AuthGuard] },
  { path: 'prod', component: ProductComponent, data: { title: 'Product' }, canActivate: [AuthGuard] },
  { path: 'pckr', component: PriceCheckerComponent, data: { title: 'Price Checker' }, canActivate: [AuthGuard] },
  { path: 'suppay', component: PaymentComponent, data: { title: 'Payment' }, canActivate: [AuthGuard] },
  { path: 'prodeditbulk', component: ProductEditBulkComponent, data: { title: 'Product Edit Bulk' }, canActivate: [AuthGuard] },

  //////// Sale Pages////////////////////

  { path: 'whsl', component: WholeSaleComponent, data: { title: 'Whole Sale' }, canActivate: [AuthGuard] },
  { path: 'whslrtn', component: WholeSaleReturnComponent, data: { title: 'Whole Sale Return' }, canActivate: [AuthGuard] },
  { path: 'gmsale', component: GarmentSaleComponent, data: { title: 'Sale GS' }, canActivate: [AuthGuard] },
  { path: 'gmslrtn', component: GarmentSaleReturnComponent, data: { title: 'Sale Return GS' }, canActivate: [AuthGuard] },
  { path: 'vblsale', component: VoidSaleComponent, data: { title: 'VB Sale' }, canActivate: [AuthGuard] },
  { path: 'vblsalertn', component: VoidSaleReturnComponent, data: { title: 'VB Sale Return' }, canActivate: [AuthGuard] },
  { path: 'retsl', component: RetailerSaleComponent, data: { title: 'Rt Sale' }, canActivate: [AuthGuard] },
  { path: 'retslrtn', component: RetailerSaleReturnComponent, data: { title: 'RT Sale Return' }, canActivate: [AuthGuard] },
  { path: 'mobsl', component: SaleMobComponent, data: { title: 'Mob Sale' }, canActivate: [AuthGuard] },
  { path: 'mobslrtn', component: SaleReturnMobComponent, data: { title: 'Mob Sale Return' }, canActivate: [AuthGuard] },
  { path: 'ffsl', component: FastFoodSaleComponent, data: { title: 'Fast Food Sale' }, canActivate: [AuthGuard] },
  { path: 'salevehicle', component: SaleVehicleComponent, data: { title: 'Sale Vehicle' }, canActivate: [AuthGuard] },

  { path: 'customerissue', component: CustomerIssuanceComponent, data: { title: 'Customer Issue' }, canActivate: [AuthGuard] },
  { path: 'customerissuertn', component: CustomerIssueReturnComponent, data: { title: 'Customer Issue Return' }, canActivate: [AuthGuard] },

  { path: 'saleFurniture', component: SaleFurnitureComponent, data: { title: 'Sale Furniture' }, canActivate: [AuthGuard] },

  //////// Purchase Pages////////////////////

  { path: 'pur', component: PurchaseComponent, data: { title: 'Purchase' }, canActivate: [AuthGuard] },
  { path: 'purtn', component: PurchaseReturnComponent, data: { title: 'Purchase Return' }, canActivate: [AuthGuard] },
  { path: 'purmob', component: PurchaseMobShopComponent, data: { title: 'Purchase Mob' }, canActivate: [AuthGuard] },
  { path: 'purtnmob', component: PurchaseReturnMobComponent, data: { title: 'Purchase Return Mob' }, canActivate: [AuthGuard] },
  { path: 'purordr', component: PurchaseOrderComponent, data: { title: 'Purchase Order' }, canActivate: [AuthGuard] },


  ////////////////////////// Adjustment Pages /////////////

  { path: 'isnc', component: IssuanceComponent, data: { title: 'Stock Issuance' }, canActivate: [AuthGuard] },
  { path: 'isncrtn', component: IssueStockRerturnComponent, data: { title: 'Issue Return' }, canActivate: [AuthGuard] },
  { path: 'stkadj', component: StockAdjustmentComponent, data: { title: 'Stock Adjustment' }, canActivate: [AuthGuard] },
  { path: 'opnstk', component: OpeningStockComponent, data: { title: 'Opening Stock' }, canActivate: [AuthGuard] },
  { path: 'stktrnsfr', component: StockTransferComponent, data: { title: 'Stock Transfer' }, canActivate: [AuthGuard] },





  ////////////////////////// Reports Pages /////////////

  { path: 'invrpt', component: InvreportcatwiseComponent, data: { title: 'Stock Register' }, canActivate: [AuthGuard] },
  { path: 'invrptpw', component: InvrptprodwiseComponent, data: { title: 'Product In Out History' }, canActivate: [AuthGuard] },
  { path: 'sprptdw', component: SalePurchaseRptdatewiseComponent, data: { title: 'Stock In Out Datewise' }, canActivate: [AuthGuard] },
  { path: 'tlsrpt', component: TopLeastSaleQtyAmountwiseComponent, data: { title: 'Top Least Sale Report' }, canActivate: [AuthGuard] },
  { path: 'invdsbrd', component: InvDashboardComponent, data: { title: 'Dashboard' }, canActivate: [AuthGuard] },
  { path: 'isrptptw', component: SaleRptPaymentTypewiseComponent, data: { title: 'Sale History Payment Type wise' }, canActivate: [AuthGuard] },
  { path: 'prptsw', component: PurchaseReportSupplierwiseComponent, data: { title: 'Purchase Rpt Supplier' }, canActivate: [AuthGuard] },
  { path: 'prptpsw', component: PurchaseReportProdSupplierwiseComponent, data: { title: 'Purchase Rpt Prod Supplier' }, canActivate: [AuthGuard] },
  { path: 'spcrptdw', component: SalePurchaseComparisonRptDatewiseComponent, data: { title: 'Sale Purchase Comparison' }, canActivate: [AuthGuard] },
  { path: 'slrptcw', component: SaleReportCustomerwiseComponent, data: { title: 'Sale Rpt Customerwise' }, canActivate: [AuthGuard] },
  { path: 'invadt', component: InvAuditComponent, data: { title: 'Inv Audit' }, canActivate: [AuthGuard] },
  { path: 'cbrpt', component: CustomerBalanceReportComponent, data: { title: 'Customer Balance Rpt' }, canActivate: [AuthGuard] },
  { path: 'sbrpt', component: SupplierBalanceReportComponent, data: { title: 'Supplier Balance Rpt' }, canActivate: [AuthGuard] },
  { path: 'srptbkrw', component: SaleReportBookerwiseComponent, data: { title: 'Sale Rpt Booker' }, canActivate: [AuthGuard] },
  { path: 'srptprodcw', component: SaleReportProdCustomerwiseComponent, data: { title: 'Sale Rpt Customer' }, canActivate: [AuthGuard] },
  { path: 'sprptcw', component: SalePurchaseRptcatwiseComponent, data: { title: 'Sale Rpt Category' }, canActivate: [AuthGuard] },
  { path: 'spcrptsw', component: SalePurchaseComparisonRptsupplierwiseComponent, data: { title: 'Sale Purchase Comp Supplier' }, canActivate: [AuthGuard] },
  { path: 'brpt', component: BarcodeReportComponent, data: { title: 'Barcode Report' }, canActivate: [AuthGuard] },
  { path: 'vrptuw', component: VoidListReportComponent, data: { title: 'Void List Rpt' }, canActivate: [AuthGuard] },
  { path: 'ccrpt', component: CashierClosingRptComponent, data: { title: 'Cashier Closing' }, canActivate: [AuthGuard] },
  { path: 'dayClose', component: DayClosingRptComponent, data: { title: 'Day Closing' }, canActivate: [AuthGuard] },
  { path: 'srptv', component: VehicleSaleReportComponent, data: { title: 'Vehicle Sale Report' }, canActivate: [AuthGuard] },
  { path: 'reorderrpt', component: ReorderReportComponent, data: { title: 'ReOrder Report' }, canActivate: [AuthGuard] },
  { path: 'prodInOutHistory', component: ProductInOutHistoryComponent, data: { title: 'Product In Out Hisotry' }, canActivate: [AuthGuard] },
  { path: 'barcodeReportInv', component: BarcodeReportInvoicewiseComponent, data: { title: 'Barcode Report Invoice' }, canActivate: [AuthGuard] },

  { path: 'suplierLedgerSpecial', component: SupplierLedgerSpecialComponent, data: { title: 'Supplier Ledger Special' }, canActivate: [AuthGuard] },


  { path: '**', redirectTo: 'home', data: { title: 'Home' }, pathMatch: 'full' }


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
    SaleReportCustomerwiseComponent,
    InvAuditComponent,
    GarmentSaleReturnComponent,
    SaleReportBookerwiseComponent,
    CustomerBalanceReportComponent,
    SupplierBalanceReportComponent,
    SaleReportProdCustomerwiseComponent,
    RetailerSaleComponent,
    RetailerSaleReturnComponent,
    VoidSaleComponent,
    VoidSaleReturnComponent,
    SaleBillPrintComponent,
    WholeSaleReturnComponent,
    SalePurchaseRptcatwiseComponent,
    PurchaseMobShopComponent,
    PurchaseReturnMobComponent,
    SaleMobComponent,
    SaleReturnMobComponent,
    FastFoodSaleComponent,
    KOTPrintComponent,
    ProductModalComponent,
    PurchaseBillPrintComponent,
    AdjBillPrintComponent,
    PurchaseOrderComponent,
    StockTransferComponent,
    PaymentMehtodComponent,
    SavedBillComponent,
    DayClosingRptComponent,
    AuditInvoicePrintComponent,
    VehicleSaleReportComponent,
    ReorderReportComponent,
    ProductEditBulkComponent,
    CustomerIssuanceComponent,
    CustomerIssueReturnComponent,
    ProductBarcodesComponent,
    ProductInOutHistoryComponent,
    CustomerIssueBillPrintComponent,
    EditQtyModalComponent,
    SaleVehicleComponent,
    SaleFurnitureComponent,
    BarcodeReportInvoicewiseComponent,
    SupplierLedgerSpecialComponent,
    



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
    QRCodeModule,
    NgSelectModule,
    SharedComponentsModule,
    CompanyModule,
    DirectivesModule

  ],
  exports: [
    RouterModule,
    CashierClosingRptComponent,
    ProductModalComponent
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ]

})
export class InventoryModule { }
