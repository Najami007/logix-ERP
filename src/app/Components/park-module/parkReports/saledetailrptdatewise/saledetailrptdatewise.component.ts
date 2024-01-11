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
  saleTotalAmount:any = 0;
  saleTotalQty:any = 0;
  returnTotalAmount:any = 0;
  returnTotalQty:any = 0;
  SaleList:any = [];
  returnList:any = [];

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
            this.saleTotalAmount += e.ticketQuantity * e.ticketPrice;
            this.saleTotalQty += e.ticketQuantity;
          }
          if(e.type == 'SR'){
            this.returnList.push(e);
            this.returnTotalAmount +=  e.ticketQuantity * e.ticketPrice;
            this.returnTotalQty += e.ticketQuantity;
          }

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
           // console.log(Response);
           this.SaleList = [];
           this.returnList = [];
            this.saleTotalAmount = 0;
            this.saleTotalQty = 0;
            this.returnTotalAmount  = 0;
            this.returnTotalQty = 0;
           Response.forEach((e:any) => {
             
             if(e.type == 'S'){
               this.SaleList.push(e);
               this.saleTotalAmount +=e.ticketTotal;
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
  }


  print(){
    this.global.printData('#PrintDiv');
  }

}
