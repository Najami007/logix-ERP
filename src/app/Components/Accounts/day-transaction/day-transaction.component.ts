import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { VoucherDetailsComponent } from '../CommonComponent/voucher-details/voucher-details.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-day-transaction',
  templateUrl: './day-transaction.component.html',
  styleUrls: ['./day-transaction.component.scss']
})
export class DayTransactionComponent implements OnInit {
  companyProfile: any = [];
  crudList: any = { c: true, r: true, u: true, d: true };

  constructor(
    private http: HttpClient,
    private global: GlobalDataModule,
    private app: AppComponent,
    private msg: NotificationService,
    private dialogue: MatDialog,
    private route: Router
  ) {
    // this.http.get(environment.mainApi+'cmp/getcompanyprofile').subscribe(
    //   (Response:any)=>{this.companyProfile = Response;})


    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
    });

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })


  }






  ngOnInit(): void {

    this.global.setHeaderTitle('Transaction Report');
    this.getProject();




  }

  fromDate: Date = new Date();
  toDate: Date = new Date();

  projectSearch: any;
  coaID: any;
  projectID: number = 0;
  projectName: any;

  lblDebitTotal: any;
  lblCreditTotal: any;
  invoiceDetails: any;
  reportData: any = [];
  tmpReportData: any = [];




  projectList: any = [];


  // getCrud(){
  //   this.http.get(environment.mainApi+'user/getusermenu?userid='+this.global.getUserID()+'&moduleid='+this.global.getModuleID()).subscribe(
  //     (Response:any)=>{
  //       this.crudList =  Response.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
  //     }
  //   )
  // }


  showDifferenceFilterOnly = false;


  getProject() {
    this.http.get(environment.mainApi + this.global.companyLink + 'getproject').subscribe(
      (Response: any) => {
        this.projectList = Response;
      }
    )
  }

  getReport(param: any) {
    if (this.projectID == 0 && param == 'project') {
      this.msg.WarnNotify('Select Project')
    } else {


      this.projectName = '';
      if (this.projectID != 0 && param == 'project') {
        this.projectName = this.projectList.find((e: any) => e.projectID == this.projectID).projectTitle;
      }

      this.app.startLoaderDark();
      this.http.get(environment.mainApi + this.global.accountLink + 'GetDayTransaction?FromDate=' + this.global.dateFormater(this.fromDate, '-') +
        '&ToDate=' + this.global.dateFormater(this.toDate, '-')).subscribe(
          (Response: any) => {
            this.tmpReportData = Response.map((e: any) => {
              e.debit = Math.round(e.debit);
              e.credit = Math.round(e.credit);
              return e;
            });
            if (param == 'all') {

              this.reportData = this.showDifferenceFilterOnly ? this.tmpReportData.filter((e: any) => e.debit !== e.credit) : this.tmpReportData;


            }

            if (param == 'project') {
              this.reportData = this.showDifferenceFilterOnly
                ? this.tmpReportData.filter((e: any) => e.debit !== e.credit)
                : this.tmpReportData.filter((e: any) => e.projectID == this.projectID);
            }

            this.app.stopLoaderDark();
          },
          (Error: any) => {
            this.msg.WarnNotify(Error);
            this.app.stopLoaderDark();
          }
        )
    }

  }



  onFilterChange(event: any) {
    if (event.checked) {
      this.reportData = this.tmpReportData.filter((e: any) => e.debit !== e.credit);
    } else {
      this.reportData = this.tmpReportData;
    }
  }




  ///////////////////////////////////////////////////

  PrintTable() {
    this.global.printData('#printRpt');

  }



  VoucherDetails(row: any) {
    this.dialogue.open(VoucherDetailsComponent, {
      width: "40%",
      data: row,
    }).afterClosed().subscribe(val => {

    })
  }



}

