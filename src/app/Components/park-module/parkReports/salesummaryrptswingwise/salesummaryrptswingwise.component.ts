import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-salesummaryrptswingwise',
  templateUrl: './salesummaryrptswingwise.component.html',
  styleUrls: ['./salesummaryrptswingwise.component.scss']
})
export class SalesummaryrptswingwiseComponent implements OnInit {

  
  
  companyProfile:any = [];
  crudList:any = [];
  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private app:AppComponent,
    private global:GlobalDataModule,
    private route:Router
    
  ){

    this.global.getCompany().subscribe((data)=>{
      this.companyProfile = data;
    });

    this.global.getMenuList().subscribe((data)=>{
      this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
    })
  }





  ngOnInit(): void {

    this.global.setHeaderTitle('Swing Sale Summary');

    

  }
  fromDate:any = new Date();
  fromTime:any = '00:00';
  toDate:any = new Date();
  toTime:any = '23:59';
  totalAmount:any= 0;
  totalQty:any = 0;

  dataList:any = [];
  summaryTotalAmount:any = 0;

  saleTotalAmount:any = 0;
  saleTotalQty:any = 0;
  returnTotalAmount:any = 0;
  returnTotalQty:any = 0;
  SaleList:any = [];
  returnList:any = [];



  getReport(){
    this.app.startLoaderDark();
 
      this.http.get(environment.mainApi+this.global.parkLink+'GetSaleSummaryBetweenDateSwingWise?FromDate='+ this.global.dateFormater(this.fromDate,'-')+
    '&ToDate='+this.global.dateFormater(this.toDate,'-')+'&FromTime='+this.fromTime+'&ToTime='+this.toTime).subscribe(
      (Response:any)=>{
       //console.log(Response);
       this.SaleList = [];
       this.returnList = [];
        this.saleTotalAmount = 0;
        this.saleTotalQty = 0;
        this.returnTotalAmount  = 0;
        this.returnTotalQty = 0;
        Response.forEach((e:any) => {
          
          if(e.type == 'S'){
            this.SaleList.push(e);
            this.saleTotalAmount += e.ticketTotal;
            this.saleTotalQty += e.ticketQuantity;
          }
          if(e.type == 'SR'){
            this.returnList.push(e);
            this.returnTotalAmount += e.ticketTotal;
            this.returnTotalQty += e.ticketQuantity;
          }
       

        });
        this.app.stopLoaderDark();
      }
    )
    
  }


  print(){
    this.global.printData('#PrintDiv');
  }

}
