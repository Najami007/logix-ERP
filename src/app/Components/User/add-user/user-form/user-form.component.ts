import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

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

  roleTypeList:any = [{roleTypeID:1,roleTypeTitle:'Super Admin'},{roleTypeID:2,roleTypeTitle:'Admin'},{roleTypeID:3,roleTypeTitle:'User'}]

  @Input() rolesList:any = [];
  @Input() userList:any = [];
  @Input() projectList:any = [];

}
