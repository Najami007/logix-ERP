import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss']
})
export class UserRoleComponent implements OnInit {


  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private app:AppComponent,
    private global:GlobalDataModule
  ){}


  ngOnInit(): void {

    this.getModules();
    this.getMenuList();
   
  }


  tabIndex:any;
  roleTitle:any;
  roleDescription:any;
  moduleID:any;

  moduleList:any = [];
  menuList:any = [];
  tempMenyList:any = [];


  getModules(){
    this.http.get(environment.mainApi+'user/GetModule').subscribe(
      (Response)=>{
        this.moduleList = Response;
      }
    )
  }


  getMenuList(){
    this.http.get(environment.mainApi+'user/GetModule').subscribe(
      (Response)=>{
        this.menuList = Response;
      }
    )
  }




  onModuleSelected(id:any){

    this.tempMenyList = this.menuList.filter((e:any)=> e.moduleID == id.target.value)
    
  }


  changeTabHeader(tabNum: any) {
    this.tabIndex = tabNum;
  }

}
