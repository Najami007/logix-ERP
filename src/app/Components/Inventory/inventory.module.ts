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
    path: 'isnc',
    component: IssuanceComponent,
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




  ],
  exports: [
    RouterModule
  ]
})
export class InventoryModule { }
