import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Time } from 'highcharts';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { SaleBillPrintComponent } from '../../Sale/SaleComFiles/sale-bill-print/sale-bill-print.component';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-sale-purchase-rptcatwise',
  templateUrl: './sale-purchase-rptcatwise.component.html',
  styleUrls: ['./sale-purchase-rptcatwise.component.scss']
})
export class SalePurchaseRptcatwiseComponent implements OnInit {

  @ViewChild(SaleBillPrintComponent) billPrint: any;


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
  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Sale Purchase History Category wise');
    this.getUsers();
    this.getReportTypes();
    this.getCategory();
    this.getBrandList();
    $('#detailTable').show();
    $('#summaryTable').hide();
  }



  reportsList: any = []

  getReportTypes() {
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetInvoiceTypes_15').subscribe(
      (Response: any) => {
        this.reportsList = Response;
      }
    )
  }


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
  CategoriesList: any = [];
  SubCategoriesList: any = [];
  SubCategoryID = 0;
  CategoryID = 0;
  getSubCategory() {
    this.SubCategoryID = 0;
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetSubCategory').subscribe(
      (Response: any) => {
        this.SubCategoriesList = Response.filter((e: any) => e.categoryID == this.CategoryID);
      }
    )
  }




  getCategory() {
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetCategory').subscribe(
      (Response: any) => {
        this.CategoriesList = Response;
      }
    )
  }

  BrandList: any = [];
  BrandID = 0;
  getBrandList() {
    this.global.getBrandList().subscribe((data: any) => { this.BrandList = data; });
  }


  onUserSelected() {
    var curUser = this.userList.find((e: any) => e.userID == this.userID);
    this.userName = curUser.userName;
  }

formateType =1;

  qtyTotal = 0;
  detNetTotal = 0;
  profitTotal = 0;
  profitPercentTotal = 0;

  summaryNetTotal = 0;
  catType = 'cat';

  getReport(type: any) {

    this.reportType = this.reportsList.find((e: any) => e.invType == this.tmpRptType).invTypeTitle;


    this.rptType = this.tmpRptType;

    if (this.catType == 'cat' && this.CategoryID == 0) {
      this.msg.WarnNotify("Select Category")
    } else if (this.catType == 'subcat' && this.SubCategoryID == 0) {
      this.msg.WarnNotify('Select SubCategory')
    } else if (this.catType == 'brand' && this.BrandID == 0) {
      this.msg.WarnNotify('Select Brand');
    } else {
      if (this.catType == 'brand') {
        this.CategoryID = this.BrandID;
      }


      this.app.startLoaderDark();

      if (this.formateType == 1) {
  
        // this.reportType = 'Summary';
        this.http.get(environment.mainApi + this.global.inventoryLink + 'GetCatWiseSummaryDateWise?reqType=' + this.rptType + '&catType=' + this.catType +
          '&catID=' + this.CategoryID + '&subCatID=' + this.SubCategoryID + '&reqUserID=' + this.userID + '&FromDate=' +
          this.global.dateFormater(this.fromDate, '-') + '&todate=' + this.global.dateFormater(this.toDate, '-') + '&fromtime=' + this.fromTime + '&totime=' + this.toTime).subscribe(
            (Response: any) => {
              this.SaleDetailList = [];
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


                this.summaryNetTotal += e.total;

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
        this.http.get(environment.mainApi + this.global.inventoryLink + 'GetCatWiseDetailDateWise?reqType=' + this.rptType + '&catType=' + this.catType +
          '&catID=' + this.CategoryID + '&subCatID=' + this.SubCategoryID + '&reqUserID=' + this.userID + '&FromDate=' +
          this.global.dateFormater(this.fromDate, '-') + '&todate=' + this.global.dateFormater(this.toDate, '-') + '&fromtime=' + this.fromTime + '&totime=' + this.toTime).subscribe(
            (Response: any) => {
              console.log(Response);
              this.SaleDetailList = [];
              this.qtyTotal = 0;
              this.detNetTotal = 0;
              this.profitPercentTotal = 0;
              this.profitTotal = 0;
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
                if (this.rptType == 'S' || this.rptType == 'SR' || this.rptType == 'IC'  || this.rptType == 'RIC' ) {
                  this.detNetTotal += (e.salePrice - e.discInR)  * e.quantity;
                  this.profitTotal += ((e.salePrice - e.discInR) * e.quantity) - (e.avgCostPrice * e.quantity);
                  // this.profitPercentTotal += (((e.salePrice * e.quantity) - (e.avgCostPrice * e.quantity)) / (e.salePrice * e.quantity));
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


  }




  print() {
    this.global.printData('#PrintDiv')
  }

  printBill(item: any) {

    if (item.invType == 'S' || item.invType == 'SR') {
      this.billPrint.PrintBill(item.invBillNo);
      this.billPrint.billType = 'Duplicate';

    }
  }


  export() {
    if(this.SaleDetailList.length == 0){
      return;
    }
    var type = this.reportsList.find((e: any) => e.invType == this.rptType).invTypeTitle;
    var startDate = this.datePipe.transform(this.fromDate, 'dd/MM/yyyy');
    var endDate = this.datePipe.transform(this.toDate, 'dd/MM/yyyy');
    this.global.ExportHTMLTabletoExcel(`${this.formateType == 1 ? 'summaryTable' : 'detailTable'}`, `Sale Purchase History Categorywise( ${type}(${startDate} - ${endDate})`) 
  }


  reset(){
    this.SaleDetailList = [];
    this.summaryNetTotal = 0;
    this.detNetTotal = 0;
    this.profitTotal= 0;

  }

}
