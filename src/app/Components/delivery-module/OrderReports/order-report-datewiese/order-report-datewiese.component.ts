import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
import { error } from 'jquery';
import { MatDialog } from '@angular/material/dialog';
import { OrderDetailComponent } from '../../order-management/order-detail/order-detail.component';

@Component({
  selector: 'app-order-report-datewiese',
  templateUrl: './order-report-datewiese.component.html',
  styleUrls: ['./order-report-datewiese.component.scss']
})
export class OrderReportDatewieseComponent implements OnInit {

  apiReq = environment.mainApi + this.global.mobileLink;


  companyProfile: any = [];
  crudList: any = { c: true, r: true, u: true, d: true };
  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    public global: GlobalDataModule,
    private route: Router,
    private datePipe: DatePipe,
    private dialog: MatDialog
  ) {

    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
    });

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })
  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Order Report');
    this.getUsers();


  }



  formateType = 1;
  reportsList: any = []
  tmpRptType = 'S';
  rptType: any = 'S';


  userList: any = [];
  userID = 0;
  userName = '';

  fromDate: Date = new Date();
  fromTime: any = '00:00';
  toDate: Date = new Date();
  toTime: any = '23:59';

  SaleDetailList: any = [];

  reportType: any;

  getUsers() {
     this.http.get(environment.mainApi + this.global.mobileLink + 'GetMobUser').subscribe(
      {
        next: (Response: any) => {
  
          if (Response.length > 0) {
            this.userList = Response.filter((e: any) => e.userType == 'Customer');
          }
        },
        error: (error: any) => {
          console.log(error);
        }
      }
    )
    // this.global.getUserList().subscribe((data: any) => {

    //   if (data.length > 0) {
    //     this.userList = data.filter((e:any=> e.));
    //   }

    // });
  }
  locationID = 0;
  locationList: any = [];




  onUserSelected() {
    var curUser = this.userList.find((e: any) => e.userID == this.userID);
    this.userName = curUser.userName;
  }

  dataList: any = [];
  grandTotal: any = 0;

  getReport() {

    var fromDate = this.global.dateFormater(this.fromDate, '');
    var toDate = this.global.dateFormater(this.toDate, '');
    var fromTime = this.fromTime;
    var toTime = this.toTime;
    var userID = this.userID;
    var url = `${this.apiReq}GetMobOrders?MobUserID=${userID}&FromDate=${fromDate}&ToDate=${toDate}&FromTime=${fromTime}&ToTime=${toTime}&reqFilter=-`


    this.app.startLoaderDark();
    this.http.get(url).subscribe({
      next: (Response: any) => {
        this.reset();
        if (Response.length == 0 || Response == null) {
          this.global.popupAlert('Data Not Found!');
          this.app.stopLoaderDark();
          return;

        }

        this.dataList = Response;

        if (this.dataList.length > 0) {
          this.dataList.forEach((e: any) => {
            this.grandTotal += e.netTotal;
          })
        }

        this.app.stopLoaderDark();

      },
      error: error => {
        console.log(error);
        this.app.stopLoaderDark();
      }
    })
  }




  print() {
    this.global.printData('#PrintDiv')
  }



  export() {
    var type = this.reportsList.find((e: any) => e.invType == this.tmpRptType).invTypeTitle;
    var startDate = this.datePipe.transform(this.fromDate, 'dd/MM/yyyy');
    var endDate = this.datePipe.transform(this.toDate, 'dd/MM/yyyy');

    var tableID = '';

    if (this.formateType == 1) tableID = 'summaryTable';
    if (this.formateType == 2) tableID = 'detailTable';
    if (this.formateType == 3) tableID = 'TaxsummaryTable';


    this.global.ExportHTMLTabletoExcel(tableID, type + '(' + startDate + ' - ' + endDate + ')')
  }


  reset() {

    this.grandTotal = 0;
    this.dataList = [];

  }


  openDetail(item: any) {
    this.dialog.open(OrderDetailComponent, {
      width: '60%',
      data: item
    }).afterClosed().subscribe();
  }



}
