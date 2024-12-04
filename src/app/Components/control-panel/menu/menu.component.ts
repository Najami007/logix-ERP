import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';

import { SharedServicesDataModule } from 'src/app/Shared/helper/shared-services-data/shared-services-data.module';
import { error } from 'jquery';
import { AddMenuComponent } from './add-menu/add-menu.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {


  companyProfile:any = [];
  crudList:any = {c:true,r:true,u:true,d:true};

  constructor(private http:HttpClient,
    private msg:NotificationService,
    private dialogue: MatDialog,
    private globaldata:GlobalDataModule,
    private app:AppComponent,
    private route:Router,
    private dataService:SharedServicesDataModule,
    
    ){
     

      this.globaldata.getMenuList().subscribe((data)=>{
        this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
      });

      this.globaldata.getCompany().subscribe((data)=>{
        this.companyProfile = data;
      });

    }


    ngOnInit(): void {
      this.globaldata.setHeaderTitle('Menu');
      this.getMenuList();
     
    }

    UserId = this.globaldata.getUserID();
    moduleList:any = [];

    
  addMenu(){
    this.dialogue.open(AddMenuComponent,{
      width:'40%',
    }).afterClosed().subscribe(value=>{
      if(value == 'update'){
        this.getMenuList();
             }
    })
  }


  getMenuList(){
    this.dataService.getHttp(this.globaldata.contorlPanelLink+ 'getMenu','').subscribe(
      (Response:any)=>{
          this.moduleList = Response;
         
        
      }
    )
  }


  editMenu(item:any){
    this.dialogue.open(AddMenuComponent,{
      width:'40%',
      data:item,
    }).afterClosed().subscribe(value=>{
      if(value == 'update'){
        this.getMenuList();
             }
    })
  }


  ActivateModule(item:any){
    this.dataService.saveHttp(this.globaldata.contorlPanelLink+ 'deleteMenu',{
      MenuID : item.menuID,
      IsActive : !item.isActive,
      UserID :this.UserId,
    }).subscribe(
    (Response:any)=>{
      if(Response.msg == 'Data Deleted Successfully'){
        this.msg.SuccessNotify(Response.msg);
        this.getMenuList();
      }else{
        this.msg.WarnNotify(Response.msg);
      }
    },
    (error:any)=>{
        console.log(error)
    }
    )

  }




}
