import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { SaleBillPrintComponent } from '../../Sale/SaleComFiles/sale-bill-print/sale-bill-print.component';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { PurchaseBillPrintComponent } from '../../Purchases/purchase-bill-print/purchase-bill-print.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sale-purchase-rptdatewise',
  templateUrl: './sale-purchase-rptdatewise.component.html',
  styleUrls: ['./sale-purchase-rptdatewise.component.scss']
})
export class SalePurchaseRptdatewiseComponent implements OnInit {

  @ViewChild(SaleBillPrintComponent) saleBill: any;
  @ViewChild(PurchaseBillPrintComponent) purchaseBill: any;
  FBRFeature = this.global.FBRFeature;
  DiscFeature = this.global.discFeature;


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
    this.global.setHeaderTitle('Stock In Out Date wise');
    this.getUsers();
    this.getReportTypes();

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
    this.global.getUserList().subscribe((data: any) => { this.userList = data; });
  }


  getReportTypes() {
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetInvoiceTypes_15').subscribe(
      (Response: any) => {
        this.reportsList = Response;
      }
    )
  }



  onUserSelected() {
    var curUser = this.userList.find((e: any) => e.userID == this.userID);
    this.userName = curUser.userName;
  }

  billTotal = 0;
  chargesTotal = 0;
  netGrandTotal = 0;

  qtyTotal = 0;
  detNetTotal = 0;
  profitTotal = 0;
  profitPercentTotal = 0;
  discountTotal = 0;
  offerDiscTotal = 0;
  summaryNetTotal = 0;
  myTaxTotal = 0;
  costPriceTotal = 0;
  salePriceTotal = 0;
  avgCostTotal = 0;

  getReport(type: any) {

    this.reportType = this.reportsList.find((e: any) => e.invType == this.tmpRptType).invTypeTitle;

    if (type == 'taxSummary' && (this.rptType != 'S')) {
      this.msg.WarnNotify('Tax Is Only For Sales')
      return;
    }

    this.app.startLoaderDark();
    this.rptType = this.tmpRptType;
    if (this.formateType == 1) {
      // this.reportType = 'Summary';
      this.http.get(environment.mainApi + this.global.inventoryLink + 'GetInventorySummaryDateWise_2?reqType=' + this.rptType + '&reqUserID=' + this.userID + '&FromDate=' +
        this.global.dateFormater(this.fromDate, '-') + '&todate=' + this.global.dateFormater(this.toDate, '-') + '&fromtime=' + this.fromTime + '&totime=' + this.toTime).subscribe(
          (Response: any) => {
            this.SaleDetailList = [];
            this.billTotal = 0;
            this.chargesTotal = 0;
            this.netGrandTotal = 0;
            this.discountTotal = 0;
            this.offerDiscTotal = 0;
            this.summaryNetTotal = 0;
            if (Response.length == 0 || Response == null) {
              this.global.popupAlert('Data Not Found!');
              this.app.stopLoaderDark();
              return;

            }


            if (this.rptType == 'R') {
              Response.forEach((e: any) => {
                if (e.issueType != 'Stock Transfer') {
                  this.SaleDetailList.push(e);
                }
              }

              )
              // this.SaleDetailList = Response.fil;
            } else {
              this.SaleDetailList = Response;
            }


            this.SaleDetailList.forEach((e: any) => {

              this.billTotal += e.billTotal;
              this.chargesTotal += e.otherCharges;
              this.netGrandTotal += e.billTotal + e.overHeadAmount;
              this.discountTotal += e.billDiscount - e.percentageDiscount;
              this.offerDiscTotal += e.percentageDiscount;
              this.summaryNetTotal += e.netTotal;

            });
            this.app.stopLoaderDark();
          },
          (Error: any) => {
            console.log(Error);
            this.app.stopLoaderDark();
          }
        )
    }
    if (this.formateType == 3) {
      // this.reportType = 'Summary';
      this.http.get(environment.mainApi + this.global.inventoryLink + 'GetInventorySummaryDateWise_2?reqType=' + this.rptType + '&reqUserID=' + this.userID + '&FromDate=' +
        this.global.dateFormater(this.fromDate, '-') + '&todate=' + this.global.dateFormater(this.toDate, '-') + '&fromtime=' + this.fromTime + '&totime=' + this.toTime).subscribe(
          (Response: any) => {
            this.SaleDetailList = [];
            this.billTotal = 0;
            this.chargesTotal = 0;
            this.netGrandTotal = 0;
            this.discountTotal = 0;
            this.offerDiscTotal = 0;
            this.summaryNetTotal = 0;
            this.myTaxTotal = 0;
            if (Response.length == 0 || Response == null) {
              this.global.popupAlert('Data Not Found!');
              this.app.stopLoaderDark();
              return;

            }


            if (this.rptType == 'R') {
              Response.forEach((e: any) => {
                if (e.issueType != 'Stock Transfer') {
                  this.SaleDetailList.push(e);
                }
              }

              )
              // this.SaleDetailList = Response.fil;
            } else {
              this.SaleDetailList = Response;
            }


            this.SaleDetailList.forEach((e: any) => {

              this.billTotal += e.billTotal;
              this.chargesTotal += e.otherCharges;
              this.discountTotal += e.billDiscount - e.percentageDiscount;
              this.offerDiscTotal += e.percentageDiscount;
              this.summaryNetTotal += e.netTotal;
              this.myTaxTotal += e.gstAmount;

            });
            this.app.stopLoaderDark();
          },
          (Error: any) => {
            console.log(Error);
            this.app.stopLoaderDark();
          }
        )
    }

    if (this.formateType == 2) {

      // this.reportType = 'Detail';
      this.http.get(environment.mainApi + this.global.inventoryLink + 'GetInventoryDetailDateWise_3?reqType=' + this.rptType + '&reqUserID=' + this.userID + '&FromDate=' +
        this.global.dateFormater(this.fromDate, '-') + '&todate=' + this.global.dateFormater(this.toDate, '-') + '&fromtime=' + this.fromTime + '&totime=' + this.toTime).subscribe(
          (Response: any) => {
            this.SaleDetailList = [];
            this.qtyTotal = 0;
            this.detNetTotal = 0;
            this.profitPercentTotal = 0;
            this.profitTotal = 0;
            this.discountTotal = 0;
            this.salePriceTotal = 0;
            this.costPriceTotal = 0;
            this.avgCostTotal = 0;
            if (Response.length == 0 || Response == null) {
              this.global.popupAlert('Data Not Found!');
              this.app.stopLoaderDark();
              return;

            }

            if (this.rptType == 'R') {
              Response.forEach((e: any) => {
                if (e.issueType != 'Stock Transfer') {
                  this.SaleDetailList.push(e);
                }
              }

              )
              // this.SaleDetailList = Response.fil;
            } else {
              this.SaleDetailList = Response;
            }


            this.SaleDetailList.forEach((e: any) => {
              this.qtyTotal += e.quantity;
              if (this.rptType == 'S' || this.rptType == 'SR') {
                this.detNetTotal += (e.salePrice - e.discInR) * e.quantity;
                this.profitTotal += ((e.salePrice - e.discInR) * e.quantity) - (e.avgCostPrice * e.quantity);
                this.discountTotal += e.discInR * e.quantity;
                this.salePriceTotal += e.quantity * e.salePrice;
                this.costPriceTotal += e.quantity * e.costPrice;
                this.avgCostTotal += e.quantity * e.avgCostPrice;
                //this.profitPercentTotal += ((e.salePrice - e.discInR) * e.quantity) - (e.avgCostPrice * e.quantity) / ;
              }
              else if (this.rptType == 'P' || this.rptType == 'PR') {
                this.detNetTotal += e.costPrice * e.quantity;
              }
              else {
                this.detNetTotal += e.avgCostPrice * e.quantity;
              }
            });
            this.app.stopLoaderDark();
          },
          (Error: any) => {
            console.log(Error);
            this.app.stopLoaderDark();
          }
        )
    }

  }




  print() {
    this.global.printData('#PrintDiv')
  }

  sendToFbr(item: any) {
    this.http.post(environment.mainApi + this.global.inventoryLink + 'InvSendToFbr', {
      InvBillNo: item.invBillNo,
      UserID: this.global.getUserID()
    }).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Updated Successfully') {
          this.msg.SuccessNotify(Response.msg);
          item.fbrStatus = true;

        } else {
          this.msg.WarnNotify(Response.msg);
        }
      }
    )
  }

  printBill(item: any) {

    if (item.invType == 'S' || item.invType == 'SR') {
      this.saleBill.PrintBill(item.invBillNo);

      this.saleBill.billType = 'Duplicate';

    }

    if (item.invType == 'P' || item.invType == 'PR') {
      this.purchaseBill.printBill(item);
    }

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


  reset(){

    this.SaleDetailList = [];
    this.netGrandTotal= 0;
    this.offerDiscTotal = 0;
    this.discountTotal = 0;
    this.summaryNetTotal = 0;
    this.myTaxTotal = 0;
    this.qtyTotal = 0;
    this.costPriceTotal = 0;
    this.avgCostTotal = 0;

    this.salePriceTotal = 0;
    this.detNetTotal = 0;


  }

}
