import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'jquery';
import { routes } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-work-book-report',
  templateUrl: './work-book-report.component.html',
  styleUrls: ['./work-book-report.component.scss']
})
export class WorkBookReportComponent {


  companyProfile: any = [];
  crudList: any = { c: true, r: true, u: true, d: true };

  public readonly global = inject(GlobalDataModule);
  private readonly route = inject(Router)
  private readonly msg = inject(NotificationService);
  private readonly app = inject(AppComponent);
  private readonly http = inject(HttpClient);

  constructor(

  ) {

    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
    });

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })
  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Work Book Report');
    this.getVehileList();

  }


  fromDate = new Date();
  toDate = new Date();
  fromTime = '00:00';
  toTime = '11:59';
  formateType = 1;

  vehicleID: any = 0;
  vehicleList: any = [];

  dataList: any = [];

  getVehileList() {

    var url = `${environment.mainApi + this.global.miningLink}GetVehicle?VehicleID=0`

    this.http.get(url).subscribe(
      {
        next: (Response: any) => {
          this.vehicleList = Response;
        },
        error: (error: any) => {
          console.log('error occured while loading vehicle list' + error);
        }
      }
    )

  }


  reset() {
    this.dataList = [];

  }




  getReport() {

    var fromDate = this.global.dateFormater(this.fromDate, '');
    var toDate = this.global.dateFormater(this.toDate, '');
    var fromTime = this.fromTime;
    var toTime = this.toTime;
    var reportType = this.formateType == 1 ? 'Summary' : 'Detail'

    var url = `${environment.mainApi + this.global.miningLink}GetWorkBookReport?VehicleID=${this.vehicleID}
      &ReportType=${reportType}&FromDate=${fromDate}&ToDate=${toDate}&FromTime=${fromTime}&ToTime=${toTime}`;
    this.app.startLoaderDark();
    this.http.get(url).subscribe(
      {
        next: (Response: any) => {
          console.log(Response);
          this.reset();
          if (Response.length == 0 || Response == null) {
            this.global.popupAlert('Data Not Found!');
            this.app.stopLoaderDark();
            return;

          }
          this.dataList = Response;

          this.app.stopLoaderDark();
        },
        error: (error) => {
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

    if (this.formateType == 2 && this.dataList.length == 0) return;
    if (this.formateType == 1 && this.dataList.length == 0) return;
    var startDate = this.global.dateFormater(this.fromDate, 'dd/MM/yyyy');
    var endDate = this.global.dateFormater(this.toDate, 'dd/MM/yyyy');
    var tableID = '';

    if (this.formateType == 1) tableID = 'summaryTable';
    if (this.formateType == 2) tableID = 'detailTable';

    this.global.ExportHTMLTabletoExcel(tableID,
      `Work Book Report ( (${startDate} - ${endDate})`)
  }

}
