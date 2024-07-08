import { HttpClient } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { SharedServicesDataModule } from 'src/app/Shared/helper/shared-services-data/shared-services-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { PlotNatureTableComponent } from './plot-nature-table/plot-nature-table.component';

@Component({
  selector: 'app-plot-nature',
  templateUrl: './plot-nature.component.html',
  styleUrls: ['./plot-nature.component.scss']
})
export class PlotNatureComponent {

  @ViewChild(PlotNatureTableComponent) plotNatureTable: any;

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
      this.globaldata.setHeaderTitle('Plot Category');
     
    }

    btnType = 'Save';
    plotnatureTitle = '';
    description = '';
   
    NewplotnatureId = 0;



    edit(item:any, obj:any){

    }


    save(){

    }

    reset(){
      this.btnType = 'Save';
      this.plotnatureTitle = '';
      this.description = '';
     
      this.NewplotnatureId = 0;
    }

}