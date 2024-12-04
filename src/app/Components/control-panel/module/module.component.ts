import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { AddModuleComponent } from './add-module/add-module.component';
import { SharedServicesDataModule } from 'src/app/Shared/helper/shared-services-data/shared-services-data.module';
import { error } from 'jquery';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss']
})
export class ModuleComponent {


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
      this.globaldata.setHeaderTitle('Modules');
      this.getModuleList();
     
    }

    UserId = this.globaldata.getUserID();
    moduleList:any = [];

    
  addModule(){
    this.dialogue.open(AddModuleComponent,{
      width:'30%',
    }).afterClosed().subscribe(value=>{
      if(value == 'update'){
        this.getModuleList();
             }
    })
  }


  getModuleList(){
    this.dataService.getHttp(this.globaldata.contorlPanelLink+ 'getModule','').subscribe(
      (Response:any)=>{
          this.moduleList = Response;
        
      }
    )
  }


  editModule(item:any){
    this.dialogue.open(AddModuleComponent,{
      width:'30%',
      data:item,
    }).afterClosed().subscribe(value=>{
      if(value == 'update'){
        this.getModuleList();
             }
    })
  }


  ActivateModule(item:any){
    this.dataService.saveHttp(this.globaldata.contorlPanelLink+ 'activateModule',{
      ModuleID : item.moduleID,
      ActiveStatus : !item.activeStatus,
      UserID :this.UserId,
    }).subscribe(
    (Response:any)=>{
      if(Response.msg == 'Data Updated Successfully'){
        this.msg.SuccessNotify(Response.msg);
        this.getModuleList();
      }else{
        this.msg.WarnNotify(Response.msg);
      }
    },
    (error:any)=>{
        console.log(error)
    }
    )

  }


  
  delete(item:any){
     this.dataService.deleteHttp(this.globaldata.contorlPanelLink+ 'deleteModule',{
      ModuleID : item.moduleID,
      UserID :this.UserId,
    }).subscribe(
    (Response:any)=>{
      if(Response.msg == 'Data Deleted Successfully'){
        this.msg.SuccessNotify(Response.msg);
        this.getModuleList();
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
