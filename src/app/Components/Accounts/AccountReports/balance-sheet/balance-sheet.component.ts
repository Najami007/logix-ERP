import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import * as $ from 'jquery';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.scss']
})
export class BalanceSheetComponent implements OnInit {




  companyProfile: any = [];
  crudList: any = { c: true, r: true, u: true, d: true };


  constructor(private globalData: GlobalDataModule,
    private http: HttpClient,
    private app: AppComponent,
    private msg: NotificationService,
    private route: Router,
    private datePipe: DatePipe
  ) {

    this.globalData.getCompany().subscribe((data) => {
      this.companyProfile = data;
    });

    this.globalData.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })

  }
  ngOnInit(): void {

    this.globalData.setHeaderTitle('Balance Sheet');
    this.getProject();

  }

  rptType = 'balanceSheet1';

  toDate = new Date();


  BsData: any;

  assetList: any = [];
  liabilityList: any = [];
  capitalList: any = [];
  accumulatedPL: any = [];

  currentYear: any = 0;
  previousYear: any = 0;

  assetTotal: any = 0;
  liabilityTotal: any = 0;
  capitalTotal: any = 0;
  accumulatedTotal: any = 0;

  oAssetTotal: any = 0;
  oLiabilityTotal: any = 0;
  oCapitalTotal: any = 0;
  oAccumulatedTotal: any = 0;


  ////////////////////////////////////////////////////////////////////
  balanceSheetTypeID: any = 1;
  formateId = 1;
  projectSearch: any;
  projectID: number = 0;
  projectName: any;
  projectList: any = [];

  // getCrud(){
  //   this.http.get(environment.mainApi+'user/getusermenu?userid='+this.globalData.getUserID()+'&moduleid='+this.globalData.getModuleID()).subscribe(
  //     (Response:any)=>{
  //       this.crudList =  Response.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
  //     }
  //   )
  // }



  getProject() {

    this.globalData.getProjectList().subscribe((data: any) => { this.projectList = data; });

  }



  PrintTable() {
    this.globalData.printData('#printRpt');
  }

  getBalanceSheet(param: any) {


    this.projectName = '';
    var projectID = this.projectID;
    this.projectName = projectID > 0 ? this.projectList.find((e: any) => e.projectID == this.projectID).projectTitle : '';



    this.currentYear = this.getYear();
    this.previousYear = this.currentYear - 1

    var url = '';
    if (this.balanceSheetTypeID == 1) {
      url = `GetMainBalanceSheet?todate= ${this.globalData.dateFormater(this.toDate, '-')}&projectid=${projectID}`
    }
    if (this.balanceSheetTypeID == 2) {
      url = `GetMainBalanceSheet_2?todate= ${this.globalData.dateFormater(this.toDate, '-')}&projectid=${projectID}`
    }


    this.assetList = [];
    this.liabilityList = [];
    this.capitalList = [];
    this.accumulatedPL = [];
    this.assetTotal = 0;
    this.liabilityTotal = 0;
    this.capitalTotal = 0;
    this.accumulatedTotal = 0;
    this.oAssetTotal = 0;
    this.oLiabilityTotal = 0;
    this.oCapitalTotal = 0;
    this.oAccumulatedTotal = 0;

    this.app.startLoaderDark();
    this.http.get(environment.mainApi + this.globalData.accountLink + url).subscribe(
      (Response: any) => {
        if (Response.length == 0 || Response == null) {
          this.globalData.popupAlert('Data Not Found!');
          this.app.stopLoaderDark();
          return;
        }
        $('#printRpt').show();

        Response.forEach((e: any) => {


          if (e.coaTypeID == 1) {
            this.assetList.push(e);

            this.assetTotal += e.nTotal;
            this.oAssetTotal += e.oTotal;
          }

          if (e.coaTypeID == 4) {
            this.liabilityList.push(e);
            this.liabilityTotal += e.nTotal;
            this.oLiabilityTotal += e.oTotal;
          }
          if (e.coaTypeID == 5) {
            this.capitalList.push(e);
            this.capitalTotal += e.nTotal;
            this.oCapitalTotal += e.oTotal;
          }

          if (e.noteID == 0.2) {
            this.accumulatedTotal -= e.nTotal;
            this.oAccumulatedTotal -= e.oTotal;
          }

          if (e.noteID == 0.3) {
            this.accumulatedTotal += e.nTotal;
            this.oAccumulatedTotal += e.oTotal;
          }

        });

        if (this.formateId == 3) {
          this.getNoteLedger(projectID, 'all');
          return;
        }

        this.app.stopLoaderDark();
      },
      (Error: any) => {
        console.log(Error);
        this.app.stopLoaderDark();
      }
    )
  }




getNoteLedger(projectID: any, type: any, noteID = 0) {

  let url = '';

  if (type === 'all') {
    url = `GetNoteLedgerRpt?reqType=All&NoteID=1.01&todate=${this.globalData.dateFormater(this.toDate, '-')}&projectid=${projectID}`;
  }

  if (type === 'single') {
    url = `GetNoteLedgerRpt?reqType=Single&NoteID=${noteID}&todate=${this.globalData.dateFormater(this.toDate, '-')}&projectid=${projectID}`;
  }

  this.http.get(environment.mainApi + this.globalData.accountLink + url)
    .subscribe(
      (Response: any) => {
        Response.forEach((item: any) => {

          // ASSET
          const matchedAsset = this.assetList.find((a: any) => a.noteID == item.noteID);
          if (matchedAsset) {
            if (!matchedAsset.noteDetail) matchedAsset.noteDetail = [];
            matchedAsset.noteDetail.push(item);
          }

          // LIABILITY  (FIXED HERE)
          const matchedLiability = this.liabilityList.find((a: any) => a.noteID == item.noteID);
          if (matchedLiability) {
            if (!matchedLiability.noteDetail) matchedLiability.noteDetail = [];
            matchedLiability.noteDetail.push(item); // ← FIXED
          }

          // EQUITY
          const matchedEquity = this.capitalList.find((a: any) => a.noteID == item.noteID);
          if (matchedEquity) {
            if (!matchedEquity.noteDetail) matchedEquity.noteDetail = [];
            matchedEquity.noteDetail.push(item);
          }

        });

        this.app.stopLoaderDark();
      },

      (err: any) => {
        console.log(err);
        this.app.stopLoaderDark();
      }
    );
}



  getYear() {

    var year = new Date(this.toDate).getFullYear();
    var month = new Date(this.toDate).getMonth();
    if (month < 6) {
      return year - 1;
    } else {
      return year;
    }

  }





  export() {
    if (this.rptType != '') {
      var toDate = this.datePipe.transform(this.toDate, 'dd/MM/yyyy');
      this.globalData.ExportHTMLTabletoExcel(this.rptType, 'Balance Sheet ' + '(' + toDate + ')')
    }


    

  }




  reset(){
    this.assetList = [];
    this.liabilityList = [];
    this.capitalList = [];
    this.assetTotal = 0;
    this.capitalTotal= 0;
    this.liabilityTotal= 0;
    this.accumulatedTotal = 0;
    
  
  }




}