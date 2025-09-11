import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-manufacturing-sale-itemwise',
  templateUrl: './manufacturing-sale-itemwise.component.html',
  styleUrls: ['./manufacturing-sale-itemwise.component.scss']
})
export class ManufacturingSaleItemwiseComponent {



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
    this.global.setHeaderTitle('Sale Report');
    this.getItemList();
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
    if (this.userID == 0) return;
    var curUser = this.userList.find((e: any) => e.userID == this.userID);
    this.userName = curUser.userName;
  }

  mnuItemID: any = 0;
  itemList: any = [];
  getItemList() {

    this.http.get(this.apiReq + 'GetAllMnuItems').subscribe(
      {
        next: (Response: any) => {
          this.itemList = Response;
        },
        error: error => {
          console.log(error);
        }
      }
    )

  }




  DataList: any = [];

  costTotal = 0;
  saleTotal = 0;

  getReport() {

    if (this.mnuItemID == 0) {
      this.msg.WarnNotify('Select Item');
      return;
    }
    var mnuItemID = this.mnuItemID;
    var userID = this.userID;
    var fromDate = this.global.dateFormater(this.fromDate, '');
    var fromTime = this.fromTime;
    var toDate = this.global.dateFormater(this.toDate, '');
    var toTime = this.toTime;

    this.app.startLoaderDark();
    this.http.get(this.apiReq + `SaleDetailRptMnuItemWise?reqMnuItemID=${mnuItemID}&reqUID=${userID}&FromDate=${fromDate}
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
            this.DataList = Response.filter((e: any) => e.invType == this.rptType);


            if (this.DataList.length == 0 || this.DataList == null) {
              this.global.popupAlert('Data Not Found!');
              this.app.stopLoaderDark();
              return;

            }
            this.DataList.forEach((e: any) => {
              this.costTotal += e.costPrice * e.quantity;
              this.saleTotal += e.salePrice * e.quantity;
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


    this.global.ExportHTMLTabletoExcel('printContainer', `Sale Report ${startDate} - ${endDate}`);
  }

  reset() {
    this.DataList = [];
    this.costTotal = 0;
    this.saleTotal = 0;
  }

}
