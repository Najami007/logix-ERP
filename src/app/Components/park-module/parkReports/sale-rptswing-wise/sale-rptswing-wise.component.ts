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
    this.global.setHeaderTitle('Sale Report (Swingwise)');
    this.getSwing();

  }

  fromDate:any = new Date();
  toDate:any = new Date();
  totalAmount:any= 0;
  searchSwing:any;
  dataList:any = [];
  swingID:number =0;
  swingsList:any= [];
  totalQty:number = 0;

  getSwing(){
    this.http.get(environment.mainApi+'park/GetSwing').subscribe(
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
    this.http.get(environment.mainApi+'park/GetSaleDetailBetweenDateSwingWise?FromDate='+this.global.dateFormater(this.fromDate,'-')+
    '&todate='+this.global.dateFormater(this.toDate,'-')+'&SwingID='+this.swingID).subscribe(
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
   }
  }


  print(){
    this.global.printData('#PrintDiv');
  }


  

}
