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
import { PartnersComponent } from './partners/partners.component';
import { CityComponent } from './settings/city/city.component';
import { SettingsComponent } from './settings/settings.component';
import { AddcityComponent } from './settings/city/addcity/addcity.component';
import { CountryComponent } from './settings/country/country.component';
import { AddCountryComponent } from './settings/country/add-country/add-country.component';
import { DepartmentComponent } from './department/department.component';
import { SectionComponent } from './section/section.component';
import { AddDepartmentComponent } from './department/add-department/add-department.component';
import { ProjectComponent } from './project/project.component';




export const companyRoutes: Route[] = [

  {path:'cmpprof', component:CompanyProfileComponent,  },
  {path:'prtnr', component:PartnersComponent,  },
  {path:'city', component:CityComponent,  },
  {path:'cntry', component:CountryComponent,  },
  {path:'adep', component:DepartmentComponent,  },
  {path:'asec', component:SectionComponent,  },
  {path:'proj', component:ProjectComponent,  },
  
  {path:'**', redirectTo:'home',pathMatch:'full'}


];


@NgModule({
  declarations: [
    CompanyProfileComponent,
    PartnersComponent,
    CityComponent,
    SettingsComponent,
    AddcityComponent,
    CountryComponent,
    AddCountryComponent,
    DepartmentComponent,
    SectionComponent,
    AddDepartmentComponent,
    ProjectComponent,
  
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
