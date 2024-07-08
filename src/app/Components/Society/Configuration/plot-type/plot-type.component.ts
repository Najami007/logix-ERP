import { Component, ViewChild } from '@angular/core';
import { PlotTypeTableComponent } from './plot-type-table/plot-type-table.component';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';
import { SharedServicesDataModule } from 'src/app/Shared/helper/shared-services-data/shared-services-data.module';

@Component({
  selector: 'app-plot-type',
  templateUrl: './plot-type.component.html',
  styleUrls: ['./plot-type.component.scss']
})
export class PlotTypeComponent {

  @ViewChild(PlotTypeTableComponent) plotTypeTable: any;

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
      this.globaldata.setHeaderTitle('Plot Type');
     
    }

    btnType = 'Save';
    NewplotTypeId:any = 0;
    plotTypeTitle:any = '';
    plotTypeDescription:any = '';

    edit(item:any, obj:any){

    }


    save(){

    }

    reset(){
      this.NewplotTypeId = 0;
      this.plotTypeTitle = '';
      this.plotTypeDescription = '';
      this.btnType = 'Save';
    }


}
