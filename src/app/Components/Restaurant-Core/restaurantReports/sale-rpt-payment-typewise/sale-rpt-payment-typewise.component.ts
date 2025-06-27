import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Time } from 'highcharts';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { SaleBillDetailComponent } from '../../Sales/sale1/sale-bill-detail/sale-bill-detail.component';

@Component({
  selector: 'app-sale-rpt-payment-typewise',
  templateUrl: './sale-rpt-payment-typewise.component.html',
  styleUrls: ['./sale-rpt-payment-typewise.component.scss']
})
export class SaleRptPaymentTypewiseComponent implements OnInit {



  companyProfile: any = [];
  crudList: any = { c: true, r: true, u: true, d: true };
  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    private global: GlobalDataModule,
    private route: Router,
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
    this.global.setHeaderTitle('Sale Report (Payment Typewise)');
    this.getUsers();
    setTimeout(() => {
      $('#detailTable').show();
      $('#summaryTable').hide();
    }, 200);

  }



  paymentTypeList: any = [{ val: 'Cash', title: 'Cash' }, { val: 'Bank', title: 'Bank' }, { val: 'Split', title: 'Split' }, { val: 'Complimentary', title: 'Complimentary' },]

  paymentType: any = 'Cash';

  userList: any = [];
  userID = 0;
  userName = '';

  fromDate: Date = new Date();
  fromTime: any = '00:00';
  toDate: Date = new Date();
  toTime: any = '23:59';

  SaleDetailList: any = [];
  saleSummaryList: any = [];
  reportType: any;





  getUsers() {
    this.global.getUserList().subscribe((data: any) => { this.userList = data; });
  }




  onUserSelected() {
    var curUser = this.userList.find((e: any) => e.userID == this.userID);
    this.userName = curUser.userName;
  }


  grandTotal = 0;
  detailBillTotal = 0;
  detailOtherChargesTotal = 0;


  getReport(type: any) {

    // alert(this.recipeCatID);

    if (type == 'detail' && (this.paymentType == '' || this.paymentType == undefined)) {
      this.msg.WarnNotify('Select Payment Type')
    } else {

      if (type == 'detail') {
        $('#detailTable').show();
        $('#summaryTable').hide();
        this.reportType = 'Detail';
        this.app.startLoaderDark();
        this.http.get(environment.mainApi + this.global.inventoryLink + 'GetInOutDetailPTWiseAndDateWise?reqPT=' + this.paymentType + '&reqUID=' + this.userID + '&FromDate=' +
          this.global.dateFormater(this.fromDate, '-') + '&todate=' + this.global.dateFormater(this.toDate, '-') + '&fromtime=' + this.fromTime + '&totime=' + this.toTime).subscribe(
            (Response: any) => {
              this.SaleDetailList = [];
              this.grandTotal = 0;
              this.detailBillTotal = 0;
              this.detailOtherChargesTotal = 0;
              if (Response.length == 0 || Response == null) {
                this.global.popupAlert('Data Not Found!');
                this.app.stopLoaderDark();
                return;

              }
              this.SaleDetailList = Response;

              Response.forEach((e: any) => {
                this.detailBillTotal += e.billTotal;
                this.detailOtherChargesTotal += e.otherCharges;
                this.grandTotal += e.netTotal;
              });
              this.app.stopLoaderDark();
            },
            (Error: any) => {
              this.app.stopLoaderDark();
            }
          )
      }

      if (type == 'summary') {
        $('#detailTable').hide();
        $('#summaryTable').show();
        this.reportType = 'Summary';
        this.app.startLoaderDark();
        this.http.get(environment.mainApi + this.global.inventoryLink + 'GetPaymentSaleSummaryDateWise?reqUID=' + this.userID + '&FromDate=' +
          this.global.dateFormater(this.fromDate, '-') + '&todate=' + this.global.dateFormater(this.toDate, '-') + '&fromtime=' + this.fromTime + '&totime=' + this.toTime).subscribe(
            (Response: any) => {
              if (Response.length == 0 || Response == null) {
                this.global.popupAlert('Data Not Found!');
                this.app.stopLoaderDark();
                return;

              }
              this.saleSummaryList = Response;
              this.grandTotal = 0;
              Response.forEach((e: any) => {
                this.grandTotal += e.total;
              });
              this.app.stopLoaderDark();
            },
            (Error: any) => {
              this.app.stopLoaderDark();
            }
          )
      }


    }




  }




  print() {
    this.global.printData('#PrintDiv')
  }

  billDetails(item: any) {
    this.dialog.open(SaleBillDetailComponent, {
      width: '50%',
      data: item,
      disableClose: true,
    }).afterClosed().subscribe(value => {

    })
  }


}
