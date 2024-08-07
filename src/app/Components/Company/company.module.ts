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
import { AuthGuard } from 'src/app/auth.guard';
import { PartyComponent } from './party/party.component';
import { AddpartyComponent } from './party/addparty/addparty.component';
import { FilterPipe } from 'src/app/Shared/pipes/filter/filter.pipe';
import { PipesModule } from 'src/app/Shared/pipes/pipes.module';
import { ListOfCustomersComponent } from './CmpReports/list-of-customers/list-of-customers.component';
import { ListOfSuppliersComponent } from './CmpReports/list-of-suppliers/list-of-suppliers.component';
import { BookerComponent } from './booker/booker.component';




export const companyRoutes: Route[] = [

  {path:'cmpprof', component:CompanyProfileComponent, canActivate:[AuthGuard] },
  {path:'prtnr', component:PartnersComponent,  canActivate:[AuthGuard]},
  {path:'city', component:CityComponent,canActivate:[AuthGuard]  },
  {path:'cntry', component:CountryComponent, canActivate:[AuthGuard] },
  {path:'adep', component:DepartmentComponent,canActivate:[AuthGuard]  },
  {path:'asec', component:SectionComponent,canActivate:[AuthGuard]  },
  {path:'proj', component:ProjectComponent,canActivate:[AuthGuard]  },
  {path:'party', component:PartyComponent,canActivate:[AuthGuard]  },
  {path:'loc', component:ListOfCustomersComponent,canActivate:[AuthGuard]  },
  {path:'los', component:ListOfSuppliersComponent,canActivate:[AuthGuard]  },
  {path:'bkr', component:BookerComponent,canActivate:[AuthGuard]  },
  
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
    PartyComponent,
    AddpartyComponent,
    ListOfCustomersComponent,
    ListOfSuppliersComponent,
    BookerComponent,
    
  
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(companyRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    //Ng2SearchPipeModule,
    MatFormFieldModule,
    ChartModule,
    NgxMatSelectSearchModule,
    TextMaskModule,
    PipesModule,





  ],
  exports: [
    RouterModule
  ]
})
export class CompanyModule { }
