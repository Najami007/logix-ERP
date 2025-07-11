import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

import * as $ from 'jquery';
import { MatDialog } from '@angular/material/dialog';
import { VoucherDetailsComponent } from '../../CommonComponent/voucher-details/voucher-details.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cashbook',
  templateUrl: './cashbook.component.html',
  styleUrls: ['./cashbook.component.scss']
})
export class CashbookComponent implements OnInit {
  companyProfile: any = [];
  crudList: any = { c: true, r: true, u: true, d: true };

  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    private globalData: GlobalDataModule,
    private dialogue: MatDialog,
    private route: Router
  ) {

    this.globalData.getCompany().subscribe((data) => {
      this.companyProfile = data;
    });

    this.globalData.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })

  }


  ngOnInit(): void {
    $('.cashSummary').hide();

    this.globalData.setHeaderTitle('cash Book');
    this.getProject();
  }



  fromDate: Date = new Date();
  toDate: Date = new Date();


  tableData: any;

  cashSummary: any;
  DebitTotal: any = 0;
  creditTotal: any = 0;


  //////////////// print Variables/////////////////////

  lblInvoiceNo: any;
  lblInvoiceDate: any;
  lblRemarks: any;
  lblVoucherType: any;
  lblVoucherTable: any;
  lblDebitTotal: any;
  lblCreditTotal: any;
  lblVoucherPrintDate = new Date();
  invoiceDetails: any;

  projectSearch: any;
  projectName: any;
  projectID: number = 0;
  projectList: any = [];





  //  getCrud(){
  //   this.http.get(environment.mainApi+'user/getusermenu?userid='+this.globalData.getUserID()+'&moduleid='+this.globalData.getModuleID()).subscribe(
  //     (Response:any)=>{
  //       this.crudList =  Response.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
  //     }
  //   )
  // }



  getProject() {

    this.globalData.getProjectList().subscribe((data: any) => { this.projectList = data; });

  }


  getTotal() {
    this.DebitTotal = 0;
    this.creditTotal = 0;

    this.tableData.forEach((e: any) => {

      this.DebitTotal += e.debit;
      this.creditTotal += e.credit;

    });



  }

  /////////////////////////////////////////////////////////////////
  getDetailReport(param: any) {

    this.tableData = [];
    this.app.startLoaderDark();
    this.projectName = '';
    if (this.projectID != 0) {
      this.projectName = this.projectList.find((e: any) => e.projectID == this.projectID).projectTitle;
    }




    $('#CashBookDetail').show();
    $('.cashSummary').hide();
    this.tableData = [];
    this.DebitTotal = 0;
    this.creditTotal = 0;

    this.http.get(environment.mainApi + this.globalData.accountLink + 'GetCashBookDetailRpt?fromdate=' + this.globalData.dateFormater(this.fromDate, '-') +
      '&todate=' + this.globalData.dateFormater(this.toDate, '-') + '&projectid=' + this.projectID).subscribe(
        (Response: any) => {
          if (Response.length == 0 || Response == null) {
            this.globalData.popupAlert('Data Not Found!');
            this.app.stopLoaderDark();
            return;
          }
          this.tableData = Response;
          this.getTotal();
          this.app.stopLoaderDark();

        },
        (Error) => {
          this.msg.WarnNotify('Error Occured While Loading Report')
          this.app.stopLoaderDark();
          console.log(Error);
        }
      )



  }


  //////////////////////////////////////////////////
  getSummary() {
    this.app.startLoaderDark();

    // $('#CashBookDetail').css('visibility','hidden');
    $('#CashBookDetail').hide();
    $('.cashSummary').show();
    this.cashSummary = [];
    this.http.get(environment.mainApi + this.globalData.accountLink + 'GetCashBookSummaryRpt?fromdate=' + this.globalData.dateFormater(this.fromDate, '-') +
      '&todate=' + this.globalData.dateFormater(this.toDate, '-') + '&projectid=' + this.projectID).subscribe(
        (Response: any) => {
          if (Response.length == 0 || Response == null) {
            this.globalData.popupAlert('Data Not Found!');
            this.app.stopLoaderDark();
            return;
          }
          this.cashSummary = Response;
          this.app.stopLoaderDark();
        },
        (Error) => {
          this.msg.WarnNotify('Error Occured While Loading Report')
          this.app.stopLoaderDark();
        }
      )
  }


  ////////////////////////////////////////////////////
  print() {
    this.globalData.printData('#printRpt')
  }


  /////////////////////////////////////////////



  VoucherDetails(row: any) {
    this.dialogue.open(VoucherDetailsComponent, {
      width: "40%",
      data: row,
    }).afterClosed().subscribe(val => {

    })
  }
}
