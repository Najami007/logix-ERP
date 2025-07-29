import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

import * as $ from 'jquery';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {

    constructor(
      private http:HttpClient,
  
      private msg:NotificationService,
      private app:AppComponent,
      private global:GlobalDataModule,
      private route:Router
    ){
    }
  
  userRoleTypeID = this.global.getRoleTypeID();

   mobileMask = this.global.mobileMask;
  txtSearch:any;
  userID:any = 0;
  UserName:any = '';
  loginName:any = '';
  mobileNo:any = '';
  userEmail:any = '';
  RoleID:any = 0;
  password:any = '';
  confirmPassword:any = '';
  projectID:any = 0;
  roleTypeID:any = 0;

 @Input() roleTypeList:any = []

  @Input() rolesList:any = [];
  @Input() userList:any = [];
  @Input() projectList:any = [];



  setFocus(){

    setTimeout(() => {
      $('#userName').trigger('focus').trigger('select');
    }, 200);

  }

}
