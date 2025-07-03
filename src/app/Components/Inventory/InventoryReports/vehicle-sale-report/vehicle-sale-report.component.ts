import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-vehicle-sale-report',
  templateUrl: './vehicle-sale-report.component.html',
  styleUrls: ['./vehicle-sale-report.component.scss']
})
export class VehicleSaleReportComponent {



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
    this.global.setHeaderTitle('Sale History Vehicle');
    this.getVehicles();
    this.getUsers();

  }

  fromDate: Date = new Date();
  fromTime: any = '00:00';
  toDate: Date = new Date();
  toTime: any = '23:59';

  userList: any = [];
  userID = 0;
  userName = '';
  vehicleID = 0;



  getUsers() {
    this.global.getUserList().subscribe((data: any) => { this.userList = data; });
  }

  onUserSelected() {
    var curUser = this.userList.find((e: any) => e.userID == this.userID);
    this.userName = curUser.userName;
  }



  vehicleList: any = [];
  getVehicles() {
    this.http.get(environment.mainApi + 'veh/GetActiveVehicle').subscribe(
      (Response: any) => {
        this.vehicleList = Response;
      }
    )
  }


  SaleDetail: any = [];
  billGrandTotal: any = 0;
  DiscTotal: any = 0;
  netGrandTotal: any = 0;

  getReport() {
    var fromDate = this.global.dateFormater(this.fromDate, '');
    var toDate = this.global.dateFormater(this.toDate, '');


    var url = `GetVehicleSale?reqUserID=${this.userID}&reqVehicleID=${this.vehicleID}&FromDate=${fromDate}&ToDate=${toDate}&FromTime=${this.fromTime}&ToTime=${this.toTime}`;

    this.app.startLoaderDark();
    this.http.get(environment.mainApi + 'veh/' + url).subscribe(
      (Response: any) => {
        this.SaleDetail = [];
        this.billGrandTotal = 0;
        this.DiscTotal = 0;
        this.netGrandTotal = 0;
        if (Response.length == 0 || Response == null) {
          this.global.popupAlert('Data Not Found!');
          this.app.stopLoaderDark();
          return;

        }
        if (Response.length > 0) {
          this.SaleDetail = Response.map((e: any) => {
            (e.billDetails = JSON.parse(e.billDetail))
            return e;
          });


          this.SaleDetail.forEach((e: any) => {
            if (e.invType == 'S') {
              this.billGrandTotal += e.billTotal;
              this.DiscTotal += e.billDiscount;
              this.netGrandTotal += e.netTotal;
            }
            if (e.invType == 'SR') {
              this.billGrandTotal -= e.billTotal;
              this.DiscTotal -= e.billDiscount;
              this.netGrandTotal -= e.netTotal;
            }

          })
        }


        this.app.stopLoaderDark();
      },
      (Error: any) => {
        this.app.stopLoaderDark();
        console.log(Error);
      }
    )

  }

  print() {
    this.global.printData('#PrintDiv')
  }


}
