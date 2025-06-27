import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Time } from 'highcharts';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { SaleBillDetailComponent } from '../../Sales/sale1/sale-bill-detail/sale-bill-detail.component';

@Component({
  selector: 'app-sale-rpt-recipewise',
  templateUrl: './sale-rpt-recipewise.component.html',
  styleUrls: ['./sale-rpt-recipewise.component.scss']
})
export class SaleRptRecipewiseComponent implements OnInit {



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
    this.global.setHeaderTitle('Sale Report (Recipewise)');
    this.getUsers();
    this.getAllRecipe();
    setTimeout(() => {
      $('#detailTable').show();
      $('#summaryTable').hide();
    }, 200);
  }



  reportList: any = [{ val: 'Dine In', title: 'Dine In' }, { val: 'Take Away', title: 'Take Away' }, { val: 'Home Delivery', title: 'Home Delivery' },]

  rptType: any = 'Dine In';

  userList: any = [];
  userID = 0;
  userName = '';

  fromDate: Date = new Date();
  fromTime: any = '00:00';
  toDate: Date = new Date();
  toTime: any = '23:59';

  SaleDetailList: any = [];
  saleSummaryList: any = [];
  tempSaleSummaryList: any = [];

  reportType: any;
  recipeID = 0;
  recipeTitle = '';
  tempRecipeTitle = '';
  RecipeList: any = [];


  startVal: any = '';
  endVal: any = '';

  filterRecipe(start: any, end: any, type: any) {
    if (this.tempSaleSummaryList == '') {
      this.msg.WarnNotify('First Click Summary')
    } else {
      this.app.startLoaderDark();
      if (type == 'perc') {
        this.saleSummaryList = this.tempSaleSummaryList.filter((e: any) => (((e.avgCostPrice * e.quantity) / e.total) * 100) >= start &&
          (((e.avgCostPrice * e.quantity) / e.total) * 100) <= end)
      }

      if (type == 'qty') {
        this.saleSummaryList = this.tempSaleSummaryList.filter((e: any) => e.quantity >= start && e.quantity <= end)
      }



      this.QtyTotal = 0;
      this.summaryTotal = 0;
      this.summaryAvgCostTotal = 0;
      this.saleSummaryList.forEach((e: any) => {
        this.QtyTotal += e.quantity;
        this.summaryAvgCostTotal += e.avgCostPrice * e.quantity;
        this.summaryTotal += e.total;
      });

      this.app.stopLoaderDark();
    }


  }


  getAllRecipe() {
    this.http.get(environment.mainApi + this.global.restaurentLink + 'GetAllRecipes').subscribe(
      (Response: any) => {
        this.RecipeList = Response.map((e: any, index: any) => {
          (e.indexNo = index + 1);
          return e;
        });
        this.RecipeList.sort((a: any, b: any) => b.indexNo - a.indexNo);

      }
    )
  }

  OnRecipeSelected() {
    this.tempRecipeTitle = this.RecipeList.find((e: any) => e.recipeID == this.recipeID).recipeTitle;
    var index = this.RecipeList.findIndex((e: any) => e.recipeID == this.recipeID);
    this.RecipeList[index].indexNo = this.RecipeList[0].indexNo + 1;
    this.RecipeList.sort((a: any, b: any) => b.indexNo - a.indexNo);
  }

  getUsers() {
    this.global.getUserList().subscribe((data: any) => { this.userList = data; });
  }




  onUserSelected() {
    var curUser = this.userList.find((e: any) => e.userID == this.userID);
    this.userName = curUser.userName;
  }




  QtyTotal = 0;
  detailTotal = 0;
  detailAvgCostTotal = 0;
  summaryTotal = 0;
  summaryAvgCostTotal = 0;

  getReport(type: any) {


    if (type == 'detail' && (this.recipeID == 0 || this.recipeID == undefined)) {

      this.msg.WarnNotify("Select Recipe")
    } else {

      if (type == 'detail') {
        this.recipeTitle = this.tempRecipeTitle;
        $('#detailTable').show();
        $('#summaryTable').hide();
        this.reportType = 'Detail';
        this.app.startLoaderDark();
        this.http.get(environment.mainApi + this.global.inventoryLink + 'GetRecipeSaleDetailDateWise?reqrid=' + this.recipeID + '&reqUID=' + this.userID + '&FromDate=' +
          this.global.dateFormater(this.fromDate, '-') + '&todate=' + this.global.dateFormater(this.toDate, '-') + '&fromtime=' + this.fromTime + '&totime=' + this.toTime).subscribe(
            (Response: any) => {
              if (Response.length == 0 || Response == null) {
                this.global.popupAlert('Data Not Found!');
                this.app.stopLoaderDark();
                return;

              }

              this.saleSummaryList = [];
              this.tempSaleSummaryList = [];
              this.SaleDetailList = Response;

              this.detailAvgCostTotal = 0;
              this.QtyTotal = 0;
              this.detailTotal = 0;
              Response.forEach((e: any) => {
                this.QtyTotal += e.quantity;
                this.detailAvgCostTotal += e.avgCostPrice * e.quantity;
                this.detailTotal += e.quantity * e.salePrice;
              });

              this.app.stopLoaderDark();

            },
            (Error: any) => {
              this.app.stopLoaderDark();
            }
          )
      }

      if (type == 'summary') {
        this.recipeTitle = '';
        this.recipeID = 0;
        $('#detailTable').hide();
        $('#summaryTable').show();
        this.reportType = 'Summary';
        this.app.startLoaderDark();
        this.http.get(environment.mainApi + this.global.inventoryLink + 'GetRecipeSaleSummaryDateWise?&reqUID=' + this.userID + '&FromDate=' +
          this.global.dateFormater(this.fromDate, '-') + '&todate=' + this.global.dateFormater(this.toDate, '-') + '&fromtime=' + this.fromTime + '&totime=' + this.toTime).subscribe(
            (Response: any) => {
              this.SaleDetailList = [];
              this.tempSaleSummaryList = [];
              this.QtyTotal = 0;
              this.summaryTotal = 0;
              this.summaryAvgCostTotal = 0;
              if (Response.length == 0 || Response == null) {
                this.global.popupAlert('Data Not Found!');
                this.app.stopLoaderDark();
                return;

              }


              this.saleSummaryList = Response;
              this.tempSaleSummaryList = Response;

              Response.forEach((e: any) => {
                this.QtyTotal += e.quantity;
                this.summaryAvgCostTotal += e.avgCostPrice;
                this.summaryTotal += e.total;
              });
              this.app.stopLoaderDark();
            },
            (Error: any) => {
              this.app.stopLoaderDark();
            }
          )
      }
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

