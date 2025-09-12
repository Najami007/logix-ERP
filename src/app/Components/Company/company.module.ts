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
import { RootComponent } from './root/root.component';
import { AreaComponent } from './area/area.component';




import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { VehicleComponent } from './vehicle/vehicle.component';
import { AddVehicleComponent } from './vehicle/add-vehicle/add-vehicle.component';
import { DirectivesModule } from 'src/app/Shared/directives/directives.module';
import { AddDiscProfileComponent } from './add-disc-profile/add-disc-profile.component';
import { AddProfileComponent } from './add-disc-profile/add-profile/add-profile.component';


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

export const companyRoutes: Route[] = [

  { path: 'cmpprof', component: CompanyProfileComponent, data: { title: 'Company Profile' }, canActivate: [AuthGuard] },
  { path: 'prtnr', component: PartnersComponent, data: { title: 'Partner' }, canActivate: [AuthGuard] },
  { path: 'city', component: CityComponent, data: { title: 'City' }, canActivate: [AuthGuard] },
  { path: 'cntry', component: CountryComponent, data: { title: 'Country' }, canActivate: [AuthGuard] },
  { path: 'adep', component: DepartmentComponent, data: { title: 'Department' }, canActivate: [AuthGuard] },
  { path: 'asec', component: SectionComponent, data: { title: 'Section' }, canActivate: [AuthGuard] },
  { path: 'proj', component: ProjectComponent, data: { title: 'Project' }, canActivate: [AuthGuard] },
  { path: 'party', component: PartyComponent, data: { title: 'Party' }, canActivate: [AuthGuard] },
  { path: 'loc', component: ListOfCustomersComponent, data: { title: 'List Of Customer' }, canActivate: [AuthGuard] },
  { path: 'los', component: ListOfSuppliersComponent, data: { title: 'List Of Supplier' }, canActivate: [AuthGuard] },
  { path: 'bkr', component: BookerComponent, data: { title: 'Booker' }, canActivate: [AuthGuard] },
  { path: 'root', component: RootComponent, data: { title: 'Root' }, canActivate: [AuthGuard] },
  { path: 'area', component: AreaComponent, data: { title: 'Area' }, canActivate: [AuthGuard] },
  { path: 'vehicle', component: VehicleComponent, data: { title: 'Vehicle' }, canActivate: [AuthGuard] },
   { path: 'addDiscProfile', component: AddDiscProfileComponent, data: { title: 'ADD Disc Profile' }, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }


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
    RootComponent,
    AreaComponent,
    VehicleComponent,
    AddVehicleComponent,
    AddDiscProfileComponent,
    AddProfileComponent


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
    DirectivesModule





  ],
  exports: [
    RouterModule,
    VehicleComponent,
    AddVehicleComponent
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ]

})
export class CompanyModule { }
