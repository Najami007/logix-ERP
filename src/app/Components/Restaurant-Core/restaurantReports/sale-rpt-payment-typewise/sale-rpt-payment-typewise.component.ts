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
  selector: 'app-sale-rpt-payment-typewise',
  templateUrl: './sale-rpt-payment-typewise.component.html',
  styleUrls: ['./sale-rpt-payment-typewise.component.scss']
})
export class SaleRptPaymentTypewiseComponent implements OnInit {



  companyProfile: any = [];
  crudList: any = [];
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
    this.global.setHeaderTitle('Sale Report (Recipewise)');
    this.getUsers();
    $('#detailTable').show();
    $('#summaryTable').hide();

  }



  paymentTypeList:any = [{val:'Cash', title:'Cash'},{val:'Bank', title:'Bank'},{val:'Split', title:'Split'},{val:'Complimentary', title:'Complimentary'},]

  paymentType:any = 'Cash';

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


  grandTotal = 0;


  getReport(type:any) {

    // alert(this.recipeCatID);
   
  if(type == 'detail' && (this.paymentType == '' || this.paymentType == undefined)){
    this.msg.WarnNotify('Select Payment Type')
  }else{

   if(type == 'detail'){
    $('#detailTable').show();
    $('#summaryTable').hide();
    this.reportType = 'Detail';
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetInOutDetailPTWiseAndDateWise?reqPT='+this.paymentType+'&reqUID='+this.userID+'&FromDate='+
    this.global.dateFormater(this.fromDate, '-')+'&todate='+this.global.dateFormater(this.toDate, '-')+'&fromtime='+this.fromTime+'&totime='+this.toTime).subscribe(
      (Response: any) => {
        this.SaleDetailList = Response;
        this.grandTotal = 0;
        Response.forEach((e:any) => {
          this.grandTotal += e.netTotal;
        });

      }
    )
   }

   if(type == 'summary'){
    $('#detailTable').hide();
        $('#summaryTable').show();
        this.reportType = 'Summary';
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetPaymentSaleSummaryDateWise?reqUID='+this.userID+'&FromDate='+
    this.global.dateFormater(this.fromDate, '-')+'&todate='+this.global.dateFormater(this.toDate, '-')+'&fromtime='+this.fromTime+'&totime='+this.toTime).subscribe(
      (Response: any) => {
        this.saleSummaryList = Response;
        this.grandTotal = 0;
        Response.forEach((e:any) => {
          this.grandTotal += e.total;
        });

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
