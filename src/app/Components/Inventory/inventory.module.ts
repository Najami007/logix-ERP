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
import { RetailSaleComponent } from './retail-sale/retail-sale.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { EnterQtyComponent } from './retail-sale/enter-qty/enter-qty.component';
import { RtlSavedBillComponent } from './retail-sale/rtl-saved-bill/rtl-saved-bill.component';
import { RetailSaleReturnComponent } from './retail-sale-return/retail-sale-return.component';
import { VoidableSaleComponent } from './voidable-sale/voidable-sale.component';

import { VsenterqtyComponent } from './voidable-sale/vsenterqty/vsenterqty.component';
import { VssavedbillComponent } from './voidable-sale/vssavedbill/vssavedbill.component';
import { VoidableSalertnComponent } from './voidable-salertn/voidable-salertn.component';
import { VrtnenterqtyComponent } from './voidable-salertn/vrtnenterqty/vrtnenterqty.component';
import { VrtnsavedbillComponent } from './voidable-salertn/vrtnsavedbill/vrtnsavedbill.component';
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

import { NgxBarcodeModule } from 'ngx-barcode';
import { RetailRtnSavedbillComponent } from './retail-sale-return/retail-rtn-savedbill/retail-rtn-savedbill.component';
import { RetailRtnEnterQtyComponent } from './retail-sale-return/retail-rtn-enter-qty/retail-rtn-enter-qty.component';

import { PaymentComponent } from './DesiAccounts/payment/payment.component';
import { ReceiptComponent } from './DesiAccounts/receipt/receipt.component';
import { ExpenseComponent } from './DesiAccounts/expense/expense.component';
import { AddPaymentComponent } from './DesiAccounts/payment/add-payment/add-payment.component';
import { AddReceiptComponent } from './DesiAccounts/receipt/add-receipt/add-receipt.component';
import { AddExpenseComponent } from './DesiAccounts/expense/add-expense/add-expense.component';
import { IncomeComponent } from './DesiAccounts/income/income.component';
import { AddIncomeComponent } from './DesiAccounts/income/add-income/add-income.component';
import { AddBankComponent } from './DesiAccounts/add-bank/add-bank.component';
import { BankDepositAndWithdrawComponent } from './DesiAccounts/bank-deposit-and-withdraw/bank-deposit-and-withdraw.component';
import { AdddwComponent } from './DesiAccounts/bank-deposit-and-withdraw/adddw/adddw.component';
import { AddCoaComponent } from './DesiAccounts/add-coa/add-coa.component';
import { PriceCheckerComponent } from './price-checker/price-checker.component';
import { OpeningCashComponent } from './DesiAccounts/opening-cash/opening-cash.component';
import { ProfitWithdrawalComponent } from './DesiAccounts/profit-withdrawal/profit-withdrawal.component'; 











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
    component: VoidableSaleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'vblsalertn',
    component: VoidableSalertnComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'retsl',
    component: RetailSaleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'retslrtn',
    component: RetailSaleReturnComponent,
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
    path: 'pmt',
    component: PaymentComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'exp',
    component: ExpenseComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'rcpt',
    component: ReceiptComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'inc',
    component: IncomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'bdw',
    component: BankDepositAndWithdrawComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'adbnk',
    component: AddBankComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'coa',
    component: AddCoaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pckr',
    component: PriceCheckerComponent,
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
    RetailSaleComponent,
    EnterQtyComponent,
    RtlSavedBillComponent,
    RetailSaleReturnComponent,
    VoidableSaleComponent,
    VsenterqtyComponent,
    VssavedbillComponent,
    VoidableSalertnComponent,
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
    PaymentComponent,
    ReceiptComponent,
    ExpenseComponent,
    AddPaymentComponent,
    AddReceiptComponent,
    AddExpenseComponent,
    IncomeComponent,
    AddIncomeComponent,
    AddBankComponent,
    BankDepositAndWithdrawComponent,
    AdddwComponent,
    AddCoaComponent,
    PriceCheckerComponent,
    OpeningCashComponent,
    ProfitWithdrawalComponent,
    
   
    

 

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
    Ng2SearchPipeModule,
    NgxMaterialTimepickerModule,
    ScrollingModule,
    ChartModule,
    NgxBarcodeModule
  ],
  exports: [
    RouterModule
  ],
  providers: []

})
export class InventoryModule { }
