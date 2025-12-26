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

  ProjectwiseFeature = this.global.ProjectwiseFeature;

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
    this.getProducts();
    this.getProject();
    this.getMenuItemList();
    setTimeout(() => {
      $('#detailTable').hide();
      $('#summaryTable').hide();
    }, 200);
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


  projectTitle: any = '';
  projectID: any = this.global.getProjectID();
  projectList: any = [];
  getProject() {
    this.http.get(environment.mainApi + 'cmp/getproject').subscribe(
      (Response: any) => {
        this.projectList = Response;
      }
    )
  }


  MenuItemList: any = '';
  mnuItemID: any = 0;

  getMenuItemList() {

    this.http.get(this.apiReq + 'GetAllMnuItems').subscribe(
      {
        next: (Response: any) => {
          this.MenuItemList = Response;
        },
        error: error => {
          console.log(error);
        }
      }
    )

  }

  tempRecipeTitle: any = [];
  OnRecipeSelected() {
    this.tempRecipeTitle = this.MenuItemList.find((e: any) => e.mnuItemID == this.mnuItemID).mnuItemTitle;
    var index = this.MenuItemList.findIndex((e: any) => e.mnuItemID == this.mnuItemID);
    this.MenuItemList[index].indexNo = this.MenuItemList[0].indexNo + 1;
    this.MenuItemList.sort((a: any, b: any) => b.indexNo - a.indexNo);
  }

  productList: any = [];
  getProducts() {
    this.global.getProducts().subscribe(
      (data: any) => {
        this.productList = data;
      });
  }


  onProdSelected() {
    var index = this.productList.findIndex((e: any) => e.productID == this.productID);
    this.productList[index].indexNo = this.productList[0].indexNo + 1;
    this.productList.sort((a: any, b: any) => b.indexNo - a.indexNo);
  }


  DataList: any = [];

  billTotal = 0;
  billDiscountTotal = 0;
  netTotal = 0;

  getReport() {
    this.reset();
    $('#detailTable').hide();
    $('#summaryTable').show();

    var userID = this.userID;
    var fromDate = this.global.dateFormater(this.fromDate, '');
    var fromTime = this.fromTime;
    var toDate = this.global.dateFormater(this.toDate, '');
    var toTime = this.toTime;
    var projectID = this.projectID;

    this.projectTitle = '';
    if (projectID > 0) {
      this.projectTitle = this.projectList.filter((e: any) => e.projectID == this.projectID)[0].projectTitle;
    }


    var url = `${this.apiReq}GetConsumptionRptDateWise?reqUID=${userID}&FromDate=${fromDate}
      &ToDate=${toDate}&FromTime=${fromTime}&ToTime=${toTime}&projectID=${projectID}`

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


  qtyTotal: any = 0;
  amountTotal: any = 0;
  productID: any = 0;
  getIngredientwise() {
     this.reset();
    $('#detailTable').show();
    $('#summaryTable').hide();
    if (this.productID == 0 || this.productID == undefined) {
      this.msg.WarnNotify('Select Product');
     
      return;
    }

    var userID = this.userID;
    var fromDate = this.global.dateFormater(this.fromDate, '');
    var fromTime = this.fromTime;
    var toDate = this.global.dateFormater(this.toDate, '');
    var toTime = this.toTime;
    var productID = this.productID;
    var projectID = this.projectID;

    this.projectTitle = '';
    if (projectID > 0) {
      this.projectTitle = this.projectList.filter((e: any) => e.projectID == this.projectID)[0].projectTitle;
    }

    var url = `${this.apiReq}GetConsumptionRptProductAndDateWise?reqUID=${userID}&FromDate=${fromDate}
      &ToDate=${toDate}&fromtime=${fromTime}&totime=${toTime}&ProductID=${productID}&projectID=${projectID}`

    this.DataList = [];
    this.qtyTotal = 0;
    this.amountTotal = 0;
    this.app.startLoaderDark();
    this.http.get(url).subscribe(
      (Response: any) => {
        if (Response.length == 0 || Response == null) {
          this.global.popupAlert('Data Not Found!');
          this.app.stopLoaderDark();
          return;

        }
        this.DataList = Response;
        if (Response.length > 0) {
          this.qtyTotal = 0;
          this.amountTotal = 0;
          Response.forEach((e: any) => {
            this.qtyTotal += e.quantity;
            this.amountTotal += e.avgCostPriceTotal;

          });
        }


        this.app.stopLoaderDark();


      },
      (error: any) => {
        console.log(error);
        this.app.stopLoaderDark();
      }
    )



  }




  getMnuItemwise() {
     this.reset();
    $('#detailTable').show();
    $('#summaryTable').hide();
    if (this.mnuItemID == 0 || this.mnuItemID == undefined) {
      this.msg.WarnNotify('Select Item');
      return;
    }


    var userID = this.userID;
    var fromDate = this.global.dateFormater(this.fromDate, '');
    var fromTime = this.fromTime;
    var toDate = this.global.dateFormater(this.toDate, '');
    var toTime = this.toTime;
    var mnuItemID = this.mnuItemID;
    var projectID = this.projectID;

    this.projectTitle = '';
    if (projectID > 0) {
      this.projectTitle = this.projectList.filter((e: any) => e.projectID == this.projectID)[0].projectTitle;
    }

    var url = `${this.apiReq}GetConsumptionRptMnuItemAndDateWise?reqUID=${userID}&FromDate=${fromDate}&ToDate=${toDate}
      &fromtime=${fromTime}&totime=${toTime}&MnuItemID=${mnuItemID}&projectID=${projectID}`

    this.DataList = [];
    this.qtyTotal = 0;
    this.amountTotal = 0;
    this.app.startLoaderDark();
    this.http.get(url).subscribe(
      (Response: any) => {
        this.DataList = [];
        this.qtyTotal = 0;
        this.amountTotal = 0;
        if (Response.length == 0 || Response == null) {
          this.global.popupAlert('Data Not Found!');
          this.app.stopLoaderDark();
          return;

        }
        this.DataList = Response;
        if (Response.length > 0) {
          Response.forEach((e: any) => {
            this.qtyTotal += e.quantity;
            this.amountTotal += e.avgCostPriceTotal;
          });
        }

        this.app.stopLoaderDark();



      },
      (error: any) => {
        console.log(error);
        this.app.stopLoaderDark();


      }
    )



  }



  print() {
    this.global.printData('#PrintDiv')
  }

  export() {

    var startDate = this.datePipe.transform(this.fromDate, 'dd/MM/yyyy');
    var endDate = this.datePipe.transform(this.toDate, 'dd/MM/yyyy');


    this.global.ExportHTMLTabletoExcel('printContainer', `Consumption Report ${startDate} - ${endDate}`);
  }

  reset() {
    this.billTotal = 0;
    this.billDiscountTotal = 0;
    this.netTotal = 0;
    this.qtyTotal = 0;
    this.amountTotal = 0;

    this.DataList = [];
  }

}
