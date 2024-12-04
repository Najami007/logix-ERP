import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { SharedServicesDataModule } from 'src/app/Shared/helper/shared-services-data/shared-services-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { AddCodeComponent } from './add-code/add-code.component';

@Component({
  selector: 'app-codes',
  templateUrl: './codes.component.html',
  styleUrls: ['./codes.component.scss']
})
export class CodesComponent {

  
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
      this.globaldata.setHeaderTitle('Codes');
      this.getCodesList();
     
    }


    UserId = this.globaldata.getUserID();
    codeList:any = [];

    
  addCode(){
    this.dialogue.open(AddCodeComponent,{
      width:'30%',
    }).afterClosed().subscribe(value=>{
      if(value == 'update'){
        this.getCodesList();
             }
    })
  }


  getCodesList(){
    this.dataService.getHttp(this.globaldata.contorlPanelLink+ 'getCodes','').subscribe(
      (Response:any)=>{
          this.codeList = Response;
        
      }
    )
  }


  editModule(item:any){
    this.dialogue.open(AddCodeComponent,{
      width:'30%',
      data:item,
    }).afterClosed().subscribe(value=>{
      if(value == 'update'){
        this.getCodesList();
             }
    })
  }




  
 



}
