import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-material-consumption-rpt',
  templateUrl: './material-consumption-rpt.component.html',
  styleUrls: ['./material-consumption-rpt.component.scss']
})
export class MaterialConsumptionRptComponent implements OnInit {

  apiReq = environment.mainApi + this.global.manufacturingLink;
  companyProfile: any = [];
  crudList: any = { c: true, r: true, u: true, d: true };
  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    public global: GlobalDataModule,
    private route: Router,
    private datePipe: DatePipe
  ) {

    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
    });

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })
  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Material consumption');
    this.getUsers();
  }


  rptType: any = 'ORDER';

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
    this.global.getUserList().subscribe((data: any) => { this.userList = data; });
  }

  onUserSelected() {
    var curUser = this.userList.find((e: any) => e.userID == this.userID);
    this.userName = curUser.userName;
  }


  DataList: any = [];

  billTotal = 0;
  billDiscountTotal = 0;
  netTotal = 0;

  getReport() {

    var userID = this.userID;
    var fromDate = this.global.dateFormater(this.fromDate, '');
    var fromTime = this.fromTime;
    var toDate = this.global.dateFormater(this.toDate, '');
    var toTime = this.toTime;

    this.app.startLoaderDark();
    this.http.get(this.apiReq + `GetConsumptionRptDateWise?reqUID=${userID}&FromDate=${fromDate}
      &ToDate=${toDate}&FromTime=${fromTime}&ToTime=${toTime}`).subscribe(
      {
        next: (Response: any) => {
          this.reset();


          if (Response.length == 0 || Response == null) {
            this.global.popupAlert('Data Not Found!');
            this.app.stopLoaderDark();
            return;

          }

          if (Response.length > 0) {
            this.DataList = Response;
            this.DataList.forEach((e: any) => {

              this.netTotal += e.avgCostPriceTotal;
            });
          }

          this.app.stopLoaderDark();

        },
        error: error => {
          console.log(error);
          this.app.stopLoaderDark();
        }
      }
    )

  }


  print() {
    this.global.printData('#PrintDiv')
  }

  export() {

    var startDate = this.datePipe.transform(this.fromDate, 'dd/MM/yyyy');
    var endDate = this.datePipe.transform(this.toDate, 'dd/MM/yyyy');


    this.global.ExportHTMLTabletoExcel('#printContainer', `Consumption Report ${startDate} - ${endDate}`);
  }

  reset() {
    this.billTotal = 0;
    this.billDiscountTotal = 0;
    this.netTotal = 0;

    this.DataList = [];
  }

}
