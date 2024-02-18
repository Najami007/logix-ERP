import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Time } from 'highcharts';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-sale-purchase-rptdatewise',
  templateUrl: './sale-purchase-rptdatewise.component.html',
  styleUrls: ['./sale-purchase-rptdatewise.component.scss']
})
export class SalePurchaseRptdatewiseComponent implements OnInit {

  
  
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
    this.global.setHeaderTitle('Sale Report');
    this.getUsers();
    $('#detailTable').show();
    $('#summaryTable').hide();
  }



  reportsList:any = [
    {val:'s',title:'Sale Report'},
    {val:'sr',title:'Sale Return Report'},
    {val:'p',title:'Purchase Report'},
    {val:'pr',title:'Purchase Return Report'},
    {val:'I',title:'Issuance Report'},
    {val:'AI',title:'Adjustment In Report'},
    {val:'Ao',title:'Adjustment Out Report'},
    {val:'Dl',title:'Damage Loss Report'},
    {val:'E',title:'Expiry Report'},
  
]
tmpRptType = 's';
rptType:any = 's';


  userList:any = [];
  userID = 0;
  userName = '';

  fromDate:Date = new Date();
  fromTime:any = '00:00';
  toDate:Date = new Date();
  toTime:any = '23:59';

  SaleDetailList:any = [];

  reportType:any;

  getUsers(){
 
    this.app.startLoaderDark()
    this.http.get(environment.mainApi+this.global.userLink+'getuser').subscribe(
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



  
  onUserSelected(){
    var curUser =  this.userList.find((e:any)=> e.userID == this.userID);
     this.userName = curUser.userName;
   }

   billTotal = 0;
   chargesTotal = 0;
   netGrandTotal = 0;

   qtyTotal = 0;
   detNetTotal = 0;
   profitTotal = 0;
   profitPercentTotal = 0;

   getReport(type:any){
    this.rptType = this.tmpRptType;
   if(type == 'summary'){
    $('#detailTable').hide();
    $('#summaryTable').show();
    this.reportType = 'Summary';
    this.http.get(environment.mainApi+this.global.inventoryLink+'GetInventorySummaryDateWise_2?reqType='+this.rptType+'&reqUserID='+this.userID+'&FromDate='+
    this.global.dateFormater(this.fromDate,'-')+'&todate='+this.global.dateFormater(this.toDate,'-')+'&fromtime='+this.fromTime+'&totime='+this.toTime).subscribe(
      (Response:any)=>{
         //console.log(Response);
        this.SaleDetailList = Response;
        this.billTotal = 0;
        this.chargesTotal = 0;
        this.netGrandTotal = 0;

        Response.forEach((e:any) => {
          this.billTotal += e.billTotal;
          this.chargesTotal += e.otherCharges;
          this.netGrandTotal += e.billTotal;

        });
        
      }
    )
   }

   if(type == 'detail'){
    $('#detailTable').show();
    $('#summaryTable').hide();
    this.reportType = 'Detail';
    this.http.get(environment.mainApi+this.global.inventoryLink+'GetInventoryDetailDateWise_3?reqType='+this.rptType+'&reqUserID='+this.userID+'&FromDate='+
    this.global.dateFormater(this.fromDate,'-')+'&todate='+this.global.dateFormater(this.toDate,'-')+'&fromtime='+this.fromTime+'&totime='+this.toTime).subscribe(
      (Response:any)=>{
        this.SaleDetailList = Response;
        console.log(Response)
        this.qtyTotal = 0;
        this.detNetTotal = 0;
        this.profitPercentTotal = 0;
        this.profitTotal = 0;
         Response.forEach((e:any) => {
          this.qtyTotal += e.quantity;
          if(this.rptType == 's' || this.rptType == 'sr'){
            this.detNetTotal += e.salePrice * e.quantity;
            this.profitTotal += (e.salePrice * e.quantity) - (e.avgCostPrice * e.quantity);
            // this.profitPercentTotal += (((e.salePrice * e.quantity) - (e.avgCostPrice * e.quantity)) / (e.salePrice * e.quantity));
          }
          else{
            this.detNetTotal += e.costPrice * e.quantity;
          }
         });
      }
    )
   }

   }




   print(){
    this.global.printData('#PrintDiv')
   }
 

}
