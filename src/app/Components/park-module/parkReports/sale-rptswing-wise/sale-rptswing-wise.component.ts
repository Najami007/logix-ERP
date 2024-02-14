import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-sale-rptswing-wise',
  templateUrl: './sale-rptswing-wise.component.html',
  styleUrls: ['./sale-rptswing-wise.component.scss']
})
export class SaleRptswingWiseComponent implements OnInit {

  companyProfile:any = [];
  crudList:any = {c:true,r:true,u:true,d:true};
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
    this.global.setHeaderTitle('Sale Report (Swingwise)');
    this.getSwing();

  }

  fromDate:any = new Date();
  fromTime:any = '00:00';
  toDate:any = new Date();
  toTime:any = '23:59';
  totalAmount:any= 0;
  searchSwing:any;
  dataList:any = [];
  swingID:number =0;
  swingsList:any= [];
  totalQty:number = 0;
  saleTotalAmount:any = 0;
  saleTotalQty:any = 0;
  returnTotalAmount:any = 0;
  returnTotalQty:any = 0;
  SaleList:any = [];
  returnList:any = [];

  getSwing(){
    this.http.get(environment.mainApi+this.global.parkLink+'GetSwing').subscribe(
      (Response:any)=>{
        this.swingsList = Response;
        // console.log(Response);

      }
    )
  }


  getReport(){
   
   if(this.swingID == 0 || this.swingID == undefined){
    this.msg.WarnNotify('Select Swing')
   }else {
    this.app.startLoaderDark();
    this.http.get(environment.mainApi+this.global.parkLink+'GetSaleDetailBetweenDateSwingWise?FromDate='+this.global.dateFormater(this.fromDate,'-')+
    '&todate='+this.global.dateFormater(this.toDate,'-')+'&SwingID='+this.swingID+'&FromTime='+this.fromTime+'&ToTime='+this.toTime).subscribe(
      (Response:any)=>{
       //console.log(Response);
       this.SaleList = [];
       this.returnList = [];//unt = 0;
       this.saleTotalAmount= 0;
        this.saleTotalQty = 0;
        this.returnTotalAmount  = 0;
        this.returnTotalQty = 0;
        Response.forEach((e:any) => {

          
          if(e.type == 'S'){
            this.SaleList.push(e);
            this.saleTotalAmount += e.ticketQuantity * e.ticketPrice
            this.saleTotalQty += e.ticketQuantity;
          }
          if(e.type == 'SR'){
            this.returnList.push(e);
            this.returnTotalAmount += e.ticketQuantity * e.ticketPrice;
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
