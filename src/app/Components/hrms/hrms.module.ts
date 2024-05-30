import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';
import { DesignationComponent } from './designation/designation.component';
import { DepartmentComponent } from './department/department.component';
import { Route, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth.guard';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChartModule } from 'angular-highcharts';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { TextMaskModule } from 'angular2-text-mask';


export const hrmsRoutes: Route[] = [

  {path:'empprof', component:EmployeeProfileComponent,  canActivate:[AuthGuard] },
  {path:'dep', component:DepartmentComponent,  canActivate:[AuthGuard]},
  {path:'dsgntn', component:DesignationComponent,  canActivate:[AuthGuard]},
  
  {path:'**', redirectTo:'home',pathMatch:'full'}


];



@NgModule({
  declarations: [
    EmployeeProfileComponent,
    DesignationComponent,
    DepartmentComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(hrmsRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    MatFormFieldModule,
    ChartModule,
    NgxMatSelectSearchModule,
    TextMaskModule
  ]
})
export class HRMSModule { }
