import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Time } from 'highcharts';
import { DaterangepickerComponent } from 'ngx-daterangepicker-material';
import { env } from 'process';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';


declare const $: any;

@Component({
  selector: 'app-cashier-closing-rpt',
  templateUrl: './cashier-closing-rpt.component.html',
  styleUrls: ['./cashier-closing-rpt.component.scss']
})
export class CashierClosingRptComponent implements OnInit {

  FBRFeature = this.global.FBRFeature;

  companyProfile: any = [];
  crudList: any = { c: true, r: true, u: true, d: true };
  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    public global: GlobalDataModule,
    private route: Router

  ) {

    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
    });

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());

    })



  }
  pageTitle = '';
  ngOnInit(): void {
    this.global.setHeaderTitle('Cashier Closing');
    this.getUsers();


  }



  Date = new Date();

  ClosingDetail: any = [];
  userList: any = [];
  userID = 0;
  userName = '';
  roleTypeID = this.global.getRoleTypeID();


  getUsers() {

    this.global.getUserList().subscribe((data: any) => {
      if (this.roleTypeID == 3) {
        this.userList = data.filter((e: any) => e.userID == this.global.getUserID());
        this.userID = this.global.getUserID();
      } else {
        this.userList = data;
      }

    });

  }


  onUserSelected() {
    var curUser = this.userList.find((e: any) => e.userID == this.userID);
    this.userName = curUser.userName;
  }



  TotalSales = 0;
  totalSaleReturn = 0;
  totalServiceCharges = 0;
  totalCash = 0;
  totalCredit = 0;
  totalBank = 0;
  totalComplimentary = 0;
  totalDiscount = 0;
  totalHDCharges = 0;
  totalPosFee = 0;

  getReport(type: any) {

    var url = type == 'date' ? `GetDayClosingRpt_9?reqDate=${this.global.dateFormater(this.Date, '-')}` : 'GetCurrentOpenDayClosingRpt_14'
    this.app.startLoaderDark();
    this.TotalSales = 0
    this.totalSaleReturn = 0
    this.totalServiceCharges = 0
    this.totalCash = 0
    this.totalBank = 0
    this.totalComplimentary = 0
    this.totalDiscount = 0
    this.totalHDCharges = 0;
    this.totalCredit = 0;
    this.totalPosFee = 0;
    this.ClosingDetail = [];
    this.http.get(environment.mainApi + this.global.inventoryLink + url).subscribe(
      (Response: any) => {
        if (Response.length == 0 || Response == null) {
          this.global.popupAlert('Data Not Found!');
          this.app.stopLoaderDark();
          return;
        }
        this.getBankDetail(new Date(Response[0].dayOpenTime));
        if (this.userID > 0) {
          this.ClosingDetail = Response.filter((e: any) => e.userID == this.userID);
        } else {
          this.ClosingDetail = Response;

        }

        this.ClosingDetail.forEach((e: any) => {
          this.TotalSales += e.totalSale;
          this.totalSaleReturn += e.saleReturn;
          this.totalServiceCharges += e.servicesCharges;
          this.totalCash += e.cashIn - e.cashOut;
          this.totalBank += e.bank - e.bankReturn;
          this.totalComplimentary += e.complimentary;
          this.totalDiscount += e.discount - e.discountReturn;
          this.totalHDCharges += e.hdCharges;
          this.totalCredit += e.creditSale - e.creditSaleReturn;
          this.totalPosFee += e.posFee;
        });
        this.app.stopLoaderDark();
      },
      (Error:any)=>{
        console.log(Error);
        this.app.stopLoaderDark();
      }
    )
  }



  /////////////////////////////// Bank Detail Function  ////////////////
 BankDetail: any[] = [];
BankSummaryList: any[] = [];

getBankDetail(date: any): void {
  const formattedDate = this.global.dateFormater(date, '-');
  const url = `${environment.mainApi}${this.global.inventoryLink}GetBankSummaryRpt_10?reqDate=${formattedDate}`;

  this.http.get(url).subscribe((response: any) => {
    this.BankDetail = response || [];

    // Create a summary map to accumulate unique banks and their amounts
    const summaryMap = new Map<number, { coaID: number, coaTitle: string, amount: number }>();

    for (const item of this.BankDetail) {
      if (summaryMap.has(item.coaID)) {
        summaryMap.get(item.coaID)!.amount += item.debit - item.credit;
      } else {
        summaryMap.set(item.coaID, {
          coaID: item.coaID,
          coaTitle: item.coaTitle,
          amount: item.debit - item.credit
        });
      }
    }

    this.BankSummaryList = Array.from(summaryMap.values());
  });
}



  ////////////  filter Unique Values from an array ///////////////
  public filterUniqueValues<T>(array: T[]): T[] {
    const uniqueSet = new Set<string>();
    const uniqueArray: T[] = [];

    array.forEach((item: any) => {
      const key = JSON.stringify(item.coaID);
      if (!uniqueSet.has(key)) {
        uniqueSet.add(key);
        uniqueArray.push(item);
      }
    });

    return uniqueArray;
  }




  //////////////////////////////////////////////////////////////
  print() {
    this.global.printData('#PrintDiv')
  }


}

