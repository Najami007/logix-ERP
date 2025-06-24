import { animate } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { DatePipe, formatDate } from '@angular/common';
import { CircleProgressOptions } from 'ng-circle-progress';
import { AppComponent } from 'src/app/app.component';
import { Subscription } from 'rxjs';
import { TopNavBarComponent } from 'src/app/Components/Layout/top-nav-bar/top-nav-bar.component';
import { MatDialog } from '@angular/material/dialog';
import { VoucherDetailsComponent } from '../../CommonComponent/voucher-details/voucher-details.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss']
})
export class LedgerComponent {


  date = new FormControl(new Date());

  CoaList: any;
  crudList: any = { c: true, r: true, u: true, d: true };
  companyProfile: any = [];




  constructor(public globalData: GlobalDataModule,
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    private dialogue: MatDialog,
    private route: Router,
    private datePipe:DatePipe

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

    this.globalData.setHeaderTitle('Ledger');
    this.getProject();


    this.getCoa();


  }

  projectSearch: any;
  coaID: any;
  projectID: number = 0;
  projectName: any;
  startDate = new Date();
  EndDate = new Date();
  debitTotal = 0;
  creditTotal = 0;
  curCOATitle: any;





  tableData: any = [];
  placholder = 'Search...';
  txtSearch = '';
  curDate = new Date();




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

  projectList: any = [];

  getProject() {

    this.globalData.getProjectList().subscribe((data: any) => { this.projectList = data; });

  }


  sortData(type: any) {

    if (type == 'date') {
      this.tableData.sort((a: any, b: any) => a.invoiceDate - b.invoiceDate);
    }

    if (type == 'invNo') {

      this.tableData.sort((a: any, b: any) => a.voucherNo - b.voucherNo);
      //a.voucherNo - b.voucherNo
    }

  }


  ////////////////////////getting total of debit and credit Sides///////////



  getTotal() {
    this.debitTotal = 0;
    this.creditTotal = 0;
    for (var i = 0; i < this.tableData.length; i++) {
      this.debitTotal += this.tableData[i].debit;
      this.creditTotal += this.tableData[i].credit;
    }
  }


  PrintTable() {
    this.globalData.printData('#printRpt');

  }


  /////////////////////////////////////////////


  onCoaChange() {
    //  this.CoaList[this.CoaList.length].index + 1;
    var index = this.CoaList.findIndex((e: any) => e.coaID == this.coaID);
    this.CoaList[index].indexNo = this.CoaList[0].indexNo + 1;
    this.CoaList.sort((a: any, b: any) => b.indexNo - a.indexNo);
  }

  getCoa() {
    this.app.startLoaderDark();
    this.http.get(environment.mainApi + this.globalData.accountLink + 'GetVoucherCOA').subscribe(
      (Response: any) => {
        // console.log(Response);
        if (Response.length > 0) {
          this.CoaList = Response.map((e: any, index: any) => {
            (e.indexNo = index + 1);
            return e;
          })

          this.CoaList.sort((a: any, b: any) => b.indexNo - a.indexNo);
        }
        this.app.stopLoaderDark();
      }
    )
  }



  ///////////////////////////////////////////////////////
  tmpTableData:any = [];

  getLedgerReport(param: any) {

    if (this.coaID == '' || this.coaID == undefined) {
      this.msg.WarnNotify('Select Chart Of Account Title')
    } else if ((this.projectID == 0 || this.projectID == undefined) && param == 'project') {
      this.msg.WarnNotify('Select Project')
    } else {
      this.app.startLoaderDark();
      this.projectName = '';
      if (param == 'all') {

        this.projectID = 0;
      }
      if (this.projectID != 0) {
        this.projectName = this.projectList.find((e: any) => e.projectID == this.projectID).projectTitle;
      }

      /////////////////// finding the coaTitle from coalist by coaID////////
      var curRow = this.CoaList.find((e: any) => e.coaID == this.coaID);

      this.curCOATitle = curRow.coaTitle;
      /////////////////////////////////////////////////


      this.http.get(environment.mainApi + this.globalData.accountLink + 'GetLedgerRpt?coaid=' + this.coaID + '&fromdate='
        + this.globalData.dateFormater(this.startDate, '-') + '&todate=' + this.globalData.dateFormater(this.EndDate, '-') + '&projectID=' + this.projectID).subscribe(
          (Response: any) => {
            console.log(Response);

            this.tableData = Response.map((e: any) => {
              (e.invoiceDate = new Date(e.invoiceDate));
              return e;
            }

            );
            this.tmpTableData = this.tableData;
            //console.log(this.tableData );
            this.getTotal();
            this.app.stopLoaderDark();
          },
          (Error:any)=>{
            console.log(Error);
             this.app.stopLoaderDark();
          }

        )
    }



  }




  ///////////////////////////////////////////////////




  /////////////////////////////////////////////




  VoucherDetails(row: any) {

    this.dialogue.open(VoucherDetailsComponent, { width: "40%", data: row, }).afterClosed().subscribe(val => { });
  }


  export() {
    var startDate = this.datePipe.transform(this.startDate,'dd/MM/yyyy');
    var endDate = this.datePipe.transform(this.EndDate,'dd/MM/yyyy');
    this.globalData.ExportHTMLTabletoExcel('printRpt','Ledger'+this.curCOATitle+'('+startDate+' - '+endDate+ ')')
  }

}
