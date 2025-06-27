import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { VoucherDetailsComponent } from 'src/app/Components/Accounts/CommonComponent/voucher-details/voucher-details.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
import { SaleBillPrintComponent } from '../../Sale/SaleComFiles/sale-bill-print/sale-bill-print.component';
import { PurchaseBillPrintComponent } from '../../Purchases/purchase-bill-print/purchase-bill-print.component';

@Component({
  selector: 'app-day-closing-rpt',
  templateUrl: './day-closing-rpt.component.html',
  styleUrls: ['./day-closing-rpt.component.scss']
})
export class DayClosingRptComponent {




  @ViewChild(SaleBillPrintComponent) saleBill: any;
  @ViewChild(PurchaseBillPrintComponent) purchaseBill: any;
  @ViewChild(PurchaseBillPrintComponent) adjustmentBill: any;


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
    this.global.setHeaderTitle('Day Closing');
    $('#detailTable').show();
    $('#summaryTable').hide();
  }

  cashSaleOnly = false;
  creditSaleOnly = false;

  fromDate: Date = new Date();
  fromTime: any = '00:00';
  toDate: Date = new Date();
  toTime: any = '23:59';

  rptData: any = [];
  tmpRptData: any = [];

  getReport() {

    var fromDate = this.global.dateFormater(this.fromDate, '-');
    var toDate = this.global.dateFormater(this.fromDate, '-');
    this.app.startLoaderDark();
    var url = environment.mainApi + this.global.accountLink + 'GetDayTransaction2?FromDate=' + fromDate + '&ToDate=' + toDate;
    this.http.get(url).subscribe(
      (Response: any) => {
        this.rptData = [];
        this.tmpRptData = [];
        if (Response.length == 0 || Response == null) {
          this.global.popupAlert('Data Not Found!');
          this.app.stopLoaderDark();
          return;
        }
        this.rptData = Response.map((e: any) => {
          if (e.billDetail != '-') {
            e.billDetails = JSON.parse(e.billDetail);
          }

          return e;
        });
        this.tmpRptData = this.rptData;
        // this.filter(this.cashSaleOnly?'cash':'credit')
        this.app.stopLoaderDark();
      },
      (Error: any) => {
        console.log(Error);
        this.app.stopLoaderDark();
      }
    )

  }


  VoucherDetails(row: any) {

    this.dialog.open(VoucherDetailsComponent, { width: "40%", data: row, }).afterClosed().subscribe(val => { });
  }




  print() {
    this.global.printData('#PrintDiv')
  }


  printBill(item: any) {

    if (item.billDetails[0].InvType == 'S' || item.billDetails[0].InvType == 'SR') {
      this.saleBill.PrintBill(item.invBillNo);
      this.saleBill.billType = 'Duplicate';
    }

    // if (item.billDetails[0].InvType == 'P' || item.billDetails[0].InvType == 'PR') {
    //   this.purchaseBill.printBill(item);
    // }


    // if (item.billDetails[0].InvType == 'I' ||item.billDetails[0].InvType == 'AI' || item.billDetails[0].InvType == 'AO' || item.billDetails[0].InvType == 'DL' || item.billDetails[0].InvType == 'E' ) {
    //   this.adjustmentBill.printBill(item);
    // }


  }


  filter(type:any) {

    if (this.cashSaleOnly && type == 'cash') {
      this.creditSaleOnly  = false;
      this.rptData = this.tmpRptData.filter((e: any) => e.invoiceType == 'Cash Sale');
    }
    if (this.creditSaleOnly && type == 'credit') {
      this.cashSaleOnly  = false;
      this.rptData = this.tmpRptData.filter((e: any) => e.invoiceType == 'Credit Sale');
    }

  }


}
