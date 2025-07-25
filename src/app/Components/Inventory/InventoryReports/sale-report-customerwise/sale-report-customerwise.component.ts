import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Time } from 'highcharts';
import { SaleBillDetailComponent } from 'src/app/Components/Restaurant-Core/Sales/sale1/sale-bill-detail/sale-bill-detail.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { SaleBillPrintComponent } from '../../Sale/SaleComFiles/sale-bill-print/sale-bill-print.component';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-sale-report-customerwise',
  templateUrl: './sale-report-customerwise.component.html',
  styleUrls: ['./sale-report-customerwise.component.scss']
})
export class SaleReportCustomerwiseComponent implements OnInit {

  @ViewChild(SaleBillPrintComponent) billPrint: any;

  companyProfile: any = [];
  crudList: any = { c: true, r: true, u: true, d: true };
  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    private global: GlobalDataModule,
    private route: Router,
    private dialog: MatDialog,
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
    this.global.setHeaderTitle('Sale History Customer wise');
    this.getUsers();
    this.getParty();


  }

  

  hideProfit = false;
  hideCost = false;
  formateType = 1;

  partyList: any = [];
  partyID = 0;
  partyName = '';

  userList: any = [];
  userID = 0;
  userName = '';

  fromDate: Date = new Date();
  fromTime: any = '00:00';
  toDate: Date = new Date();
  toTime: any = '23:59';

  DetailList: any = [];
  saleSummaryList: any = [];
  saleRtnSummaryList: any = [];
  reportType: any;





  getUsers() {
    this.global.getUserList().subscribe((data: any) => { this.userList = data; });
  }


  getParty() {
    this.global.getCustomerList().subscribe((data: any) => {
      if (data.length > 0) {
        this.partyList = data.map((e: any, index: any) => {
          (e.indexNo = index + 1);
          return e;
        });
        this.partyList.sort((a: any, b: any) => b.indexNo - a.indexNo);
      }
    });


  }

  onPartySelected() {
    this.partyName = this.partyList.find((e: any) => e.partyID == this.partyID).partyName;
    var index = this.partyList.findIndex((e: any) => e.partyID == this.partyID);
    this.partyList[index].indexNo = this.partyList[0].indexNo + 1;
    this.partyList.sort((a: any, b: any) => b.indexNo - a.indexNo);

  }




  onUserSelected() {
    var curUser = this.userList.find((e: any) => e.userID == this.userID);
    this.userName = curUser.userName;

  }


  saleGrandTotal = 0;
  saleBillTotal = 0;
  saleDiscountTotal = 0;

  saleRtnGrandTotal = 0;
  saleRtnBillTotal = 0;
  saleRtnDiscountTotal = 0;
  profitTotal = 0;

  ledgerDetailList: any = [];

  getReport(type: any) {

    // alert(this.recipeCatID);

    if (this.partyID == 0 || this.partyID == undefined) {
      this.msg.WarnNotify('Select Customer')
    } else {

      this.partyName = this.partyList.find((e: any) => e.partyID == this.partyID).partyName;

      this.app.startLoaderDark();
      if (this.formateType == 2) {

        this.reportType = 'Sale Detail';
        this.http.get(environment.mainApi + this.global.inventoryLink + 'GetSaleDetailCustomerDateWise?reqUID=' + this.userID + '&FromDate=' +
          this.global.dateFormater(this.fromDate, '-') + '&todate=' + this.global.dateFormater(this.toDate, '-') + '&fromtime=' + this.fromTime + '&totime=' + this.toTime + '&PartyID=' + this.partyID).subscribe(
            (Response: any) => {
              this.DetailList = [];

              this.saleGrandTotal = 0;
              this.profitTotal = 0;
              if (Response.length == 0 || Response == null) {
                this.global.popupAlert('Data Not Found!');
                this.app.stopLoaderDark();
                return;

              }
              this.DetailList = Response;

              Response.forEach((e: any) => {
                if (e.invType == 'S') {
                  this.saleGrandTotal += (e.salePrice * e.quantity) - (e.discInR * e.quantity);
                  this.profitTotal += ((e.salePrice * e.quantity) - (e.discInR * e.quantity)) - (e.avgCostPrice * e.quantity);
                }

                if (e.invType == 'SR') {
                  this.saleGrandTotal -= (e.salePrice * e.quantity) - (e.discInR * e.quantity);
                  this.profitTotal -= ((e.salePrice * e.quantity) - (e.discInR * e.quantity)) - (e.avgCostPrice * e.quantity);
                }

              });
              this.app.stopLoaderDark();
            }
          )
      }

      if (this.formateType == 1) {

        this.reportType = 'Sale Summary';
        this.http.get(environment.mainApi + this.global.inventoryLink + 'GetSaleSummaryCustomerDateWise?reqUID=' + this.userID + '&FromDate=' +
          this.global.dateFormater(this.fromDate, '-') + '&todate=' + this.global.dateFormater(this.toDate, '-') + '&fromtime=' + this.fromTime + '&totime=' + this.toTime + '&PartyID=' + this.partyID).subscribe(
            (Response: any) => {
              this.saleSummaryList = [];
              this.saleRtnSummaryList = [];
              this.saleGrandTotal = 0;
              this.saleBillTotal = 0;
              this.saleDiscountTotal = 0;
              this.saleRtnGrandTotal = 0;
              this.saleRtnBillTotal = 0;
              this.saleRtnDiscountTotal = 0;
              if (Response.length == 0 || Response == null) {
                this.global.popupAlert('Data Not Found!');
                this.app.stopLoaderDark();
                return;

              }
              this.saleSummaryList = Response.filter((e: any) => e.invType == 'S');
              this.saleRtnSummaryList = Response.filter((e: any) => e.invType == 'SR');

              Response.forEach((e: any) => {
                if (e.invType == 'S') {
                  this.saleGrandTotal += e.total - e.billDiscount;
                  this.saleBillTotal += e.total;
                  this.saleDiscountTotal += e.billDiscount;
                }
                if (e.invType == 'SR') {
                  this.saleRtnGrandTotal += e.total - e.billDiscount;
                  this.saleRtnBillTotal += e.total;
                  this.saleRtnDiscountTotal += e.billDiscount;
                }

              });
              this.app.stopLoaderDark();

            }
          )
      }


      if (this.formateType == 3) {

        this.reportType = ' Ledger';
        this.http.get(environment.mainApi + this.global.inventoryLink + 'GetLedgerRpt_11?FromDate=' +
          this.global.dateFormater(this.fromDate, '-') + '&todate=' + this.global.dateFormater(this.toDate, '-') + '&fromtime=' + this.fromTime + '&totime=' + this.toTime + '&PartyID=' + this.partyID).subscribe(
            (Response: any) => {
              this.ledgerDetailList = [];
              if (Response.length == 0 || Response == null) {
                this.global.popupAlert('Data Not Found!');
                this.app.stopLoaderDark();
                return;

              }
              this.ledgerDetailList = Response.map((e: any) => {
                if (e.billDetail != '-') {
                  (e.billDetailList = JSON.parse(e.billDetail));

                }
                (e.invoiceDate = new Date(e.invoiceDate))
                return e;
              })
              this.app.stopLoaderDark();
            }
          )
      }


    }




  }


  sortTable() {
    this.ledgerDetailList.sort((a: any, b: any) => a.invoiceDate - b.invoiceDate)
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

  printBill(item: any) {

    if (item.invType == 'S' || item.invType == 'SR') {
      this.billPrint.PrintBill(item.invBillNo);
      this.billPrint.billType = 'Duplicate';

    }
  }



  reset() {
    this.DetailList = [];
    this.saleSummaryList = [];
    this.saleBillTotal = 0;
    this.saleDiscountTotal = 0;
    this.saleGrandTotal = 0;
    this.saleRtnBillTotal = 0;
    this.saleRtnDiscountTotal = 0;
    this.saleRtnGrandTotal = 0;
    this.saleGrandTotal = 0;
    this.profitTotal = 0;
  }



  export() {

    if (this.formateType == 2 && this.DetailList.length == 0) return;
    if (this.formateType == 1 && this.saleSummaryList.length == 0) return;
    if (this.formateType == 3 && this.ledgerDetailList.length == 0) return;
    var partyName = this.partyList.filter((e: any) => e.partyID === this.partyID)[0].partyName;
    var startDate = this.datePipe.transform(this.fromDate, 'dd/MM/yyyy');
    var endDate = this.datePipe.transform(this.toDate, 'dd/MM/yyyy');
    var tableID = '';

    if (this.formateType == 1) tableID = 'summaryTable';
    if (this.formateType == 2) tableID = 'detailTable';
    if (this.formateType == 3) tableID = 'ledger';

    this.global.ExportHTMLTabletoExcel(tableID,
      `Sale Report(${partyName}) (${startDate} - ${endDate})`)
  }

}
