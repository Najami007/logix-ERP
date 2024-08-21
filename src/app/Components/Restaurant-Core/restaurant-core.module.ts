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
import { TabletSaleComponent } from './tablet-sale/tablet-sale.component';
import { RecipeListComponent } from './restaurantReports/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipe/recipe-detail/recipe-detail.component';
import { VoidReportComponent } from './restaurantReports/void-report/void-report.component';
import { RecipeComparisonComponent } from './restaurantReports/recipe-list/recipe-comparison/recipe-comparison.component';
import { PipesModule } from 'src/app/Shared/pipes/pipes.module';
import { RestSaleBillPrintComponent } from './Sales/sale1/rest-kot-print/rest-sale-bill-print/rest-sale-bill-print.component';
import { AddSoundComponent } from './add-sound/add-sound.component';
import { RestKotPrintComponent } from './Sales/sale1/rest-kot-print/rest-kot-print.component';
import { ConsumptionReportComponent } from './restaurantReports/consumption-report/consumption-report.component';
import { RestConsumptionReportComponent } from './restaurantReports/rest-consumption-report/rest-consumption-report.component';
import { Sale2Component } from './Sales/sale2/sale2.component';
import { Sale1Component } from './Sales/sale1/sale1.component';










export const restCore: Route[] = [

  {path:'sale', component:Sale1Component, canActivate:[AuthGuard] },
  {path:'sale2', component:Sale2Component },
  {path:'tbl', component:TableComponent, canActivate:[AuthGuard] },
  {path:'rcp', component:RecipeComponent, canActivate:[AuthGuard] },
  {path:'recCat', component:RecipeCategoryComponent, canActivate:[AuthGuard] },
  {path:'ckar', component:CookingareaComponent, canActivate:[AuthGuard] },
  {path:'ordrdb', component:OrderDashboardComponent, canActivate:[AuthGuard] },
  {path:'slrpt', component:SaleReportComponent, canActivate:[AuthGuard] },
  {path:'srptrw', component:SaleRptRecipewiseComponent, canActivate:[AuthGuard] },
  {path:'srptcw', component:SaleRptRecipeCatwiseComponent, canActivate:[AuthGuard] },
  {path:'srpttw', component:SaleRptTablewiseComponent, canActivate:[AuthGuard] },
  {path:'srptotw', component:SaleRptOrderTypewiseComponent, canActivate:[AuthGuard] },
  {path:'srptptw', component:SaleRptPaymentTypewiseComponent, canActivate:[AuthGuard] },
  {path:'restdsbrd', component:RestDashboardComponent, canActivate:[AuthGuard] },
  {path:'tbsale', component:TabletSaleComponent, canActivate:[AuthGuard] },
  {path:'lorecp', component:RecipeListComponent, canActivate:[AuthGuard] },
  {path:'vrpt', component:VoidReportComponent, canActivate:[AuthGuard] },
  
  {path:'conrpt', component:ConsumptionReportComponent, canActivate:[AuthGuard] },
  {path:'snd', component:AddSoundComponent, },
  

  
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
    RestConsumptionReportComponent,
    Sale2Component,
    Sale1Component,
    
   
   
    

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
    PipesModule

  ],
  exports: [
    RouterModule,
  ]
})
export class RestaurantCoreModule { }
