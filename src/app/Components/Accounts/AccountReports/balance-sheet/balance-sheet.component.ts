import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import * as $ from 'jquery';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { Router } from '@angular/router';

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
    private route: Router
  ) {

    // this.http.get(environment.mainApi+'cmp/getcompanyprofile').subscribe(
    //   (Response:any)=>{
    //     this.companyProfile = Response;
    //     //console.log(Response)  

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

    this.globalData.setHeaderTitle('Balance Sheet');
    this.getProject();
    setTimeout(() => {
      this.changeReport(this.rptType);
    }, 200);
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

    if (this.projectID == 0 && param == 'project') {
      this.msg.WarnNotify('Select Project')
    } else {
      this.projectName = '';

      if (param == 'all') {
        this.projectID = 0;
      }
      if (this.projectID != 0) {
        this.projectName = this.projectList.find((e: any) => e.projectID == this.projectID).projectTitle;
      }


      this.currentYear = this.getYear();

      this.previousYear = this.currentYear - 1

      this.http.get(environment.mainApi + this.globalData.accountLink + 'GetMainBalanceSheet?todate=' + this.globalData.dateFormater(this.toDate, '-') + '&projectid=' + this.projectID).subscribe(
        (Response: any) => {

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

          $('#printRpt').show();
          this.changeReport(this.rptType);

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


          }
          )
        }

      )
    }



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


  changeReport(type: any) {
    this.rptType = type;
    if (this.rptType == 'balanceSheet1') {
      $('#balanceSheet2').hide();
      $('#balanceSheet1').show();
    }
    if (this.rptType == 'balanceSheet2') {
      $('#balanceSheet1').hide();
      $('#balanceSheet2').show();
    }
  }


  export() {
    if (this.rptType != '') {
      this.globalData.ExportHTMLTabletoExcel(this.rptType, 'Balance Sheet ' + '(' + this.toDate.toLocaleDateString() + ')')
    }

  }









}