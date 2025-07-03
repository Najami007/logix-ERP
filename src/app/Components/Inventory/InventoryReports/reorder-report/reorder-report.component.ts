import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-reorder-report',
  templateUrl: './reorder-report.component.html',
  styleUrls: ['./reorder-report.component.scss']
})
export class ReorderReportComponent {



  companyProfile: any = [];
  crudList: any = { c: true, r: true, u: true, d: true };
  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    private global: GlobalDataModule,
    private route: Router

  ) {

    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
    });

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })
  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Reorder Report');
    this.getUsers();
    this.getCategory();
    this.getBrandList();

  }


  rptType: any = 'full';
  userList: any = [];
  userID = 0;
  userName = '';
  detailList: any = []
  fromDate: Date = new Date();
  fromTime: any = '00:00';
  toDate: Date = new Date();
  toTime: any = '23:59';
  getUsers() {
    this.global.getUserList().subscribe((data: any) => { this.userList = data; });
  }

  onUserSelected() {
    var curUser = this.userList.find((e: any) => e.userID == this.userID);
    this.userName = curUser.userName;
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


  getReport() {


    if (this.rptType == 'cw' && this.CategoryID == 0) {
      this.msg.WarnNotify('Select Category');
      return;
    }
    if (this.rptType == 'scw' && (this.CategoryID == 0 || this.SubCategoryID == 0)) {
      this.msg.WarnNotify('Select Subcategory');
      return;
    }
    if (this.rptType == 'bw' && this.BrandID == 0) {
      this.msg.WarnNotify('Select Brand');
      return;
    }

    var url = `${this.global.inventoryLink}GetMinRolRpt?rptType=${this.rptType}&cid=${this.CategoryID}&scid=${this.SubCategoryID}&bid=${this.BrandID}`
    this.app.startLoaderDark();
    this.http.get(environment.mainApi + url).subscribe(
      (Response: any) => {
        this.detailList = [];
        if (Response.length == 0 || Response == null) {
          this.global.popupAlert('Data Not Found!');
          this.app.stopLoaderDark();
          return;
        }
        this.detailList = Response;
        this.app.stopLoaderDark();
      },
      (Error: any) => {
        console.log(Error);
        this.app.stopLoaderDark();
      }
    )

  }

  print() {
    this.global.printData('#PrintDiv')
  }


}
