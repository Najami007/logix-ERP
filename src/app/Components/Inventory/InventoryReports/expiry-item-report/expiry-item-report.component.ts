import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-expiry-item-report',
  templateUrl: './expiry-item-report.component.html',
  styleUrls: ['./expiry-item-report.component.scss']
})
export class ExpiryItemReportComponent implements OnInit {


  @ViewChild('filterPanel') filterPanel!: MatSidenav;


  companyProfile: any = [];
  crudList: any = { c: true, r: true, u: true, d: true };
  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    public global: GlobalDataModule,
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
    this.global.setHeaderTitle('Expiry Report');
    this.getBrandList();
    this.getSubCategory();


  }




  
  fromDate: Date = new Date();
  fromTime: any = '00:00';
  toDate: Date = new Date();
  toTime: any = '23:59';





  formateType = 1;
  auditId = 0;
  auditList: any = []


  subCategoryFilterList: any = [];
  BrandList: any = [];
  tmpSearch:any = '';

  showAllFilterSubCategories = false;
  showAllFilterBrandList = false;


   ///////////////////////// Brand List //////////////

  getBrandList() {
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetBrand').subscribe(
      (Response: any) => {

        //////// assigning value on load/////////////
        if (Response.length > 0) {
          this.BrandList = Response.sort((a: any, b: any) =>
            a.brandTitle.localeCompare(b.brandTitle)
          );;
        }
      },
      (Error: any) => {
        this.msg.WarnNotify(Error);

      }
    )
  }

   ////////////////////// Sub Categories List /////////////

  getSubCategory() {
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetSubCategory').subscribe(
      (Response: any) => {

        if (Response.length > 0) {
          this.subCategoryFilterList = Response.sort((a: any, b: any) =>
            a.subCategoryTitle.localeCompare(b.subCategoryTitle)
          );
        }

      }
    )
  }


  AdvanceFilter() {

    this.app.startLoaderDark();

    const subCatList = this.subCategoryFilterList
      .filter((e: any) => e.isChecked)
      .map((e: any) => e.subCategoryID);

    const brandList = this.BrandList
      .filter((e: any) => e.isChecked)
      .map((e: any) => e.brandID);

   



    this.DataList = this.tmpDataList.filter((p: any) =>
      (subCatList.length === 0 || subCatList.includes(p.subCategoryID)) &&
      (brandList.length === 0 || brandList.includes(p.brandID))
      

    );


    this.filterPanel.close();
    this.app.stopLoaderDark();

  }




  clearFilter() {
    // reset checkboxes
    this.subCategoryFilterList.forEach((e: any) => e.isChecked = false);
    this.BrandList.forEach((e: any) => e.isChecked = false);
 
    // // reset product list
    this.DataList = [...this.tmpDataList];

  }



  DataList: any = [];
  tmpDataList:any = [];
  netTotal = 0;
  getReport() {


    var url = `${environment.mainApi + this.global.inventoryLink}GetExpiryReport_25`
    this.app.startLoaderDark();
    this.http.get(url).subscribe(
      (Response: any) => {
        this.reset();
        if (Response.length == 0 || Response == null) {
          this.global.popupAlert('Data Not Found!');
          this.app.stopLoaderDark();
          return;

        }

        this.DataList = Response;
        this.tmpDataList = Response;

        this.DataList.forEach((e: any) => {
          this.netTotal += e.quantity * e.costPrice;
        })

        this.app.stopLoaderDark();
      }
    )

  }
  print() { 
      this.global.printData('#PrintDiv')
  }

  export() { 
    

    // if (this.formateType == 1) tableID = 'summaryTable';
    var tableID = 'expiryReport';
    

    this.global.ExportHTMLTabletoExcel(tableID,
      `Audit Report()`)
  }



  reset() {
    this.DataList = [];
    this.netTotal = 0;


  }

}

