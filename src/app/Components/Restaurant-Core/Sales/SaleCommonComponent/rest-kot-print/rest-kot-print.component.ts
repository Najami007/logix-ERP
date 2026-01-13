import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-rest-kot-print',
  templateUrl: './rest-kot-print.component.html',
  styleUrls: ['./rest-kot-print.component.scss']
})
export class RestKotPrintComponent {

  showCmpNameFeature: any = this.global.showCmpNameFeature;
  showOrderNo = this.global.showOrderNo;
  PrintKotAreawiseFeature = this.global.PrintKotAreawiseFeature;
  showKotRemarksFeature = this.global.showKotRemarksFeature;
   buzzerNoFeature = this.global.buzzerNoFeature;

  crudList: any = [];
  companyProfile: any = [];
  companyLogo: any = '';
  companyAddress: any = '';
  CompanyMobile: any = '';
  companyName: any = '';
  logoHeight: any = 100;
  logoWidth: any = 100;

  mobileMask = this.global.mobileMask;

  constructor(
    private http: HttpClient,
    private msg: NotificationService,

    public global: GlobalDataModule,
    private dialogue: MatDialog,
    private route: Router
  ) {
    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
      this.companyLogo = data[0].companyLogo1;
      this.CompanyMobile = data[0].companyMobile;
      this.companyAddress = data[0].companyAddress;
      this.companyName = data[0].companyName;
      this.logoHeight = data[0].logo1Height;
      this.logoWidth = data[0].logo1Width;

    });

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })



  }






  myCookingAreaTitle = '';
  myPrintData: any = [];
  myInvoiceNo = '';
  mytableNo = '';
  myCounterName = '';
  myInvDate: any = '';
  myInvTime: any = '';
  myOrderType = '';
  mySubTotal = 0;
  myNetTotal = 0;
  myOtherCharges = 0;
  myRemarks = '';
  myDiscount = 0;
  myCash = 0;
  myChange = 0;
  myBank = 0;
  myPaymentType = '';
  voidFlag = false;
  myTime: any;
  myCounter: any = '';
  myOrderNo = 0;
  myBuzzerNo = 0;


  printBill(invNo: any, voidFlag: any, isKOT: boolean = false, kotItems: any) {
    this.voidFlag = voidFlag;

    this.http.get(environment.mainApi + this.global.inventoryLink + 'PrintBill?BillNo=' + invNo).subscribe(
      (Response: any) => {

        // -------- Header Data (always from API) ----------
        this.myBuzzerNo  =  Response[0].buzzerNo;
        this.myInvoiceNo = Response[0].invBillNo;
        this.myInvDate = Response[0].invDate;
        this.myOrderType = Response[0].orderType;
        this.mySubTotal = Response[0].billTotal;
        this.myNetTotal = Response[0].netTotal;
        this.myOtherCharges = Response[0].otherCharges;
        this.myRemarks = Response[0].remarks;
        this.myCash = Response[0].cashRec;
        this.myDiscount = Response[0].billDiscount;
        this.myChange = Response[0].change;
        this.myPaymentType = Response[0].paymentType;
        this.mytableNo = Response[0].tableTitle;
        this.myCounterName = Response[0].entryUser;
        this.myInvTime = new Date();
        this.myOrderNo = Response[0].orderNo;

        // If KOT → myPrintData already set in printKOT



        this.myPrintData = kotItems;
        this.myCookingAreaTitle = kotItems[0].cookingAriaTitle;
        setTimeout(() => {
          this.global.printData('#printKOT');
        }, 1);
      }
    );
  }



  EmptyBill() {
    this.myPrintData = [];
    this.myInvoiceNo = '';
    this.mytableNo = '';
    this.myCounterName = '';
    this.myInvDate = '';
    this.myInvTime = '';
    this.myOrderType = '';
    this.mySubTotal = 0;
    this.myNetTotal = 0;
    this.myOtherCharges = 0;
    this.myRemarks = '';
    this.myDiscount = 0;
    this.myCash = 0;
    this.myChange = 0;
    this.myBank = 0;
    this.myPaymentType = '';
    this.voidFlag = false;
    this.myTime;
    this.myCounter = '';
  }

}

