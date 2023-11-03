import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { ChartModule } from 'angular-highcharts';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { TextMaskModule } from 'angular2-text-mask';



export const companyRoutes: Route[] = [

  {path:'cmpprof', component:CompanyProfileComponent,  },
  
  {path:'**', redirectTo:'home',pathMatch:'full'}


];


@NgModule({
  declarations: [
    CompanyProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(companyRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    MatFormFieldModule,
    GlobalDataModule,
    ChartModule,
    NgxMatSelectSearchModule,
    TextMaskModule





  ],
  exports: [
    RouterModule
  ]
})
export class CompanyModule { }
