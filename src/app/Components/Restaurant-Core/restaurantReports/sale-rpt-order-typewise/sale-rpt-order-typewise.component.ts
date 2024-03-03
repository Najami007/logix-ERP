import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Time } from 'highcharts';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { SaleBillDetailComponent } from '../../sale/sale-bill-detail/sale-bill-detail.component';

@Component({
  selector: 'app-sale-rpt-order-typewise',
  templateUrl: './sale-rpt-order-typewise.component.html',
  styleUrls: ['./sale-rpt-order-typewise.component.scss']
})
export class SaleRptOrderTypewiseComponent implements OnInit {



  companyProfile: any = [];
  crudList:any = {c:true,r:true,u:true,d:true};
  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    private global: GlobalDataModule,
    private route: Router,
    private dialog:MatDialog

  ) {

    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
    });

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })
  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Sale Report (Order Typewise)');
    this.getUsers();
    $('#detailTable').hide();
    $('#summaryTable').show();

  }



  orderTypeList:any = [{val:'Dine In', title:'Dine In'},{val:'Take Away', title:'Take Away'},{val:'Home Delivery', title:'Home Delivery'},]

  orderType:any = 'Dine In';

  userList: any = [];
  userID = 0;
  userName = '';

  fromDate: Date = new Date();
  fromTime: any = '00:00';
  toDate: Date = new Date();
  toTime: any = '23:59';

  SaleDetailList: any = [];
  saleSummaryList:any = [];
  reportType: any;

  getUsers() {

    this.app.startLoaderDark()
    this.http.get(environment.mainApi + this.global.userLink + 'getuser').subscribe(
      (Response) => {
        this.userList = Response;

        this.app.stopLoaderDark();

      },
      (error: any) => {
        console.log(error);
        this.app.stopLoaderDark();
      }
    )

  }




  onUserSelected() {
    var curUser = this.userList.find((e: any) => e.userID == this.userID);
    this.userName = curUser.userName;
  }



  
  QtyTotal = 0;
  detailTotal = 0;
  summaryTotal = 0;


  getReport(type:any) {


    if (type == 'detail' && (this.orderType == "" || this.orderType == undefined)) {
      this.msg.WarnNotify("Select Type")
    }else{
     if(type == 'detail'){
      $('#detailTable').show();
      $('#summaryTable').hide();
      this.reportType = 'Detail';
      this.app.startLoaderDark();
      this.http.get(environment.mainApi + this.global.inventoryLink + 'GetSaleDetailOrderWiseAndDateWise?reqOT='+this.orderType+'&reqUID='+this.userID+'&FromDate='+
      this.global.dateFormater(this.fromDate, '-')+'&todate='+this.global.dateFormater(this.toDate, '-')+'&fromtime='+this.fromTime+'&totime='+this.toTime).subscribe(
        (Response: any) => {
          this.SaleDetailList = Response;
          this.detailTotal =0;
          Response.forEach((e:any) => {
  
            this.detailTotal += e.netTotal;
          });

          this.app.stopLoaderDark();
        },
        (Error:any)=>{
          this.app.stopLoaderDark();
        }
      )
     }
     if(type == 'summary'){
      $('#detailTable').hide();
      $('#summaryTable').show();
      this.reportType = 'Summary';
      this.app.startLoaderDark();
      this.http.get(environment.mainApi + this.global.inventoryLink + 'GetOrderTypeSaleSummaryDateWise?reqUID='+this.userID+'&FromDate='+
      this.global.dateFormater(this.fromDate, '-')+'&todate='+this.global.dateFormater(this.toDate, '-')+'&fromtime='+this.fromTime+'&totime='+this.toTime).subscribe(
        (Response: any) => {
          this.saleSummaryList = Response;
          this.QtyTotal = 0;
          this.summaryTotal =0;
          Response.forEach((e:any) => {
            this.QtyTotal += e.quantity;
            this.summaryTotal += e.total;
          });

          this.app.stopLoaderDark();
        },
        (Error:any)=>{
          this.app.stopLoaderDark();
        }
      )
     }
    }



  }




  print() {
    this.global.printData('#PrintDiv')
  }


  billDetails(item:any){
    this.dialog.open(SaleBillDetailComponent,{
      width:'50%',
      data:item,
      disableClose:true,
    }).afterClosed().subscribe(value=>{
      
    })
  }


}
