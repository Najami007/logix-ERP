import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-racks',
  templateUrl: './racks.component.html',
  styleUrls: ['./racks.component.scss']
})
export class RacksComponent implements OnInit{

  crudList:any = [];

  constructor(private http:HttpClient,
    private msg:NotificationService,
    private dialogue: MatDialog,
    private globaldata:GlobalDataModule,
    private app:AppComponent,
    private route:Router
    
    ){}
  ngOnInit(): void {
    this.getCrud();
   
  }

  txtSearch:any;
  rackTitle:any;
  rackID:number = 0;
  btnType:any = 'Save';

  categoryList:any = [];





  getCrud(){
    this.http.get(environment.mainApi+'user/getusermenu?userid='+this.globaldata.getUserID()+'&moduleid='+this.globaldata.getModuleID()).subscribe(
      (Response:any)=>{
        this.crudList =  Response.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
      }
    )
  }



  save(){

  }



  reset(){
    this.rackTitle = '';
    this.rackID = 0 ;
    this.btnType = 'Save';

  }


  edit(row:any){}

  delete(row:any){}


}
