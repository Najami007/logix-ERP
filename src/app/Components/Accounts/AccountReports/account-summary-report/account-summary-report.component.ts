import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-account-summary-report',
  templateUrl: './account-summary-report.component.html',
  styleUrls: ['./account-summary-report.component.scss']
})
export class AccountSummaryReportComponent implements OnInit {



  crudList: any = { c: true, r: true, u: true, d: true };

  companyProfile: any = [];



  constructor(private globalData: GlobalDataModule,
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    private route: Router,
    private datePipe: DatePipe

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
    this.globalData.getCompany();
    this.getProject();
    this.globalData.setHeaderTitle('Account Summary Report');

    this.getNotes();


  }
  rptType = '';

  fromDate: any = new Date();
  toDate: any = new Date();
  DataList: any = [];

  debitTotal: any = 0;
  creditTotal: any = 0;

  notesList: any = [];

  projectSearch: any;

  projectID: number = 0;
  projectName: any;
  projectList: any = [];


  getProject() {

    this.globalData.getProjectList().subscribe((data: any) => { this.projectList = data; });

  }


  getReport(param: any) {

    if (param === 'project' && this.projectID === 0) {
      this.msg.WarnNotify('Select Project');
      return;
    }


    this.projectName =
      this.projectList.find((e: any) => e.projectID === this.projectID)?.projectTitle || '';

    this.rptType = 'summary1';

    this.rptType = 'summary1';
    this.DataList = [];
    this.debitTotal = 0;
    this.creditTotal = 0;

    const fromDate = this.globalData.dateFormater(this.fromDate, '-');
    const toDate = this.globalData.dateFormater(this.toDate, '-');

    this.http.get(`${environment.mainApi}${this.globalData.accountLink}GetTrailBalanceRpt?fromdate=${fromDate}&todate=${toDate}&projectID=${this.projectID}`).subscribe(
      (Response: any) => {
        if (!Response || Response.length === 0) {
          this.globalData.popupAlert('Data Not Found!');
          this.app.stopLoaderDark();
          return;
        }
        this.DataList = Response
          .filter(item => item.debit > 0 || item.credit > 0)
          .sort((a, b) => a.coaTypeID - b.coaTypeID);
        for (var i = 0; i < this.DataList.length; i++) {
          this.debitTotal += this.DataList[i].debit;
          this.creditTotal += this.DataList[i].credit;
        }

        this.app.stopLoaderDark();
      },
      (Error) => {
        this.app.stopLoaderDark();
        this.msg.WarnNotify('Error Occured')
      }
    )





  }



  getTotal(note: any) {

    this.debitTotal = 0;
    this.creditTotal = 0;
  }




  ///////////////////////////// will get the notes list

  getNotes() {
    this.notesList = [];
    this.http.get(environment.mainApi + this.globalData.accountLink + 'GetNote').subscribe(
      (Response: any) => {
        Response.forEach((e: any) => {
          this.notesList.push({ noteID: e.noteID, noteTitle: e.noteTitle, coaTypeID: e.coaTypeID, debitTotal: 0, creditTotal: 0, })
        });

        this.notesList.push({ noteID: 0.2, noteTitle: 'Expense', coaTypeID: 2, debitTotal: 0, creditTotal: 0 },
          { noteID: 0.3, noteTitle: 'Income', coaTypeID: 3, debitTotal: 0, creditTotal: 0 })


      }

    )
  }




  PrintTable() {

    this.globalData.printData('#printReport');

  }

  export() {
    if (this.rptType != '') {
      var startDate = this.datePipe.transform(this.fromDate, 'dd/MM/yyyy');
      var endDate = this.datePipe.transform(this.toDate, 'dd/MM/yyyy');
      this.globalData.ExportHTMLTabletoExcel(this.rptType, 'Account Summary' + '(' + startDate + ' - ' + endDate + ')');
    }
  }

}

