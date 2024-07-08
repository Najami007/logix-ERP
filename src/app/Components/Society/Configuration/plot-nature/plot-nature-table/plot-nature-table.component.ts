import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { SharedServicesDataModule } from 'src/app/Shared/helper/shared-services-data/shared-services-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

@Component({
  selector: 'app-plot-nature-table',
  templateUrl: './plot-nature-table.component.html',
  styleUrls: ['./plot-nature-table.component.scss']
})
export class PlotNatureTableComponent {

  @Output() eventEmitter = new EventEmitter();

  tableData:any = [];
  
  
  companyProfile:any = [];
  crudList:any = {c:true,r:true,u:true,d:true};

  constructor(private http:HttpClient,
    private msg:NotificationService,
    private globaldata:GlobalDataModule,
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
    
  }

  
  getPlotNature(){
    this.dataService.getHttp('society-api/PlotNature/getPlotNature', '').subscribe((response: any) => {
      this.tableData = response;
    }, (error: any) => {
      console.log(error);
    });
  }
  
  edit(item: any, num: any){
    this.eventEmitter.emit({item, num});
  }

}
