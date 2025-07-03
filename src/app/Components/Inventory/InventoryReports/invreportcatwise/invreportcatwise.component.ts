import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import * as $ from 'jquery';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-invreportcatwise',
  templateUrl: './invreportcatwise.component.html',
  styleUrls: ['./invreportcatwise.component.scss']
})
export class InvreportcatwiseComponent implements OnInit {

  page: number = 1;
  count: number = 0;

  tableSize: number = 25;
  tableSizes: any = [10, 25, 50, 100];
  jumpPage: any = 0;

  onTableDataChange(event: any) {

    this.page = event;
    this.getReport();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getReport();
  }

  goToPage(): void {
    var count = this.inventoryList.length / this.tableSize;
    alert(count)

    if (parseFloat(this.jumpPage) > count) {
      this.msg.WarnNotify('Invalid Value')
      return;
    }

    if (this.jumpPage >= 1) {
      this.page = this.jumpPage;
      this.getReport();
    }
  }



  companyProfile: any = [];
  crudList: any = { c: true, r: true, u: true, d: true };

  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    public global: GlobalDataModule,
    private dialog: MatDialog,
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
    this.global.setHeaderTitle('Stock Register');
    this.getReport();
    this.getCategory();
    this.getBrandList();
    this.getLocation();
    this.getProductTypes();
    this.hideFields();

  }


  reportTypeList: any = [
    { val: 'full', title: 'Full Report' },
    { val: 'FWD', title: 'Datewise' },
    { val: 'cw', title: 'Categorywise' },
    { val: 'scw', title: 'Sub Categorywise' },
    { val: 'bw', title: 'Brandwise' },
    { val: 'tw', title: 'Typewise' },
    { val: 'lw', title: 'Locationwise' },
    { val: 'cbw', title: 'Category & Brandwise' },
    { val: 'scbw', title: 'Sub-Category & Brand wise' },
    { val: 'ctw', title: 'Category & Typewise' },
    { val: 'sctw', title: 'subCategory & Typewise' },
    { val: 'cbtw', title: 'Category, Brand & Typewise' },
    { val: 'scbtw', title: 'SubCategorywise, Brand & Typewise' },
    { val: 'btw', title: 'Brand & Typewise' },
    { val: 'lcw', title: 'Location & Categorywise' },
    { val: 'lscw', title: 'Location & Sub Categorywise' },
    { val: 'lcbw', title: 'Location, Category & Brandwise' },
    { val: 'lscbw', title: 'Location, Sub Category, Brandwise' },
    { val: 'lctw', title: 'Location, Category & Typewise' },
    { val: 'lsctw', title: 'Location, Sub Category & Typewise' },
    { val: 'lctbw', title: 'Location, Category, Type & Brandwise' },
    { val: 'lsctbw', title: 'Location, Sub-Category, Type & Brandwise' },


  ]


  roleTypeID = this.global.getRoleTypeID();

  hideCost = true;
  hideSale = true;
  hideAvg = true;

  hideFields() {
    this.roleTypeID = this.global.getRoleTypeID();
    if (this.roleTypeID > 2) {
      this.hideCost = false;
      this.hideAvg = false;
      this.hideSale = false;
    }
  }

  dateFlag = false;
  catFlag = false;
  subCatFlag = false;
  locFlag = false;
  brandFlag = false;
  typeFlag = false;


  minusOnly = false;
  hideZero = false;
  zeroOnly = false;
  reportType = 'full';
  Title: any = 'Full';

  inventoryList: any = [];
  tmpInventoryList: any = [];

  SubCategoriesList: any = []
  CategoriesList: any = [];
  BrandList: any = [];
  ProductTypeList: any = [];
  locationList: any = [];

  categoryID = 0;
  subCategoryID = 0;
  locationID = 0;
  typeID = 0;
  brandID = 0;
  toDate = new Date();



  costTotal = 0;
  avgCostTotal = 0;
  saleTotal = 0;
  balanceQtyTotal = 0;


  categoryTitle = '';
  subCategoryTitle = '';
  brandTitle = '';
  typeTitle = '';
  locationTitle = '';

  chage(val: any) {
    alert(val);
  }


  onSelection(type: any, event: any) {


    if (type == 'cat') {
      this.categoryTitle = 'Cat: ' + this.CategoriesList.find((e: any) => e.categoryID == this.categoryID).categoryTitle;
    }

    if (type == 'subcat') {
      this.subCategoryTitle = 'Sub Cat: ' + this.SubCategoriesList.find((e: any) => e.subCategoryID == this.subCategoryID).subCategoryTitle;
    }

    if (type == 'brand') {
      this.brandTitle = 'Brand: ' + this.BrandList.find((e: any) => e.brandID == this.brandID).brandTitle;
    }

    if (type == 'type') {
      this.typeTitle = 'Type: ' + this.ProductTypeList.find((e: any) => e.productTypeID == this.typeID).productTypeTitle;
    }

    if (type == 'location') {
      this.locationTitle = 'Loc: ' + this.locationList.find((e: any) => e.locationID == this.locationID).locationTitle;
    }

  }

  getReport() {

    this.inventoryList = [];
    var idType = '';
    if (this.reportType == 'FWD') {
      idType = `&reqDate=${this.global.dateFormater(this.toDate, '-')}`;
      this.Title = `Date: ${this.datePipe.transform(this.toDate, 'dd-MM-yyyy')}`;
    }

    if (this.reportType == 'cw') {
      idType = '&cid=' + this.categoryID;
      this.Title = this.categoryTitle;
    }

    if (this.reportType == 'scw') {
      idType = '&cid=' + this.categoryID + '&scid=' + this.subCategoryID;
      this.Title = this.categoryTitle + ',' + this.subCategoryTitle;
    }

    if (this.reportType == 'bw') {
      idType = '&bid=' + this.brandID;
      this.Title = this.brandTitle;
    }

    if (this.reportType == 'lw') {
      idType = '&lid=' + this.locationID;
      this.Title = this.locationTitle;
    }

    if (this.reportType == 'tw') {
      idType = '&tid=' + this.typeID;
      this.Title = this.typeTitle;
    }

    if (this.reportType == 'cbw') {
      idType = '&cid=' + this.categoryID + '&bid=' + this.brandID;
      this.Title = this.categoryTitle + ' , ' + this.brandTitle;
    }

    if (this.reportType == 'scbw') {
      idType = '&cid=' + this.categoryID + '&scid=' + this.subCategoryID + '&bid=' + this.brandID;
      this.Title = this.categoryTitle + ' , ' + this.subCategoryTitle + ' , ' + this.brandTitle;
    }

    if (this.reportType == 'ctw') {
      idType = '&cid=' + this.categoryID + '&tid=' + this.typeID;
      this.Title = this.categoryTitle + ' , ' + this.typeTitle;

    }

    if (this.reportType == 'sctw') {
      idType = '&cid=' + this.categoryID + '&scid=' + this.subCategoryID + '&tid=' + this.typeID;
      this.Title = this.categoryTitle + ' , ' + this.subCategoryTitle + ' , ' + this.typeTitle;

    }

    if (this.reportType == 'cbtw') {
      idType = '&cid=' + this.categoryID + '&bid=' + this.brandID + '&tid=' + this.typeID;
      this.Title = this.categoryTitle + ' , ' + this.brandTitle + ' , ' + this.typeTitle;
    }

    if (this.reportType == 'scbtw') {
      idType = '&cid=' + this.categoryID + '&scid=' + this.subCategoryID + '&bid=' + this.brandID + '&tid=' + this.typeID;
      this.Title = this.categoryTitle + ' , ' + this.subCategoryTitle + ' , ' + this.brandTitle + ' , ' + this.typeTitle;
    }


    if (this.reportType == 'btw') {
      idType = '&bid=' + this.brandID + '&tid=' + this.typeID;
      this.Title = this.brandTitle + ' , ' + this.typeTitle;
    }

    if (this.reportType == 'lcw') {
      idType = '&lid=' + this.locationID + '&cid=' + this.categoryID;
      this.Title = this.locationTitle + ' , ' + this.categoryTitle;
    }

    if (this.reportType == 'lscw') {
      idType = '&lid=' + this.locationID + '&cid=' + this.categoryID + '&scid=' + this.subCategoryID;
      this.Title = this.locationTitle + ' , ' + this.categoryTitle + ' , ' + this.subCategoryTitle;
    }

    if (this.reportType == 'lcbw') {
      idType = '&lid=' + this.locationID + '&cid=' + this.categoryID + '&bid=' + this.brandID;
      this.Title = this.locationTitle + ' , ' + this.categoryTitle + ' , ' + this.brandTitle;
    }

    if (this.reportType == 'lscbw') {
      idType = '&lid=' + this.locationID + '&cid=' + this.categoryID + '&scid=' + this.subCategoryID + '&bid=' + this.brandID;
      this.Title = this.locationTitle + ' , ' + this.categoryTitle + ' , ' + this.subCategoryTitle + ' , ' + this.brandTitle;
    }

    if (this.reportType == 'lctw') {
      idType = '&lid=' + this.locationID + '&cid=' + this.categoryID + '&tid=' + this.typeID;
      this.Title = this.locationTitle + ' , ' + this.categoryTitle + ' , ' + this.typeTitle;
    }

    if (this.reportType == 'lsctw') {
      idType = '&lid=' + this.locationID + '&cid=' + this.categoryID + '&scid=' + this.subCategoryID + '&tid=' + this.typeID;
      this.Title = this.locationTitle + ' , ' + this.categoryTitle + ' , ' + this.subCategoryTitle + ' , ' + this.typeTitle;
    }

    if (this.reportType == 'lctbw') {
      idType = '&lid=' + this.locationID + '&cid=' + this.categoryID + '&bid=' + this.brandID + '&tid=' + this.typeID;
      this.Title = this.locationTitle + ' , ' + this.categoryTitle + ' , ' + this.brandTitle + ' , ' + this.typeTitle;
    }

    if (this.reportType == 'lsctbw') {
      idType = '&lid=' + this.locationID + '&cid=' + this.categoryID + '&scid=' + this.subCategoryID + '&bid=' + this.brandID + '&tid=' + this.typeID;
      this.Title = this.locationTitle + ' , ' + this.categoryTitle + ' , ' + this.subCategoryTitle + ' , ' + this.brandTitle + ' , ' + this.typeTitle;
    }




    if (this.reportType == 'cw' && this.categoryID == 0) {
      this.msg.WarnNotify('Select Category')
    } else if (this.reportType == 'scw' && (this.categoryID == 0 || this.subCategoryID == 0)) {
      this.msg.WarnNotify('Select Category and Sub Category')
    } else if (this.reportType == 'bw' && this.brandID == 0) {
      this.msg.WarnNotify('Select Brand')
    } else if (this.reportType == 'lw' && this.locationID == 0) {
      this.msg.WarnNotify('Select Location')
    } else if (this.reportType == 'tw' && this.typeID == 0) {
      this.msg.WarnNotify('Select Type')
    } else {
      this.app.startLoaderDark();
      // alert(this.reportType+idType);
      this.http.get(environment.mainApi + this.global.inventoryLink + 'GetInventoryRpt?rptType=' + this.reportType + idType).subscribe(
        (Response: any) => {
          this.inventoryList = [];
          this.tmpInventoryList = [];
          this.costTotal = 0;
          this.avgCostTotal = 0;
          this.saleTotal = 0;
          this.balanceQtyTotal = 0;
          if (Response.length == 0 || Response == null) {
            this.global.popupAlert('Data Not Found!');
            this.app.stopLoaderDark();
            return;

          }

          this.inventoryList = Response;
          this.tmpInventoryList = Response;
          this.filterReport();

          // this.inventoryList = Response;

          this.app.stopLoaderDark();
          

          if (Response != null)
            this.getTotal()
        }
      )

    }


  }


  getTotal() {
    this.costTotal = 0;
    this.avgCostTotal = 0;
    this.saleTotal = 0;
    this.balanceQtyTotal = 0;
    this.inventoryList.forEach((e: any) => {
      this.costTotal += e.costPrice * (e.qtyIn - e.qtyOut);
      this.avgCostTotal += e.avgCostPrice * (e.qtyIn - e.qtyOut);
      this.saleTotal += e.salePrice * (e.qtyIn - e.qtyOut);
      this.balanceQtyTotal += e.qtyIn - e.qtyOut;
    });
  }

  emptyField() {
    this.categoryID = 0;
    this.subCategoryID = 0;
    this.brandID = 0;
    this.locationID = 0;
    this.typeID = 0;
  }


  openDialog() {


    if (this.reportType == 'full') {
      this.catFlag = false;
      this.subCatFlag = false;
      this.brandFlag = false;
      this.locFlag = false;
      this.typeFlag = false
      this.Title = 'Full'
      this.getReport();
    } else {
      this.global.openBootstrapModal('#credential', true);
    }


    if (this.reportType == 'FWD') {
      this.dateFlag = true;
      this.catFlag = false;
      this.subCatFlag = false;
      this.brandFlag = false;
      this.locFlag = false;
      this.typeFlag = false

    }


    if (this.reportType == 'cw') {

      this.catFlag = true;
      this.subCatFlag = false;
      this.brandFlag = false;
      this.locFlag = false;
      this.typeFlag = false
      this.dateFlag = false;

    }

    if (this.reportType == 'scw') {
      this.catFlag = true;
      this.subCatFlag = true;
      this.brandFlag = false;
      this.locFlag = false;
      this.typeFlag = false
      this.dateFlag = false;
    }

    if (this.reportType == 'bw') {
      this.catFlag = false;
      this.subCatFlag = false;
      this.brandFlag = true;
      this.locFlag = false;
      this.typeFlag = false
      this.dateFlag = false;
    }

    if (this.reportType == 'lw') {
      this.catFlag = false;
      this.subCatFlag = false;
      this.brandFlag = false;
      this.locFlag = true;
      this.typeFlag = false
      this.dateFlag = false;
    }

    if (this.reportType == 'tw') {
      this.catFlag = false;
      this.subCatFlag = false;
      this.brandFlag = false;
      this.locFlag = false;
      this.typeFlag = true;
    }

    if (this.reportType == 'cbw') {
      this.catFlag = true;
      this.subCatFlag = false;
      this.brandFlag = true;
      this.locFlag = false;
      this.typeFlag = false;
      this.dateFlag = false;
    }

    if (this.reportType == 'scbw') {
      this.catFlag = true;
      this.subCatFlag = true;
      this.brandFlag = true;
      this.locFlag = false;
      this.typeFlag = false;
      this.dateFlag = false;
    }

    if (this.reportType == 'ctw') {
      this.catFlag = true;
      this.subCatFlag = false;
      this.brandFlag = false;
      this.locFlag = false;
      this.typeFlag = true;
      this.dateFlag = false;
    }

    if (this.reportType == 'sctw') {
      this.catFlag = true;
      this.subCatFlag = true;
      this.brandFlag = false;
      this.locFlag = false;
      this.typeFlag = true;
      this.dateFlag = false;
    }

    if (this.reportType == 'cbtw') {
      this.catFlag = true;
      this.subCatFlag = false;
      this.brandFlag = true;
      this.locFlag = false;
      this.typeFlag = true;
      this.dateFlag = false;
    }

    if (this.reportType == 'scbtw') {
      this.catFlag = true;
      this.subCatFlag = true;
      this.brandFlag = true;
      this.locFlag = false;
      this.typeFlag = true;
      this.dateFlag = false;
    }


    if (this.reportType == 'btw') {
      this.catFlag = false;
      this.subCatFlag = false;
      this.brandFlag = true;
      this.locFlag = false;
      this.typeFlag = true;
      this.dateFlag = false;
    }

    if (this.reportType == 'lcw') {
      this.catFlag = true;
      this.subCatFlag = false;
      this.brandFlag = false;
      this.locFlag = true;
      this.typeFlag = false;
      this.dateFlag = false;
    }

    if (this.reportType == 'lscw') {
      this.catFlag = true;
      this.subCatFlag = true;
      this.brandFlag = false;
      this.locFlag = true;
      this.typeFlag = false;
      this.dateFlag = false;
    }

    if (this.reportType == 'lcbw') {
      this.catFlag = true;
      this.subCatFlag = false;
      this.brandFlag = true;
      this.locFlag = true;
      this.typeFlag = false;
      this.dateFlag = false;
    }

    if (this.reportType == 'lscbw') {
      this.catFlag = true;
      this.subCatFlag = true;
      this.brandFlag = true;
      this.locFlag = true;
      this.typeFlag = false;
      this.dateFlag = false;
    }

    if (this.reportType == 'lctw') {
      this.catFlag = true;
      this.subCatFlag = false;
      this.brandFlag = false;
      this.locFlag = true;
      this.typeFlag = true;
      this.dateFlag = false;
    }

    if (this.reportType == 'lsctw') {
      this.catFlag = true;
      this.subCatFlag = true;
      this.brandFlag = false;
      this.locFlag = true;
      this.typeFlag = true;
      this.dateFlag = false;
    }

    if (this.reportType == 'lctbw') {
      this.catFlag = true;
      this.subCatFlag = false;
      this.brandFlag = true;
      this.locFlag = true;
      this.typeFlag = true;
      this.dateFlag = false;
    }

    if (this.reportType == 'lsctbw') {
      this.catFlag = true;
      this.subCatFlag = true;
      this.brandFlag = true;
      this.locFlag = true;
      this.typeFlag = true;
      this.dateFlag = false;
    }

  }


  print() {
    this.global.printData('#printRpt')
  }


  getSubCategory() {
    this.subCategoryID = 0;
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetSubCategory').subscribe(
      (Response: any) => {
        this.SubCategoriesList = Response.filter((e: any) => e.categoryID == this.categoryID);

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


  getBrandList() {
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetBrand').subscribe(
      (Response: any) => {
        this.BrandList = Response;
      }
    )
  }


  getProductTypes() {
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetProductType').subscribe(
      (Response: any) => {
        this.ProductTypeList = Response;

      }
    )
  }

  getLocation() {
    this.http.get(environment.mainApi + this.global.inventoryLink + 'getlocation').subscribe(
      (Response: any) => {
        this.locationList = Response;
      }
    )
  }

  filterList: any = [
    { id: 1, title: 'ALL' },
    { id: 2, title: 'Minus Only' },
    { id: 5, title: 'Plus Only' },
    { id: 3, title: 'Hide Zero' },
    { id: 4, title: 'Zero Only' },

  ]

  filterID: any = 1;

  filterReport() {

    if (this.filterID == 1) {
      this.inventoryList = this.tmpInventoryList;
    }

    if (this.filterID == 2) {
      this.inventoryList = this.tmpInventoryList.filter((e: any) => (e.qtyIn - e.qtyOut) < 0)
    }
    if (this.filterID == 3) {
      this.inventoryList = this.tmpInventoryList.filter((e: any) => (e.qtyIn - e.qtyOut) > 0 || (e.qtyIn - e.qtyOut) < 0)
    }

    if (this.filterID == 4) {
      this.inventoryList = this.tmpInventoryList.filter((e: any) => (e.qtyIn - e.qtyOut) == 0)
    }

    if (this.filterID == 5) {
      this.inventoryList = this.tmpInventoryList.filter((e: any) => (e.qtyIn - e.qtyOut) > 0)
    }


    setTimeout(() => {
      this.getTotal();
    }, 200);

  }


}
