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
  selector: 'app-sale-summary-categorywise',
  templateUrl: './sale-summary-categorywise.component.html',
  styleUrls: ['./sale-summary-categorywise.component.scss']
})
export class SaleSummaryCategorywiseComponent implements OnInit {

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
    this.global.setHeaderTitle('Sale Summary Report');

    this.getCategory();
    this.getBrandList();

  }




  fromDate: Date = new Date();
  fromTime: any = '00:00';
  toDate: Date = new Date();
  toTime: any = '23:59';

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



  catType = 'Cat';
  netCostTotal = 0;
  netSaleTotal = 0;
  getReport(type: any) {

    var fromDate = this.global.dateFormater(this.fromDate, '-');
    var toDate = this.global.dateFormater(this.toDate, '-')
    var fromTime = this.fromTime;
    var toTime = this.toTime;

      this.app.startLoaderDark();

      var url = `${environment.mainApi + this.global.inventoryLink}GetSaleSummaryCatWise?reqType=${this.catType}&FromDate=${fromDate}&ToDate=${toDate}&FromTime=${fromTime}&ToTime=${toTime}`
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

            this.DataList = Response;
            Response.forEach((e:any)=>{
              this.netCostTotal += e.costTotal;
               this.netSaleTotal += e.saleTotal;
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
    this.global.ExportHTMLTabletoExcel(`${'summaryTable'}`, `Purchase Summary((${startDate} - ${endDate})`)
  }


  reset() {
    this.DataList = [];
    this.netCostTotal = 0;
    this.netSaleTotal = 0;
  }

}


