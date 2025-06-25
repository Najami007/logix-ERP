import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth.guard';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChartModule } from 'angular-highcharts';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { TextMaskModule } from 'angular2-text-mask';
import { MenuComponent } from './menu/menu.component';
import { RecipeComponent } from './recipe/recipe.component';
import { AddMenuComponent } from './menu/add-menu/add-menu.component';
import { MenuCategoryComponent } from './menu-category/menu-category.component';
import { AddMenuCategoryComponent } from './menu-category/add-menu-category/add-menu-category.component';
import { RecipeCategoryComponent } from './recipe-category/recipe-category.component';
import { AddrecipeCategoryComponent } from './recipe-category/addrecipe-category/addrecipe-category.component';
import { TableComponent } from './table/table.component';
import { AddtableComponent } from './table/addtable/addtable.component';
import { MapWHProductComponent } from './recipe/map-whproduct/map-whproduct.component';
import { CookingareaComponent } from './cookingarea/cookingarea.component';
import { AddAreaComponent } from './cookingarea/add-area/add-area.component';
import { OrderDashboardComponent } from './order-dashboard/order-dashboard.component';
import { SaleReportComponent } from './restaurantReports/sale-report/sale-report.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SaleRptRecipewiseComponent } from './restaurantReports/sale-rpt-recipewise/sale-rpt-recipewise.component';
import { SaleRptOrderTypewiseComponent } from './restaurantReports/sale-rpt-order-typewise/sale-rpt-order-typewise.component';
import { SaleRptTablewiseComponent } from './restaurantReports/sale-rpt-tablewise/sale-rpt-tablewise.component';
import { SaleRptRecipeCatwiseComponent } from './restaurantReports/sale-rpt-recipe-catwise/sale-rpt-recipe-catwise.component';
import { SaleRptPaymentTypewiseComponent } from './restaurantReports/sale-rpt-payment-typewise/sale-rpt-payment-typewise.component';
import { SaleBillDetailComponent } from './Sales/sale1/sale-bill-detail/sale-bill-detail.component';
import { RestDashboardComponent } from './rest-dashboard/rest-dashboard.component';
import { TabletSaleComponent } from './Sales/tablet-sale/tablet-sale.component';
import { RecipeListComponent } from './restaurantReports/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipe/recipe-detail/recipe-detail.component';
import { VoidReportComponent } from './restaurantReports/void-report/void-report.component';
import { RecipeComparisonComponent } from './restaurantReports/recipe-list/recipe-comparison/recipe-comparison.component';
import { PipesModule } from 'src/app/Shared/pipes/pipes.module';
import { AddSoundComponent } from './add-sound/add-sound.component';
import { RestKotPrintComponent } from './Sales/SaleCommonComponent/rest-kot-print/rest-kot-print.component';
import { ConsumptionReportComponent } from './restaurantReports/consumption-report/consumption-report.component';
import { Sale2Component } from './Sales/sale2/sale2.component';
import { Sale1Component } from './Sales/sale1/sale1.component';
import { RestSaleBillPrintComponent } from './Sales/SaleCommonComponent/rest-sale-bill-print/rest-sale-bill-print.component';
import { SaleSavedBillComponent } from './Sales/SaleCommonComponent/sale-saved-bill/sale-saved-bill.component';
import { TableSale2Component } from './Sales/table-sale2/table-sale2.component';
import { NgSelectModule } from '@ng-select/ng-select';




