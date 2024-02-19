import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { Route, RouterModule } from '@angular/router';
import { HIGHCHARTS_MODULES } from 'angular-highcharts';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AddUserComponent } from './add-user/add-user.component';
import { PincodeComponent } from './pincode/pincode.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangePINComponent } from './change-pin/change-pin.component';
import { TextMaskModule } from 'angular2-text-mask';
import { UserRoleComponent } from './user-role/user-role.component';
import { AuthGuard } from 'src/app/auth.guard';
import { RestrictpwdComponent } from './restrictpwd/restrictpwd.component';
import { DayopencloseComponent } from './dayopenclose/dayopenclose.component';
import { DayOpencloseRptComponent } from './day-openclose-rpt/day-openclose-rpt.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';



export const userRoutes: Route[] = [
  
  {path:'adduser', component:AddUserComponent,canActivate:[AuthGuard]  },
  {path:'usrl', component:UserRoleComponent,canActivate:[AuthGuard]  },
  {path:'respwd', component:RestrictpwdComponent,canActivate:[AuthGuard]  },
  {path:'doc', component:DayopencloseComponent, canActivate:[AuthGuard] },
  {path:'rptdoc', component:DayOpencloseRptComponent, canActivate:[AuthGuard] },

  {path:'**', redirectTo:'home',pathMatch:'full'}


];

@NgModule({
  declarations: [
    AddUserComponent,
    PincodeComponent,
    ChangePasswordComponent,
    ChangePINComponent,
    UserRoleComponent,
    RestrictpwdComponent,
    DayOpencloseRptComponent,
    DayopencloseComponent,   
  ],
  
  imports: [
    CommonModule,
    RouterModule.forChild(userRoutes),
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxMatSelectSearchModule,
    TextMaskModule,
    Ng2SearchPipeModule,
    NgxMaterialTimepickerModule




  ],
  exports:[
    RouterModule,
  
    
  ],
  

})
export class UserModule { }
