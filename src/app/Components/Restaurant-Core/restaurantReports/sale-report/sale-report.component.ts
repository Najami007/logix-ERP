import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Time } from 'highcharts';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { SaleBillDetailComponent } from '../../Sales/sale1/sale-bill-detail/sale-bill-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { RestSaleBillPrintComponent } from '../../Sales/rest-sale-bill-print/rest-sale-bill-print.component';

@Component({
  selector: 'app-sale-report',
  templateUrl: './sale-report.component.html',
  styleUrls: ['./sale-report.component.scss']
})
export class SaleReportComponent implements OnInit {

  FBRFeature = this.global.FBRFeature;

  @ViewChild(RestSaleBillPrintComponent) billPrint:any;

  companyProfile: any = [];
  crudList: any = { c: true, r: true, u: true, d: true };

  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    private global: GlobalDataModule,
    private route: Router,
    private dialog: MatDialog,

  ) {


    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
    });

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })
  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Sale Report (Datewise)');
    this.getUsers();
    $('#detailTable').show();
    $('#summaryTable').hide();

  }




  userList: any = [];
  userID = 0;
  userName = '';

  startVal: any = '';
  endVal: any = '';
  fromDate: Date = new Date();
  fromTime: any = '00:00';
  toDate: Date = new Date();
  toTime: any = '23:59';

  saleSummaryList: any = [];
  SaleDetailList: any = [];
  tempSaleDetailList: any = [];
  qtySummaryList:any = []

  reportType: any;

  getUsers() {
    this.global.getUserList().subscribe((data: any) => { this.userList = data; });
  }

  filterRecipe(start: any, end: any, type: any) {
    if (this.SaleDetailList == ''){
      this.msg.WarnNotify('First Get Sale Detail')
    }else{
      this.app.startLoaderDark();
      if (type == 'perc') {
        this.SaleDetailList = this.tempSaleDetailList.filter((e: any) => ((e.avgCostPrice / e.salePrice) * 100) >= start &&
          ((e.avgCostPrice / e.salePrice) * 100) <= end)
      }

      if (type == 'cost') {
        this.SaleDetailList = this.tempSaleDetailList.filter((e: any) => e.avgCostPrice >= start && e.avgCostPrice <= end)
      }

      if (type == 'sale') {
        this.SaleDetailList = this.tempSaleDetailList.filter((e: any) => e.salePrice >= start && e.salePrice <= end)
      }

      this.qtyTotal = 0;
      this.detSaleTotal = 0;
      this.detCostTotal = 0;
      this.SaleDetailList.forEach((e: any) => {
        this.qtyTotal += e.quantity;
        this.detSaleTotal += e.salePrice * e.quantity;
        this.detCostTotal += e.avgCostPrice * e.quantity;
      });

      this.app.stopLoaderDark();
    }

    
  }


  onUserSelected() {
    var curUser = this.userList.find((e: any) => e.userID == this.userID);
    this.userName = curUser.userName;
  }

  billTotal = 0;
  chargesTotal = 0;
  netGrandTotal = 0;

  qtyTotal = 0;
  detSaleTotal = 0;
  detCostTotal = 0;
  discountTotal = 0;
  gstTotal = 0;

  getReport(type: any) {

    if (type == 'summary') {  
      $('#detailTable').hide();
      $('#TaxSummaryTable').hide();
      $('#summaryTable').show();
      $('#qsmtable').hide();
      this.reportType = 'Summary';
      this.app.startLoaderDark();
      this.http.get(environment.mainApi + this.global.inventoryLink + 'GetInventorySummaryDateWise_2?reqType=s&reqUserID=' + this.userID + '&FromDate=' +
        this.global.dateFormater(this.fromDate, '-') + '&todate=' + this.global.dateFormater(this.toDate, '-') + '&fromtime=' + this.fromTime + '&totime=' + this.toTime).subscribe(
          (Response: any) => {
            this.saleSummaryList = Response;
            this.billTotal = 0;
            this.chargesTotal = 0;
            this.netGrandTotal = 0;
            this.discountTotal = 0;
            Response.forEach((e: any) => {
              this.billTotal += e.billTotal;
              this.chargesTotal += e.otherCharges;
              this.discountTotal += e.billDiscount;
              this.netGrandTotal += e.netTotal;

            });
            this.app.stopLoaderDark();
          },
          (Error:any)=>{
            this.app.stopLoaderDark();
          }
        )
    }


    if (type == 'taxSummary') {
      $('#detailTable').hide();
      $('#TaxSummaryTable').show();
      $('#summaryTable').hide();
      $('#qsmtable').hide();
      this.reportType = 'Summary';
      this.app.startLoaderDark();
      this.http.get(environment.mainApi + this.global.inventoryLink + 'GetInventorySummaryDateWise_2?reqType=s&reqUserID=' + this.userID + '&FromDate=' +
        this.global.dateFormater(this.fromDate, '-') + '&todate=' + this.global.dateFormater(this.toDate, '-') + '&fromtime=' + this.fromTime + '&totime=' + this.toTime).subscribe(
          (Response: any) => {
            console.log(Response);
            this.saleSummaryList = Response;
            this.billTotal = 0;
            this.chargesTotal = 0;
            this.netGrandTotal = 0;
            this.discountTotal = 0;
            this.gstTotal = 0;
            Response.forEach((e: any) => {
              this.billTotal += e.billTotal;
              this.chargesTotal += e.otherCharges;
              this.discountTotal += e.billDiscount;
              this.netGrandTotal += e.netTotal;
              this.gstTotal  += e.gstAmount;

            });
            this.app.stopLoaderDark();
          },
          (Error:any)=>{
            this.app.stopLoaderDark();
          }
        )
    }
    if (type == 'detail') {
      $('#detailTable').show();
      $('#summaryTable').hide();
      $('#TaxSummaryTable').hide();
      $('#qsmtable').hide();
      this.reportType = 'Detail';
      this.app.startLoaderDark();
      this.http.get(environment.mainApi + this.global.inventoryLink + 'GetInventoryDetailDateWise_3?reqType=s&reqUserID=' + this.userID + '&FromDate=' +
        this.global.dateFormater(this.fromDate, '-') + '&todate=' + this.global.dateFormater(this.toDate, '-') + '&fromtime=' + this.fromTime + '&totime=' + this.toTime).subscribe(
          (Response: any) => {
            this.tempSaleDetailList = Response;
            this.SaleDetailList = Response;
            this.qtyTotal = 0;
            this.detSaleTotal = 0;
            this.detCostTotal = 0;
            Response.forEach((e: any) => {
              this.qtyTotal += e.quantity;
              this.detSaleTotal += e.salePrice * e.quantity;
              this.detCostTotal += e.avgCostPrice * e.quantity;
            });
            this.app.stopLoaderDark();
          },
          (Error:any)=>{
            this.app.stopLoaderDark();
          }
        )
    }

    
    if (type == 'qsm') {
      $('#detailTable').hide();
      $('#summaryTable').hide();
      $('#TaxSummaryTable').hide();
      $('#qsmtable').show();
      this.reportType = 'Detail';
      this.app.startLoaderDark();
      this.http.get(environment.mainApi + this.global.inventoryLink + 'GetInventoryDetailDateWise_3?reqType=s&reqUserID=' + this.userID + '&FromDate=' +
        this.global.dateFormater(this.fromDate, '-') + '&todate=' + this.global.dateFormater(this.toDate, '-') + '&fromtime=' + this.fromTime + '&totime=' + this.toTime).subscribe(
          (Response: any) => {
            this.qtySummaryList = [];
             this.filterUniqueValues(Response).forEach((e:any)=>{
              this.qtySummaryList.push({recipeID:e.recipeID, productTitle:e.productTitle,quantity:0,saleTotal:0})
            });
           
             setTimeout(() => {
              Response.forEach((e:any)=>{
             
                this.qtySummaryList.forEach((j:any) => {
                  if(e.recipeID == j.recipeID){
                
                    j.quantity += e.quantity;
                    j.saleTotal+= e.quantity * e.salePrice;
                  }
                });
                
               })
             }, 200);
            

            this.app.stopLoaderDark();
          },
          (Error:any)=>{
            this.app.stopLoaderDark();
          }
        )
    }

  }

  public filterUniqueValues<T>(array: T[]): T[] {
    const uniqueSet = new Set<string>();
    const uniqueArray: T[] = [];
  
    array.forEach((item:any) => {
     
      const key = JSON.stringify(item.productTitle);
      if (!uniqueSet.has(key)) {
        uniqueSet.add(key);
        uniqueArray.push(item);
      }
    });
  
    return uniqueArray;
  }



  print() {
    this.global.printData('#PrintDiv')
  }


  billDetails(item: any) {
    this.dialog.open(SaleBillDetailComponent, {
      width: '50%',
      data: item,
      disableClose: true,
    }).afterClosed().subscribe()
  }


  printBill(item:any){
    this.billPrint.printBill(item.invBillNo);
          this.billPrint.myDuplicateFlag = true;

          // setTimeout(() => {
          //   this.global.printData('#print-bill');
          // }, 500);
  }

}
