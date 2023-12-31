import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

import * as $ from 'jquery';

@Component({
  selector: 'app-salesummarydateuserwise',
  templateUrl: './salesummarydateuserwise.component.html',
  styleUrls: ['./salesummarydateuserwise.component.scss']
})
export class SalesummarydateuserwiseComponent implements OnInit {

  
  
  
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
    $('#detailTable').show();
    this.getUsers();
    this.global.setHeaderTitle('Sale Summary Date & Userwise');
   

  }
  searchUser:any;
  fromDate:any = new Date();
  toDate:any = new Date();
  totalAmount:any= 0;
  totalQty:any = 0;
  userID:number = 0;
  dataList:any = [];
  userList:any = [];
  userName:any;
  detailTotalAmount:any = 0;


  onUserSelected(){
   var curUser =  this.userList.find((e:any)=> e.userID == this.userID);
    this.userName = curUser.userName;
  }

  getUsers(){
 
    this.app.startLoaderDark()
    this.http.get(environment.mainApi+'user/getuser').subscribe(
      (Response)=>{
        this.userList = Response;
        // console.log(Response);
        
        this.app.stopLoaderDark();

      },
      (error:any)=>{
        console.log(error);
        this.app.stopLoaderDark();
      }
    )
   
  }

  getReport(type:any){
    if(this.userID == 0 || this.userID == undefined){
      this.msg.WarnNotify('Select User')
     }else {
    this.app.startLoaderDark();

   if(type == 'summary'){
    $('#detailTable').hide();
    $('#summaryTable').show();
    
    this.http.get(environment.mainApi+'park/GetSaleSummaryBetweenDateUserWise?FromDate='+ this.global.dateFormater(this.fromDate,'-')+
    '&ToDate='+this.global.dateFormater(this.toDate,'-')+'&UserID='+this.userID).subscribe(
      (Response:any)=>{
     //   console.log(Response);
        this.dataList = Response;
        this.totalAmount = 0;
        this.totalQty = 0;
        Response.forEach((e:any) => {
          
          this.totalAmount += e.ticketTotal;
          this.totalQty += e.ticketQuantity;

        });
        this.app.stopLoaderDark();
      }
    )
   }else if(type == 'detail'){
    $('#detailTable').show();
    $('#summaryTable').hide();
    
    this.http.get(environment.mainApi+'park/GetSaleDetailBetweenDateUserWise?FromDate='+ this.global.dateFormater(this.fromDate,'-')+
    '&ToDate='+this.global.dateFormater(this.toDate,'-')+'&UserID='+this.userID).subscribe(
      (Response:any)=>{
     //   console.log(Response);
        this.dataList = Response;
        this.totalAmount = 0;
        this.totalQty = 0;
        Response.forEach((e:any) => {
          
          this.detailTotalAmount += e.ticketQuantity * e.ticketPrice;
          this.totalQty += e.ticketQuantity;

        });
        this.app.stopLoaderDark();
      }
    )
   }
  }}


  print(){
    this.global.printData('#PrintDiv');
  }


}
