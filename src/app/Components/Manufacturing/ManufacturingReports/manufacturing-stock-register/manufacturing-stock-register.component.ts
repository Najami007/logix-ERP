import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'jquery';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-manufacturing-stock-register',
  templateUrl: './manufacturing-stock-register.component.html',
  styleUrls: ['./manufacturing-stock-register.component.scss']
})
export class ManufacturingStockRegisterComponent implements OnInit {

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
    this.global.setHeaderTitle('Stock Register');
    this.getLocation();
  }


  locationID: any = 0;
  locationList: any = [];


  SaleDetailList: any = [];

  reportType: any;




  getLocation() {
    this.global.getWarehouseLocationList().subscribe((data: any) => { this.locationList = data; });
  }

  DataList: any = [];


  costTotal = 0;
  saleTotal = 0;

  getReport() {


    var url = '';

    if (this.locationID == 0) {
      url = `${this.apiReq}GetMnuInventoryRpt?rptType=full`;
    }

    if (this.locationID > 0) {
      url = `${this.apiReq}GetMnuInventoryRpt?rptType=LW&LID=${this.locationID}`;
    }



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

          this.DataList = Response;
          this.DataList.forEach((e: any) => {

            this.costTotal += e.costPrice * (e.qtyIn - e.qtyOut);
            this.saleTotal += e.salePrice * (e.qtyIn - e.qtyOut);

          });


          this.app.stopLoaderDark();

        },
        error: error => {
          console.log(error);
          this.app.stopLoaderDark();
        }
      }
    )

  }


  print() {
    this.global.printData('#PrintDiv')
  }

  export() {



    this.global.ExportHTMLTabletoExcel('#printContainer', `Stock Register`);
  }


  reset() {
    this.costTotal = 0;
    this.saleTotal = 0;


    this.DataList = [];

  }

}

