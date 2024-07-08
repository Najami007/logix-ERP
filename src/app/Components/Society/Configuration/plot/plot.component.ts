import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { SharedServicesDataModule } from 'src/app/Shared/helper/shared-services-data/shared-services-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { PlotTableComponent } from './plot-table/plot-table.component';

@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.scss']
})
export class PlotComponent {

  
  @ViewChild(PlotTableComponent) plotTable: any;
  
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
      this.globaldata.setHeaderTitle('Plot');
     
    }

    btnType = 'Save';
    plotID = 0;
    userID = 0;
    plotName = '';
    plotShortName = '';
    plotDescription = '';
    plotLongitude = '';
    plotLateitude = '';
    plotCategoryId = 0;
    plotTypeId = 0;
    plotNatureId = 0;
    plotBlockID = 0;
    plotSubBlockID = 0;
    plotSize = '';


    plotCategoryList: any = [];
    plotTypeList: any = [];
    plotNatureList: any = [];



    edit(item:any){

    }


    save(){

    }

    reset(){
    this.plotID = 0;
    this.userID = 0;
    this.plotName = '';
    this.plotShortName = '';
    this.plotDescription = '';
    this.plotLongitude = '';
    this.plotLateitude = '';
    this.plotCategoryId = 0;
    this.plotTypeId = 0;
    this.plotNatureId = 0;
    this.plotBlockID = 0;
    this.plotSubBlockID = 0;
    this.plotSize = '';
    this.btnType = 'Save';
    }
}
