import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { HIGHCHARTS_MODULES } from 'angular-highcharts';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AddUserComponent } from './add-user/add-user.component';

export const userRoutes: Route[] = [
  
  {path:'addUser', component:AddUserComponent,  },

  {path:'**', redirectTo:'home',pathMatch:'full'}


];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(userRoutes),
  ],
  exports:[
    RouterModule
    
  ],
  providers: [{ provide: HIGHCHARTS_MODULES, useFactory: () => [  ] }, NotificationService,GlobalDataModule],

})
export class UserModule { }
