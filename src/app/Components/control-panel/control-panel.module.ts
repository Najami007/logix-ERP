import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleComponent } from './module/module.component';
import { MenuComponent } from './menu/menu.component';
import { Route, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth.guard';
import { AddModuleComponent } from './module/add-module/add-module.component';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ChartModule } from 'angular-highcharts';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { AddMenuComponent } from './menu/add-menu/add-menu.component';
import { CodesComponent } from './codes/codes.component';
import { AddCodeComponent } from './codes/add-code/add-code.component';
import { FeaturesComponent } from './features/features.component';
import { AddFeatureComponent } from './features/add-feature/add-feature.component';
import { PipesModule } from 'src/app/Shared/pipes/pipes.module';


export const panelRoutes: Route[] = [

  {path:'module', component:ModuleComponent,  canActivate:[AuthGuard] },
  {path:'menu', component:MenuComponent,  canActivate:[AuthGuard]},
  {path:'codes', component:CodesComponent,  canActivate:[AuthGuard]},
  {path:'feature', component:FeaturesComponent,  canActivate:[AuthGuard]},
 
  {path:'**', redirectTo:'home',pathMatch:'full'}


];


@NgModule({
  declarations: [
    ModuleComponent,
    MenuComponent,
    AddModuleComponent,
    AddMenuComponent,
    CodesComponent,
    AddCodeComponent,
    FeaturesComponent,
    AddFeatureComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(panelRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    //Ng2SearchPipeModule,
    MatFormFieldModule,
    ChartModule,
    NgxMatSelectSearchModule,
    // TextMaskModule,
    PipesModule
  ]
})
export class ControlPanelModule { }
