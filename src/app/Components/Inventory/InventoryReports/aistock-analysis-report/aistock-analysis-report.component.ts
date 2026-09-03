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
  selector: 'app-aistock-analysis-report',
  templateUrl: './aistock-analysis-report.component.html',
  styleUrls: ['./aistock-analysis-report.component.scss']
})
export class AIStockAnalysisReportComponent implements OnInit {

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
    this.global.setHeaderTitle('Purchase Summary Report');

    this.getCategory();
    this.getBrandList();

  }




  fromDate: Date = new Date();
  fromTime: any = '00:00';
  toDate: Date = new Date();
  toTime: any = '00:00';

  DataList: any = [];
  reportType: any;

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


  searchType = 'simple';
  catType = 'Cat';
  netCostTotal = 0;
  netSaleTotal = 0;


  purchaseTotal = 0;
  purchaseReturnTotal = 0;
  saleTotal = 0;
  saleReturnTotal = 0;
  adjustmentInTotal = 0;
  adjustmentOutTotal = 0;
  openingTotal = 0;
  closingTotal = 0;
  netTotalIn = 0;
  netTotalOut = 0;


  getReport(type: any) {

    var fromDate = this.global.dateFormater(this.fromDate, '-');
    var toDate = this.global.dateFormater(this.toDate, '-')
    var fromTime = this.fromTime;
    var toTime = this.toTime;
    var rptType = this.catType;
    var searchType = this.searchType;







    this.app.startLoaderDark();

    var url = `${environment.mainApi + this.global.inventoryLink}BrandWiseSummaryWithAI_24?FromDate=${fromDate}&ToDate=${toDate}&FromTime=${fromTime}&ToTime=${toTime}&rptFilter=${searchType}&rptType=${rptType}`
    console.log(url);
    this.http.get(url).subscribe(
      {
        next: (Response: any) => {
          this.DataList = [];
          this.reset();
          if (Response.length == 0 || Response == null) {
            this.global.popupAlert('Data Not Found!');
            this.app.stopLoaderDark();
            return;
          }
         // console.log(typeof(Response));
          this.DataList = Response;
          this.DataList.forEach((e: any) => {

            this.purchaseTotal += e.PurchaseAmount;
            this.purchaseReturnTotal += e.PurchaseReturnAmount;
            this.saleTotal += e.SaleAmount;
            this.saleReturnTotal += e.SaleReturnAmount;
            this.adjustmentInTotal += e.AdjustmentInAmount;
            this.adjustmentOutTotal += e.AdjustmentOutAmount;
            this.openingTotal += e.OpeningStockAmount;
            this.closingTotal += e.ClosingStockAmount;
            this.netTotalIn += e.PurchaseAmount + e.SaleReturnAmount + e.AdjustmentInAmount;
            this.netTotalOut +=  e.SaleAmount + e.PurchaseReturnAmount + e.AdjustmentOutAmount;


          })

          this.app.stopLoaderDark();

        },
        error: (error: any) => {
          console.log(error);
          this.app.stopLoaderDark();
        }
      }
    )




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


    var startDate = this.datePipe.transform(this.fromDate, 'dd/MM/yyyy');
    var endDate = this.datePipe.transform(this.toDate, 'dd/MM/yyyy');
    this.global.ExportHTMLTabletoExcel(`${'summaryTable'}`, `Inventory Analysis((${startDate} - ${endDate})`)
  }


  reset() {
    this.DataList = [];
    this.netCostTotal = 0;
    this.netSaleTotal = 0;
    this.purchaseTotal = 0;
    this.purchaseReturnTotal = 0;
    this.saleTotal = 0;
    this.saleReturnTotal = 0;
    this.adjustmentInTotal = 0;
    this.adjustmentOutTotal = 0;
    this.openingTotal = 0;
    this.closingTotal = 0;
    this.netTotalIn = 0;
    this.netTotalOut = 0;


  }

}


