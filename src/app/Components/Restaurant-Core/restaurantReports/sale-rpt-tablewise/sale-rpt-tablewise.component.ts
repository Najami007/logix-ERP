import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Time } from 'highcharts';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { SaleBillDetailComponent } from '../../sale/sale-bill-detail/sale-bill-detail.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sale-rpt-tablewise',
  templateUrl: './sale-rpt-tablewise.component.html',
  styleUrls: ['./sale-rpt-tablewise.component.scss']
})
export class SaleRptTablewiseComponent implements OnInit {



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
    this.global.setHeaderTitle('Sale Report (Tablewise)');
    this.getUsers();
    this.getTable();
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

  tableList:any = [];
  tableID = 0;
  tableTitle = '';
  
  getTable(){
    this.http.get(environment.mainApi+this.global.restaurentLink+'GetTable').subscribe(
      (Response:any)=>{
        this.tableList = Response;
      }
    )
  }

  
  onTableSelected() {
    var title = this.tableList.find((e: any) => e.tableID == this.tableID);
    this.tableTitle = title.tableTitle;
  }




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



  grandTotal= 0;
  billGrandTotal = 0;
  OtherChargesTotal = 0;
  summaryTotal = 0;
  getReport(type:any) {


    if ( type == 'detail' && (this.tableID == 0 || this.tableID == undefined)) {

      this.msg.WarnNotify("Select Table")
    }else{
     
      if(type == 'detail'){
        $('#detailTable').show();
      $('#summaryTable').hide();
      this.reportType = 'Detail';
        this.http.get(environment.mainApi + this.global.inventoryLink + 'GetSaleDetailTableWiseAndDateWise?reqtid='+this.tableID+'&reqUID='+this.userID+'&FromDate='+
        this.global.dateFormater(this.fromDate, '-')+'&todate='+this.global.dateFormater(this.toDate, '-')+'&fromtime='+this.fromTime+'&totime='+this.toTime).subscribe(
          (Response: any) => {
            this.SaleDetailList = Response;
            this.grandTotal = 0;
            this.billGrandTotal = 0;
            this.OtherChargesTotal = 0;
            Response.forEach((e:any) => {
              this.grandTotal += e.netTotal;
              this.billGrandTotal += e.billTotal;
              this.OtherChargesTotal += e.otherCharges;
            });
  
          }
        )
      }

      if(type == 'summary'){
        $('#detailTable').hide();
        $('#summaryTable').show();
        this.reportType = 'Summary';
        this.http.get(environment.mainApi + this.global.inventoryLink + 'GetTableSaleSummaryDateWise?&reqUID='+this.userID+'&FromDate='+
        this.global.dateFormater(this.fromDate, '-')+'&todate='+this.global.dateFormater(this.toDate, '-')+'&fromtime='+this.fromTime+'&totime='+this.toTime).subscribe(
          (Response: any) => {
            this.saleSummaryList = Response;
            this.summaryTotal = 0;
            Response.forEach((e:any) => {
             this.summaryTotal += e.total;
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
