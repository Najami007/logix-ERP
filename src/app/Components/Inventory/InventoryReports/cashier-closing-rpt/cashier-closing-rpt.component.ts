import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Time } from 'highcharts';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-cashier-closing-rpt',
  templateUrl: './cashier-closing-rpt.component.html',
  styleUrls: ['./cashier-closing-rpt.component.scss']
})
export class CashierClosingRptComponent implements OnInit {

  FBRFeature = this.global.FBRFeature;

  companyProfile: any = [];
  crudList:any = {c:true,r:true,u:true,d:true};
  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    private global: GlobalDataModule,
    private route: Router

  ) {

    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
    });

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })

 

  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Cashier Closing Report');
    this.getUsers();
 

  }



  Date = new Date();

  ClosingDetail: any = [];
  userList:any = [];
  userID = 0;
  userName = '';


  getUsers() {

    this.global.getUserList().subscribe((data: any) => { this.userList = data; });

  }

  
  onUserSelected() {
    var curUser = this.userList.find((e: any) => e.userID == this.userID);
    this.userName = curUser.userName;
  }



  TotalSales = 0;
  totalSaleReturn = 0;
  totalServiceCharges = 0;
  totalCash = 0;
  totalCredit = 0;
  totalBank = 0;
  totalComplimentary = 0;
  totalDiscount = 0;
  totalHDCharges = 0;
  totalPosFee = 0;

  getReport() {   
          this.http.get(environment.mainApi + this.global.inventoryLink +'GetDayClosingRpt_9?reqDate='+this.global.dateFormater(this.Date,'-')).subscribe(
            (Response: any) => {
              console.log(Response);
              this.TotalSales = 0
              this.totalSaleReturn = 0
              this.totalServiceCharges = 0
              this.totalCash = 0
              this.totalBank = 0
              this.totalComplimentary= 0
              this.totalDiscount = 0
              this.totalHDCharges = 0;
              this.totalCredit = 0;
              
              if(this.userID > 0){
                this.ClosingDetail = Response.filter((e:any)=>e.userID == this.userID);
              }else{
                this.ClosingDetail = Response;
                
              }
              
              this.ClosingDetail.forEach((e:any) => {
                this.TotalSales += e.totalSale;
                this.totalSaleReturn += e.saleReturn;
                this.totalServiceCharges += e.servicesCharges;
                this.totalCash += e.cashIn - e.cashOut;
                this.totalBank += e.bank;
                this.totalComplimentary += e.complimentary;
                this.totalDiscount += e.disocunt;
                this.totalHDCharges += e.hdCharges;
                this.totalCredit += e.creditSale;
                this.totalPosFee += e.posFee;
              });

            }
          )
  }




  print() {
    this.global.printData('#PrintDiv')
  }


}

