import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'jquery';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';


@Component({
  selector: 'app-production-report',
  templateUrl: './production-report.component.html',
  styleUrls: ['./production-report.component.scss']
})
export class ProductionReportComponent implements OnInit {

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
    this.global.setHeaderTitle('Production Report');
    this.getUsers();
    this.getItemList();
    this.getCategoryList();
    this.getPartyList();
  }



  rptType: any = 1;

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



  mnuCategoryID: any = 0
  categoryList: any = [];
  getCategoryList() {
    this.http.get(environment.mainApi + this.global.manufacturingLink + 'GetMnuItemsCategories').subscribe(
      {
        next: (Response: any) => {
          this.categoryList = Response;
        },
        error: (error: any) => {
          console.log(error);
        }
      }
    )
  }


  partyID = 0;
  partyList: any = [];

  getPartyList() {
    this.http.get(environment.mainApi + this.global.companyLink + 'getParty').subscribe(
      {
        next: (Response: any) => {
          if (Response.length > 0) {
            this.partyList = Response.filter((e: any) => e.partyType == 'Labour');

          }
        },
        error: (error: any) => {
          console.log(error);
        }
      }
    )
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

    var url = '';

    if (this.rptType == 1) {
      url = `${this.apiReq}ProductionRptSummary?reqUID=${userID}&FromDate=${fromDate}
      &ToDate=${toDate}&FromTime=${fromTime}&ToTime=${toTime}`;
    }

    if (this.rptType == 2) {
      url = `${this.apiReq}ProductionRptDetail?reqUID=${userID}&FromDate=${fromDate}
      &ToDate=${toDate}&FromTime=${fromTime}&ToTime=${toTime}`;
    }



    this.app.startLoaderDark();

    this.http.get(url).subscribe(
      {
        next: (Response: any) => {
          this.reset();
          if (Response.length == 0 || Response == null) {
            this.global.popupAlert('Data Not Found!');
            this.app.stopLoaderDark();
            return;

          }

          if (this.rptType == 1) {
            this.mnuItemID = 0;
            this.mnuCategoryID = 0;

            if (this.partyID > 0) {
              this.DataList = Response.filter((e: any) => e.partyID == this.partyID);

              if (this.DataList.length == 0 || this.DataList == null) {
                this.global.popupAlert('Data Not Found!');
                this.app.stopLoaderDark();
                return;

              }
            } else {
              this.DataList = Response;

            }


          }

          if (this.rptType == 2) {

            if (this.mnuItemID == 0 && this.mnuCategoryID == 0 && this.partyID == 0) {
              this.DataList = Response;
            } else {
              this.DataList = Response.filter((e: any) => {

                let isValid = true;
                if (this.mnuItemID > 0) {
                  isValid = isValid && e.mnuItemID == this.mnuItemID;
                }
                if (this.mnuCategoryID > 0) {
                  isValid = isValid && e.mnuItemCatID == this.mnuCategoryID;
                }
                if (this.partyID > 0) {
                  isValid = isValid && e.partyID == this.partyID;
                }

                return isValid; // ✅ Imp
              });
                if (this.DataList.length == 0 || this.DataList == null) {
                this.global.popupAlert('Data Not Found!');
                this.app.stopLoaderDark();
                return;

              }
            }



          }


          this.DataList.forEach((e: any) => {
            if (this.rptType == 1) {
              this.netTotal += e.netTotal;
            }

            if (this.rptType == 2) {
              this.netTotal += e.mnuLabourCharges * e.quantity;
            }

          });


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


    this.global.ExportHTMLTabletoExcel('printContainer', `Production Report ${startDate} - ${endDate}`);
  }


  reset() {


    this.billTotal = 0;
    this.billDiscountTotal = 0;
    this.netTotal = 0;

    this.DataList = [];

  }

}
