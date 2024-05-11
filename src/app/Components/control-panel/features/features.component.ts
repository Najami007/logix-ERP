import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { SharedServicesDataModule } from 'src/app/Shared/helper/shared-services-data/shared-services-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { AddFeatureComponent } from './add-feature/add-feature.component';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent {

  
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
      this.globaldata.setHeaderTitle('Features');
      this.getFeatureList();
     
    }


    UserId = this.globaldata.getUserID();
    featureList:any = [];

    
  add(){
    this.dialogue.open(AddFeatureComponent,{
      width:'30%',
    }).afterClosed().subscribe(value=>{
      if(value == 'update'){
        this.getFeatureList();
             }
    })
  }


  getFeatureList(){
    this.dataService.getHttp(this.globaldata.companyLink+ 'getFeatures','').subscribe(
      (Response:any)=>{
          this.featureList = Response;
                  
      }
    )
  }


  edit(item:any){
    this.dialogue.open(AddFeatureComponent,{
      width:'30%',
      data:item,
    }).afterClosed().subscribe(value=>{
      if(value == 'update'){
        this.getFeatureList();
             }
    })
  }



  ActivateModule(item:any){
    this.dataService.saveHttp(this.globaldata.companyLink+ 'activateFeature',{
      FeatureID : item.featureID,
      FeatureStatus : !item.featureStatus,
      UserID :this.UserId,
    }).subscribe(
    (Response:any)=>{
      if(Response.msg == 'Data Updated Successfully'){
        this.msg.SuccessNotify(Response.msg);
        this.getFeatureList();
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
