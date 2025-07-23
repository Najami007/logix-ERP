import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
import { VoucherDetailsComponent } from '../../CommonComponent/voucher-details/voucher-details.component';

@Component({
  selector: 'app-journel',
  templateUrl: './journel.component.html',
  styleUrls: ['./journel.component.scss']
})
export class JournelComponent {


  crudList: any = { c: true, r: true, u: true, d: true };
  companyProfile: any = [];


  constructor(private globalData: GlobalDataModule,
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    private route: Router,
    private datePipe: DatePipe,
    private dialog: MatDialog

  ) {
    // this.http.get(environment.mainApi+'cmp/getcompanyprofile').subscribe(
    //   (Response:any)=>{
    //     this.companyProfile = Response;
    //   }
    // )

    this.globalData.getCompany().subscribe((data) => {
      this.companyProfile = data;
    });

    this.globalData.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })


  }
  ngOnInit(): void {
    this.globalData.setHeaderTitle('Journel');
    this.globalData.getCompany();

    this.getProject()
  }


  fromDate: any = new Date();
  toDate: any = new Date();

  projectSearch: any;
  projectID: number = 0;
  projectName: any;
  projectList: any = [];


  getProject() {

    this.globalData.getProjectList().subscribe((data: any) => { this.projectList = data; });

  }


  dataList: any = [];

  getReport(type) {

    var fromDate = this.globalData.dateFormater(this.fromDate, '');
    var toDate = this.globalData.dateFormater(this.toDate, '');
    var projectID = this.projectID;


    if (this.projectID != 0) {
      this.projectName = this.projectList.find((e: any) => e.projectID == this.projectID).projectTitle;
    }
    this.app.startLoaderDark();
    this.dataList = [];
    this.http.get(environment.mainApi + this.globalData.accountLink + `GetJournal?FromDate=${fromDate}&ToDate=${toDate}&ProjectID=${projectID}`).subscribe(
      (Response: any) => {
         if (Response.length == 0 || Response == null) {
              this.globalData.popupAlert('Data Not Found!');
              this.app.stopLoaderDark();
              return;
            }
        this.dataList = Response;
        this.app.stopLoaderDark();
      },
      (Error: any) => {
        console.log(Error);
        this.app.stopLoaderDark();
      }
    )

  }







  VoucherDetails(row: any) {

    this.dialog.open(VoucherDetailsComponent, { width: "40%", data: row, }).afterClosed().subscribe(val => { });
  }



  PrintTable() {

    setTimeout(() => {
      this.globalData.printData('#printDiv');
    }, 200);
  }

  export() {
    var startDate = this.datePipe.transform(this.fromDate, 'dd/MM/yyyy');
    var endDate = this.datePipe.transform(this.toDate, 'dd/MM/yyyy');
    this.globalData.ExportHTMLTabletoExcel('printDiv', 'Journel ' + '(' + startDate + ' - ' + endDate + ')')
  }

}
