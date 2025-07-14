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
  selector: 'app-sale-report-prod-customerwise',
  templateUrl: './sale-report-prod-customerwise.component.html',
  styleUrls: ['./sale-report-prod-customerwise.component.scss']
})
export class SaleReportProdCustomerwiseComponent implements OnInit {

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
    this.global.setHeaderTitle('Sale History Prod & Customer wise');
    this.getUsers();
    this.getCustomer();
    this.getProduct()

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


  partyList: any = [];
  partyID = 0;
  productList: any = [];
  productID = 0;
  userList: any = [];
  userID = 0;
  userName = '';
  partyName = '';

  fromDate: Date = new Date();
  fromTime: any = '00:00';
  toDate: Date = new Date();
  toTime: any = '23:59';

  DetailList: any = [];
  summaryList: any = [];
  reportType: any;





  getUsers() {
    this.global.getUserList().subscribe((data: any) => { this.userList = data; });
  }

  getCustomer() {

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


  grandTotal = 0;
  profitTotal = 0;


  getReport(type: any) {

    // alert(this.recipeCatID);

    if (this.partyID == 0 || this.partyID == undefined) {
      this.msg.WarnNotify('Select Customer')
    } else if (this.productID == 0 || this.productID == undefined) {
      this.msg.WarnNotify('Select Product')
    }
    else {



      this.reportType = 'Detail';
      this.http.get(environment.mainApi + this.global.inventoryLink + 'GetSaleDetailCustomerAndProductDateWise?reqUID=' + this.userID +
        '&FromDate=' + this.global.dateFormater(this.fromDate, '-') + '&todate=' + this.global.dateFormater(this.toDate, '-') +
        '&fromtime=' + this.fromTime + '&totime=' + this.toTime + '&PartyID=' + this.partyID + '&ProductID=' + this.productID).subscribe(
          (Response: any) => {
            this.DetailList = [];
            this.grandTotal = 0;
            this.profitTotal = 0;
            if (Response.length == 0 || Response == null) {
              this.global.popupAlert('Data Not Found!');
              this.app.stopLoaderDark();
              return;

            }
            this.DetailList = Response;

            Response.forEach((e: any) => {
              if (e.invType == 'S') {
                this.grandTotal += (e.salePrice * e.quantity) - (e.discInR * e.quantity);
                this.profitTotal += ((e.salePrice * e.quantity) - (e.discInR * e.quantity)) - (e.avgCostPrice * e.quantity);
              }

              if (e.invType == 'SR') {
                this.grandTotal -= (e.salePrice * e.quantity) - (e.discInR * e.quantity);
                this.profitTotal -= ((e.salePrice * e.quantity) - (e.discInR * e.quantity)) - (e.avgCostPrice * e.quantity);
              }

            });

          }
        )





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

  printBill(item: any) {

    if (item.invType == 'S' || item.invType == 'SR') {
      this.billPrint.PrintBill(item.invBillNo);
      this.billPrint.billType = 'Duplicate';

    }
  }



  export() {

    if (this.DetailList.length > 0) {
      var startDate = this.datePipe.transform(this.fromDate, 'dd/MM/yyyy');
      var endDate = this.datePipe.transform(this.toDate, 'dd/MM/yyyy');
      this.global.ExportHTMLTabletoExcel(`detailTable`, `Sale History Prod & Customer (${startDate} - ${endDate})`)
    }

  }


}
