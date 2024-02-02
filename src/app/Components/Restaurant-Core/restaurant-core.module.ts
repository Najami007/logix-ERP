import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { SaleComponent } from './sale/sale.component';
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
import { DayopencloseComponent } from './dayopenclose/dayopenclose.component';





export const restCore: Route[] = [

  {path:'sale', component:SaleComponent, canActivate:[AuthGuard] },
  {path:'tbl', component:TableComponent, canActivate:[AuthGuard] },
  {path:'rcp', component:RecipeComponent, canActivate:[AuthGuard] },
  {path:'recCat', component:RecipeCategoryComponent, canActivate:[AuthGuard] },
  {path:'doc', component:DayopencloseComponent, canActivate:[AuthGuard] },

  
  {path:'**', redirectTo:'home',pathMatch:'full'}


];


@NgModule({
  declarations: [
    SaleComponent,
    MenuComponent,
    RecipeComponent,
    AddMenuComponent,
    MenuCategoryComponent,
    AddMenuCategoryComponent,
    RecipeCategoryComponent,
    AddrecipeCategoryComponent,
    TableComponent,
    AddtableComponent,
    DayopencloseComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(restCore),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    MatFormFieldModule,
    ChartModule,
    NgxMatSelectSearchModule,
    TextMaskModule
  ],
  exports: [
    RouterModule
  ]
})
export class RestaurantCoreModule { }
