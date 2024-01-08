import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

import * as $ from 'jquery';

@Component({
  selector: 'app-saledetailrptdatewise',
  templateUrl: './saledetailrptdatewise.component.html',
  styleUrls: ['./saledetailrptdatewise.component.scss']
})
export class SaledetailrptdatewiseComponent implements OnInit {

  
  
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
    $('#summaryTable').hide();
    this.global.setHeaderTitle('Sale Report Datewise');
  
    

  }

  fromDate:any = new Date();
  fromTime:any = '00:00';
  toDate:any = new Date();
  toTime:any = '23:59';
  totalAmount:any= 0;
  totalQty:any = 0;

  dataList:any = [];
  summaryTotalAmount:any = 0;



  getReport(type:any){
    this.app.startLoaderDark();
    if(type == 'detail'){
      $('#summaryTable').hide();
      $('#detailTable').show();
      this.http.get(environment.mainApi+'park/GetSaleDetailBetweenDate?FromDate='+ this.global.dateFormater(this.fromDate,'-')+
    '&ToDate='+this.global.dateFormater(this.toDate,'-')+'&FromTime='+this.fromTime+'&ToTime='+this.toTime).subscribe(
      (Response:any)=>{
       // console.log(Response);
        this.dataList = Response;
        this.totalAmount = 0;
        this.totalQty = 0;
        Response.forEach((e:any) => {
          
          this.totalAmount += e.ticketQuantity * e.ticketPrice;
          this.totalQty += e.ticketQuantity;

        });
        this.app.stopLoaderDark();
      }
    )
    }else if(type == 'summary'){
      $('#summaryTable').show();
      $('#detailTable').hide();
      this.http.get(environment.mainApi+'park/GetSaleSummaryBetweenDate?fromdate='+this.global.dateFormater(this.fromDate,'-')+
      '&todate='+this.global.dateFormater(this.toDate,'-')+'&FromTime='+this.fromTime+'&ToTime='+this.toTime).subscribe(
        (Response:any)=>{
        //  console.log(Response);
          this.dataList = Response;
          this.totalAmount = 0;
          Response.forEach((e:any) => {
            
            this.summaryTotalAmount += e.ticketTotal;
  
          });
          this.app.stopLoaderDark();
        }
      )
    }
  }


  print(){
    this.global.printData('#PrintDiv');
  }

}
