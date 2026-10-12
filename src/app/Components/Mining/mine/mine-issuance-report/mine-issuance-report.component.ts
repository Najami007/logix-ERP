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
  selector: 'app-mine-issuance-report',
  templateUrl: './mine-issuance-report.component.html',
  styleUrls: ['./mine-issuance-report.component.scss']
})
export class MineIssuanceReportComponent {


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
    this.global.setHeaderTitle('Mine Issuance Report');
    this.getMinesList();

  }


  fromDate = new Date();
  toDate = new Date();
  fromTime = '00:00';
  toTime = '11:59';
  formateType = 1;

  mineID: any = 0;
  mineList: any = [];

  dataList: any = [];

  getMinesList() {

    var url = `${environment.mainApi + this.global.miningLink}GetMine`

    this.http.get(url).subscribe(
      {
        next: (Response: any) => {
          this.mineList = Response;
        },
        error: (error: any) => {
          console.log('error occured while loading Mines list' + error);
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

    var url = `${environment.mainApi + this.global.miningLink}GetMineIssuanceReport?MineID=${this.mineID}
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

  
  ReportTotals(List:any){
     var round2 = (n: number) => Math.round(n * 100) / 100;
    return  {
      items: List.length,
      grandBillTotal: round2(List.reduce((sum, l) => sum + (Number(l.billTotal) || 0), 0)),
      costTotal: round2(List.reduce((sum, l) => sum + (Number(l.quantity) || 0) * (Number(l.costPrice) || 0), 0)),
      saleTotal: round2(List.reduce((sum, l) => sum + (Number(l.quantity) || 0) * (Number(l.salePrice) || 0), 0)),
      avgCostTotal: round2(List.reduce((sum, l) => sum + (Number(l.quantity) || 0) * (Number(l.avgCostPrice) || 0), 0)),
    };
  }


  get  totals():any{
    var row = this.ReportTotals(this.dataList);
    return {...row}
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
      `Mine Issuance Report ( (${startDate} - ${endDate})`)
  }

}
