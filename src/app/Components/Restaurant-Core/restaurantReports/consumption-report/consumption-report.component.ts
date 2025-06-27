import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-consumption-report',
  templateUrl: './consumption-report.component.html',
  styleUrls: ['./consumption-report.component.scss']
})
export class ConsumptionReportComponent {

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
    this.global.setHeaderTitle('Consumption Report');
    this.getUsers();
    this.getAllRecipe();
    this.getProducts();
    setTimeout(() => {
      $('#detailTable').hide();
      $('#summaryTable').show();
    }, 200);

  }

  getProducts() {
    this.global.getProducts().subscribe(
      (Response: any) => {
        if (Response.length > 0) {
          this.productList = Response.map((e: any, index: any) => {
            (e.indexNo = index + 1);
            return e;
          });
          this.productList.sort((a: any, b: any) => b.indexNo - a.indexNo);;
        }
      }
    )
  }

  onProdSelected() {
    var index = this.productList.findIndex((e: any) => e.productID == this.productID);
    this.productList[index].indexNo = this.productList[0].indexNo + 1;
    this.productList.sort((a: any, b: any) => b.indexNo - a.indexNo);
  }




  productList: any = [];
  productID = 0;
  userList: any = [];
  userID = 0;
  userName = '';



  fromDate: Date = new Date();
  fromTime: any = '00:00';
  toDate: Date = new Date();
  toTime: any = '23:59';


  ConsumptionList: any = [];
  tempRecipeTitle = '';
  recipeID = 0;
  recipeTitle = '';
  RecipeList: any = [];
  qtyTotal: any = 0;
  amountTotal: any = 0;

  getUsers() {
    this.global.getUserList().subscribe((data: any) => { this.userList = data; });
  }


  onUserSelected() {
    var curUser = this.userList.find((e: any) => e.userID == this.userID);
    this.userName = curUser.userName;
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


  getReport() {
    $('#detailTable').hide();
    $('#summaryTable').show();
    this.ConsumptionList = [];
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetConsumptionRptDateWise?reqUID=' + this.userID + '&FromDate=' +
      this.global.dateFormater(this.fromDate, '-') + '&todate=' + this.global.dateFormater(this.toDate, '-') + '&fromtime=' + this.fromTime + '&totime=' + this.toTime).subscribe(
        (Response: any) => {
          if (Response.length == 0 || Response == null) {
            this.global.popupAlert('Data Not Found!');
            this.app.stopLoaderDark();
            return;

          }

          this.ConsumptionList = Response;

          if (Response.length > 0) {
            this.qtyTotal = 0;
            this.amountTotal = 0;
            Response.forEach((e: any) => {
              this.qtyTotal += e.quantity;
              this.amountTotal += e.avgCostPriceTotal;

            });
          }

        }
      )

  }


  getIngredientwise() {
    $('#detailTable').show();
    $('#summaryTable').hide();
    if (this.productID == 0 || this.productID == undefined) {
      this.msg.WarnNotify('Select Product')
    } else {
      this.ConsumptionList = [];
      this.qtyTotal = 0;
      this.amountTotal = 0;
      this.http.get(environment.mainApi + this.global.inventoryLink + 'GetConsumptionRptIngredientAndDateWise?reqUID=' + this.userID + '&FromDate=' +
        this.global.dateFormater(this.fromDate, '-') + '&ToDate=' + this.global.dateFormater(this.toDate, '-') + '&fromtime=' + this.fromTime + '&totime=' + this.toTime +
        '&ProductID=' + this.productID).subscribe(
          (Response: any) => {
            if (Response.length == 0 || Response == null) {
              this.global.popupAlert('Data Not Found!');
              this.app.stopLoaderDark();
              return;

            }
            this.ConsumptionList = Response;
            if (Response.length > 0) {
              this.qtyTotal = 0;
              this.amountTotal = 0;
              Response.forEach((e: any) => {
                this.qtyTotal += e.quantity;
                this.amountTotal += e.avgCostPriceTotal;

              });
            }


          }
        )
    }


  }


  getRecipewise() {
    $('#detailTable').show();
    $('#summaryTable').hide();
    if (this.recipeID == 0 || this.recipeID == undefined) {
      this.msg.WarnNotify('Select Recipe')
    } else {
      this.ConsumptionList = [];
      this.qtyTotal = 0;
      this.amountTotal = 0;
      this.http.get(environment.mainApi + this.global.inventoryLink + 'GetConsumptionRptRecipeAndDateWise?reqUID=' + this.userID + '&FromDate=' +
        this.global.dateFormater(this.fromDate, '-') + '&ToDate=' + this.global.dateFormater(this.toDate, '-') + '&fromtime=' + this.fromTime + '&totime=' + this.toTime +
        '&RecipeID=' + this.recipeID).subscribe(
          (Response: any) => {
            this.ConsumptionList = [];
            this.qtyTotal = 0;
              this.amountTotal = 0;
            if (Response.length == 0 || Response == null) {
              this.global.popupAlert('Data Not Found!');
              this.app.stopLoaderDark();
              return;

            }
            this.ConsumptionList = Response;
            if (Response.length > 0) {
              
              Response.forEach((e: any) => {
                this.qtyTotal += e.quantity;
                this.amountTotal += e.avgCostPriceTotal;

              });
            }


          }
        )
    }


  }




  print() {
    this.global.printData('#PrintDiv')
  }



}
