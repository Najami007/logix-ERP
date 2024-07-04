import { HttpClient } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { SharedServicesDataModule } from 'src/app/Shared/helper/shared-services-data/shared-services-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { PlotCategoryTableComponent } from './plot-category-table/plot-category-table.component';

@Component({
  selector: 'app-plot-category',
  templateUrl: './plot-category.component.html',
  styleUrls: ['./plot-category.component.scss']
})
export class PlotCategoryComponent {

  @ViewChild(PlotCategoryTableComponent) plotCategoryTable: any;

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


    plotCategoryTitle:any = '';
    plotSize:any = '';
    unit:any = '';
    plotCategoryId:any = '';



    edit(item:any, obj:any){

    }

}
