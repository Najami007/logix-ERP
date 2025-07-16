import { Component, OnInit, ViewChild } from '@angular/core';
import { SaleBillPrintComponent } from '../../Sale/SaleComFiles/sale-bill-print/sale-bill-print.component';
import { PurchaseBillPrintComponent } from '../../Purchases/purchase-bill-print/purchase-bill-print.component';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-product-in-out-history',
  templateUrl: './product-in-out-history.component.html',
  styleUrls: ['./product-in-out-history.component.scss']
})
export class ProductInOutHistoryComponent implements OnInit {

  @ViewChild(SaleBillPrintComponent) salebillPrint: any;
  @ViewChild(PurchaseBillPrintComponent) purchaseBillPrint: any;

  companyProfile: any = [];
  crudList: any = { c: true, r: true, u: true, d: true };
  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    private global: GlobalDataModule,
    private route: Router,
    private datePipe: DatePipe

  ) {

    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
    });

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })

    this.getProduct();
  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Product In Out History');
    this.getUsers();
    this.getReportTypes();

  }


  getProduct() {
    this.global.getProducts().subscribe(
      (Response: any) => {
        if (Response.length > 0) {
          this.productList = Response.map((e: any, index: any) => {
            (e.indexNo = index + 1);
            return e;
          });

          this.productList.sort((a: any, b: any) => b.indexNo - a.indexNo);
        }
      }
    )
  }



  onProdSelected() {
    var index = this.productList.findIndex((e: any) => e.productID == this.productID);
    this.productList[index].indexNo = this.productList[0].indexNo + 1;
    this.productList.sort((a: any, b: any) => b.indexNo - a.indexNo);
  }


  reportsList: any = []


  getReportTypes() {
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetInvoiceTypes_15').subscribe(
      (Response: any) => {
        this.reportsList = Response;
      }
    )
  }


  rptType: any = 'S';



  productList: any = [];
  productID = 0;


  userList: any = [];
  userID = 0;
  userName = '';

  fromDate: Date = new Date();
  fromTime: any = '00:00';
  toDate: Date = new Date();
  toTime: any = '23:59';

  invDetailList: any = [];

  reportType: any;


  getUsers() {
    this.global.getUserList().subscribe((data: any) => { this.userList = data; });
  }

  onUserSelected() {
    var curUser = this.userList.find((e: any) => e.userID == this.userID);
    this.userName = curUser.userName;
  }


  stockInTotal = 0;
  stockOUtTotal = 0;
  stockInAmountTotal = 0;
  stockOutAmountTotal = 0;
  saleTotal = 0;
  costTotal = 0;

  getReport(type: any) {

    if (this.productID == 0 || this.productID == undefined) {
      this.msg.WarnNotify('Select Product');
      return;
    }

    var startDate = this.global.dateFormater(this.fromDate, '');
    var toDate = this.global.dateFormater(this.toDate, '');
    var url = `GetSingleProductLedger_16?reqPID=${this.productID}&reqUID=${this.userID}
    &FromDate=${startDate}&ToDate=${toDate}&FromTime=${this.fromTime}&ToTime=${this.toTime}`

    this.app.startLoaderDark();
    this.http.get(environment.mainApi + this.global.inventoryLink + url).subscribe(
      (Response: any) => {
        this.invDetailList = [];
        this.stockInTotal = 0;
        this.stockOUtTotal = 0;
        this.stockInAmountTotal = 0;
        this.stockOutAmountTotal = 0;

        this.saleTotal = 0;
        this.costTotal = 0;
        if (Response.length == 0 || Response == null) {
          this.global.popupAlert('Data Not Found!');
          this.app.stopLoaderDark();
          return;

        }

        var tmpQty = 0;
        this.invDetailList = Response;
        this.invDetailList.forEach((e: any) => {
          if (e.totalIn !== 0 || e.totalOut !== 0) {
            tmpQty = e.totalIn - e.totalOut;
            e.balanceQty = e.totalIn - e.totalOut;
          }
          if (e.invSubType == 'OUT') {
            e.balanceQty = tmpQty - e.quantity;
            this.stockOUtTotal += e.quantity;
            if (e.invType == 'S') {
              this.stockOutAmountTotal += (e.salePrice * e.quantity);
            }
            if (e.invType == 'PR' || e.invType == 'AO') {
              this.stockOutAmountTotal += (e.avgCostPrice * e.quantity);
            }


            tmpQty = e.balanceQty;
          } else if (e.invSubType == 'IN') {

            e.balanceQty = tmpQty + e.quantity;
            this.stockInTotal += e.quantity;

            if ((e.invType == 'P' || e.invType == 'AI')) {
              this.stockInAmountTotal += (e.avgCostPrice * e.quantity);
            }
            if (e.invType == 'SR') {
              this.stockInAmountTotal += (e.salePrice * e.quantity);
            }

            tmpQty = e.balanceQty;
          }


        });
        console.log(this.invDetailList);
        this.app.stopLoaderDark();

      },
      (Error: any) => {
        this.app.stopLoaderDark();
        this.msg.WarnNotify('Unable to Connect to Data')
      }
    )




  }

  print() {
    this.global.printData('#PrintDiv')
  }

  printBill(item: any) {

    if (item.invType == 'S' || item.invType == 'SR') {
      this.salebillPrint.PrintBill(item.invBillNo);
      this.salebillPrint.billType = 'Duplicate';
    }

    if (item.invType == 'P' || item.invType == 'PR') {
      this.purchaseBillPrint.printBill(item);
    }
  }



  export() {
    var type = this.reportsList.find((e: any) => e.invType == this.rptType).invTypeTitle;
    var startDate = this.datePipe.transform(this.fromDate, 'dd/MM/yyyy');
    var endDate = this.datePipe.transform(this.toDate, 'dd/MM/yyyy');
    this.global.ExportHTMLTabletoExcel('PrintDiv', `Prod In Out History(${startDate} - ${endDate}`)
  }


}