import { DateAdapter, MAT_DATE_LOCALE , MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { SaleHoldedBillComponent } from './Sales/SaleCommonComponent/sale-holded-bill/sale-holded-bill.component';
import { CommentCardComponent } from './Sales/SaleCommonComponent/comment-card/comment-card.component';
import { CashierClosingRptComponent } from '../Inventory/InventoryReports/cashier-closing-rpt/cashier-closing-rpt.component';

export const MY_DATE_FORMAT  = {
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







export const restCore: Route[] = [

  {path:'sale', component:Sale1Component,data: { title: 'Sale' }, canActivate:[AuthGuard] },
  {path:'sale2', component:Sale2Component,data: { title: 'Sale II' }, canActivate:[AuthGuard] },
  {path:'tbl', component:TableComponent,data: { title: 'Add Table' }, canActivate:[AuthGuard] },
  {path:'rcp', component:RecipeComponent,data: { title: 'Recipe' }, canActivate:[AuthGuard] },
  {path:'recCat', component:RecipeCategoryComponent,data: { title: 'Recipe Category' }, canActivate:[AuthGuard] },
  {path:'ckar', component:CookingareaComponent,data: { title: 'Cooking Area' }, canActivate:[AuthGuard] },
  {path:'ordrdb', component:OrderDashboardComponent,data: { title: 'Ord Dashboard' }, canActivate:[AuthGuard] },
  {path:'slrpt', component:SaleReportComponent,data: { title: 'Sale Rpt Datewise' }, canActivate:[AuthGuard] },
  {path:'srptrw', component:SaleRptRecipewiseComponent,data: { title: 'Sale Rpt Recipewise' }, canActivate:[AuthGuard] },
  {path:'srptcw', component:SaleRptRecipeCatwiseComponent,data: { title: 'Sale Rpt Categorywise' }, canActivate:[AuthGuard] },
  {path:'srpttw', component:SaleRptTablewiseComponent,data: { title: 'Sale Rpt Tablewise' }, canActivate:[AuthGuard] },
  {path:'srptotw', component:SaleRptOrderTypewiseComponent,data: { title: 'Sale Rpt Orderwise' }, canActivate:[AuthGuard] },
  {path:'srptptw', component:SaleRptPaymentTypewiseComponent,data: { title: 'Sale Rpt Pay Typewise' }, canActivate:[AuthGuard] },
  {path:'restdsbrd', component:RestDashboardComponent,data: { title: 'Dashboard' }, canActivate:[AuthGuard] },
  {path:'tbsale', component:TableSale2Component,data: { title: 'Tablet Sale' }, canActivate:[AuthGuard] },
  {path:'lorecp', component:RecipeListComponent,data: { title: 'Recipe List' }, canActivate:[AuthGuard] },
  {path:'vrpt', component:VoidReportComponent,data: { title: 'Void Rpt' }, canActivate:[AuthGuard] },
  
  {path:'conrpt', component:ConsumptionReportComponent,data: { title: 'Consumption Rpt' }, canActivate:[AuthGuard] },
  {path:'snd', component:AddSoundComponent,data: { title: 'Snd' }, },
  {path: 'ccrpt',component: CashierClosingRptComponent,data: { title: 'Cashier Closing' },canActivate: [AuthGuard]},
  

  
  {path:'**', redirectTo:'home',pathMatch:'full'}


];


@NgModule({
  declarations: [
    MenuComponent,
    RecipeComponent,
    AddMenuComponent,
    MenuCategoryComponent,
    AddMenuCategoryComponent,
    RecipeCategoryComponent,
    AddrecipeCategoryComponent,
    TableComponent,
    AddtableComponent,
    
    MapWHProductComponent,
    CookingareaComponent,
    AddAreaComponent,
    OrderDashboardComponent,
    SaleReportComponent,
    SaleRptRecipewiseComponent,
    SaleRptOrderTypewiseComponent,
    SaleRptTablewiseComponent,
    SaleRptRecipeCatwiseComponent,
    SaleRptPaymentTypewiseComponent,
    SaleBillDetailComponent,
   
    RestDashboardComponent,
    TabletSaleComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    VoidReportComponent,
    RecipeComparisonComponent,
    RestSaleBillPrintComponent,
    AddSoundComponent,
    RestKotPrintComponent,
    ConsumptionReportComponent,
    Sale2Component,
    Sale1Component,
    SaleSavedBillComponent,
    TableSale2Component,
    SaleHoldedBillComponent,
    CommentCardComponent,
   
    
   
   
    

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(restCore),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    //Ng2SearchPipeModule,
    MatFormFieldModule,
    ChartModule,
    NgxMatSelectSearchModule,
    TextMaskModule,
    NgxMaterialTimepickerModule,
    PipesModule,
    NgSelectModule

  ],
  exports: [
    RouterModule,
  ],
  providers: [
      { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
      { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
    ]
  
})
export class RestaurantCoreModule { }
