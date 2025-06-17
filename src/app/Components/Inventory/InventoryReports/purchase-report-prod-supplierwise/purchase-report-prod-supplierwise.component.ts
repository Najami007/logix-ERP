import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Time } from 'highcharts';
import { SaleBillDetailComponent } from 'src/app/Components/Restaurant-Core/Sales/sale1/sale-bill-detail/sale-bill-detail.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
@Component({
  selector: 'app-purchase-report-prod-supplierwise',
  templateUrl: './purchase-report-prod-supplierwise.component.html',
  styleUrls: ['./purchase-report-prod-supplierwise.component.scss']
})
export class PurchaseReportProdSupplierwiseComponent implements OnInit {



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
    this.global.setHeaderTitle('Purchase Report(Prod & Supplierwise)');
    this.getUsers();
    this.getSupplier();
    this.getProduct();

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



  supplierList: any = [];
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

  getSupplier() {
    this.global.getSupplierList().subscribe((data: any) => {
      if (data.length > 0) {
        this.supplierList = data.map((e: any, index: any) => {
          (e.indexNo = index + 1);
          return e;
        });
        this.supplierList.sort((a: any, b: any) => b.indexNo - a.indexNo);
      }
    });

  }


  onSupplierSelected() {
    this.partyName = this.supplierList.find((e: any) => e.partyID == this.partyID).partyName;
    var index = this.supplierList.findIndex((e: any) => e.partyID == this.partyID);
    this.supplierList[index].indexNo = this.supplierList[0].indexNo + 1;
    this.supplierList.sort((a: any, b: any) => b.indexNo - a.indexNo);

  }


  onUserSelected() {
    var curUser = this.userList.find((e: any) => e.userID == this.userID);
    this.userName = curUser.userName;
  }


  grandTotal = 0;


  getReport(type: any) {

    // alert(this.recipeCatID);

    if (this.partyID == 0 || this.partyID == undefined) {
      this.msg.WarnNotify('Select Supplier')
    } else if (this.productID == 0 || this.productID == undefined) {
      this.msg.WarnNotify('Select Product')
    }
    else {


      this.app.startLoaderDark();
      this.reportType = 'Detail';
      this.http.get(environment.mainApi + this.global.inventoryLink + 'GetPurchaseRptProductAndSupplierWise_6?reqUserID=' + this.userID + '&reqPartyID=' + this.partyID +
        '&reqProductID=' + this.productID + '&FromDate=' + this.global.dateFormater(this.fromDate, '-') + '&todate=' + this.global.dateFormater(this.toDate, '-') + '&fromtime=' + this.fromTime + '&totime=' + this.toTime).subscribe(
          (Response: any) => {
             if (Response.length == 0 || Response == null) {
              this.global.popupAlert('Data Not Found!');
                this.app.stopLoaderDark();
              return;
              
            }
            this.DetailList = Response;
            this.grandTotal = 0;
            Response.forEach((e: any) => {
              if (e.invType == 'P') {
                this.grandTotal += e.costPrice * e.quantity;
              }

              if (e.invType == 'PR') {
                this.grandTotal -= e.costPrice * e.quantity;
              }

            });

            this.app.stopLoaderDark();

          },
          (Error: any) => {
            this.app.stopLoaderDark();
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


}


