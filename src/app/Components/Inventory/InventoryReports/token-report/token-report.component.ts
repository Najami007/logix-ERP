import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-token-report',
  templateUrl: './token-report.component.html',
  styleUrls: ['./token-report.component.scss']
})
export class TokenReportComponent {



  companyProfile: any = [];
  crudList: any = { c: true, r: true, u: true, d: true };
  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    private global: GlobalDataModule,
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
    this.global.setHeaderTitle('Token Report');



  }




  cnicMask = '00000-0000000-0';
  mobilMask = '0000-0000000'


  fromDate: Date = new Date();
  fromTime: any = '00:00';
  toDate: Date = new Date();
  toTime: any = '23:59';


  reqTypeList = [{ id: 'All', value: 'All' }, { id: 'Sum', value: 'Summary' }, { id: 'Mob', value: 'Mobile No' }, { id: 'Cnic', value: 'CNIC' }]
  reqType = 'All';
  reqFilterValue = '';

  rptType = 'All';

  TableData: any = [];
  searchTable: any = '';
  billTotal = 0;
  billDiscTotal = 0;
  netTotal = 0;

  getReport() {

    var fromDate = this.global.dateFormater(this.fromDate, '-');
    var toDate = this.global.dateFormater(this.toDate, '-');
    var fromTime = this.fromTime;
    var toTime = this.toTime;
    var reqType = this.reqType;
    var reqFilter = this.reqFilterValue;
    this.rptType = this.reqType;

    var url = `${environment.mainApi + this.global.inventoryLink}GetTokenDateWise?reqType=${reqType}&reqFilter=${reqFilter}&FromDate=${fromDate}&ToDate=${toDate}&FromTime=${fromTime}&ToTime=${toTime}`;


    this.http.get(url).subscribe(
      (Response: any) => {
        this.reset();
        if (Response.length == 0 || Response == null) {
          this.global.popupAlert('Data Not Found!');
          this.app.stopLoaderDark();
          return;
        }

        this.TableData = Response;

        this.TableData.forEach((e: any) => {
          this.billTotal += e.singleBillTotal;
          // this.billDiscTotal += e.billDiscount;
          // this.netTotal += e.netTotal;
        });

      }
    )

  }

  reset() {
    this.billTotal = 0;
    this.billDiscTotal = 0;
    this.netTotal = 0;
    this.TableData = [];
  }

  print() {
    this.global.printData('#PrintDiv')

  }



  export() {

    var startDate = this.datePipe.transform(this.fromDate, 'dd/MM/yyyy');
    var endDate = this.datePipe.transform(this.toDate, 'dd/MM/yyyy');
    var tableID = 'tokenList';


    this.global.ExportHTMLTabletoExcel(tableID,
      `Token List (${startDate} - ${endDate})`)
  }


}
