import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-rest-sale-bill-print',
  templateUrl: './rest-sale-bill-print.component.html',
  styleUrls: ['./rest-sale-bill-print.component.scss']
})
export class RestSaleBillPrintComponent {



  showCmpNameFeature = this.global.showCmpNameFeature;
  waiterFeature = this.global.waiterFeature;
  showCompanyLogo = this.global.showCompanyLogo;
  gstFeature = this.global.gstFeature;
  FBRFeature = this.global.FBRFeature;
  showOrderNo = this.global.showOrderNo;
  customerFeature = this.global.customerFeature;
     buzzerNoFeature = this.global.buzzerNoFeature;

  crudList: any = [];
  companyProfile: any = [];
  companyLogo: any = '';
  companyAddress: any = '';
  CompanyMobile: any = '';
  companyName: any = '';
  logoHeight: any = 100;
  logoWidth: any = 100;
  CompanyNTN = '';
  CompanySTRN = '';

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
      this.CompanyNTN = data[0].ntn;
      this.CompanySTRN = data[0].strn;

    });

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })



  }






  cardGst = this.global.ResCardGst;
  cashGst = this.global.ResCashGst;

  myPrintData: any = [];
  myInvoiceNo = '';
  mytableNo = '';
  myCounterName = '';
  myInvDate: any = '';
  myInvTime: any = '';
  myOrderType = '';
  myGst = 0;
  mySubTotal = 0;
  myNetTotal = 0;
  myOtherCharges = 0;
  myRemarks = '';
  myDiscount = 0;
  myCash = 0;
  myChange = 0;
  myBank = 0;
  myPaymentType = '';
  myDuplicateFlag = false;
  myTime: any;
  myCounter: any = '';
  myOrderNo = 0;
  myGstAmount = 0;
  myGstValue = 0;
  type: any = '';
  myBookerName = '';
  myFbrStatus = false;
  myFbrCode = '';
  myFbrResponse = '';
  myPOSFee = 0;
  myFbrInvoiceNo = '';
  myPartyName = '';
  myPartyBalance = 0;
  myInvType = '';
  myBuzzerNo = 0;


  printBill(invNo: any) {
    this.EmptyBill();
    this.myDuplicateFlag = false;

    this.http.get(environment.mainApi + this.global.inventoryLink + 'PrintBill?BillNo=' + invNo).subscribe(
      (Response: any) => {
        this.myPrintData = Response;
        this.myInvoiceNo = Response[0].invBillNo;
        this.myInvDate = Response[0].invDate;
        this.myOrderType = Response[0].orderType;
        this.mySubTotal = Response[0].billTotal;
        this.myNetTotal = Response[0].netTotal;
        this.myOtherCharges = Response[0].otherCharges;
        this.myRemarks = Response[0].remarks;
        this.myCash = Response[0].cashRec;
        // this.myBank = Response[0].bankCash;
        this.myDiscount = Response[0].billDiscount;
        this.myChange = Response[0].change;
        this.myPaymentType = Response[0].paymentType;
        this.mytableNo = Response[0].tableTitle;
        this.myCounterName = Response[0].entryUser;
        this.myInvTime = Response[0].createdOn;
        this.myOrderNo = Response[0].orderNo;
        this.myBookerName = Response[0].bookerName;
        this.myGstAmount = Response[0].gstAmount;
        this.myGstValue = Response[0].gstValue;
        this.myFbrInvoiceNo = Response[0].fbrInvoiceNo;
        this.myFbrStatus = Response[0].fbrStatus;
        this.myPartyName = Response[0].partyName;
        this.myPartyBalance = Response[0].cusBalance;
        this.myInvType = Response[0].invType;
         this.myBuzzerNo  = Response[0].buzzerNo;


        if (this.myPaymentType == 'Bank') {
          this.myBank = this.myNetTotal;
        }
        if (this.myPaymentType == 'Split') {
          this.myBank = this.myNetTotal - this.myCash;
        }
        if (this.gstFeature) {
          this.generateQRCode();
        }

        setTimeout(() => {
          if (this.gstFeature) {
            this.global.printData('#printGSTRestBill');
          }
          if (!this.gstFeature) {
            this.global.printData('#printRestBill');
          }

        }, 200);

      }
    )

  }


  HOldandPrint(orderType: any, invoiceNo: any) {
    this.EmptyBill();
    this.type = 'hold';
    this.myOrderType = orderType;
    this.myInvoiceNo = invoiceNo;
    this.http.get(environment.mainApi + this.global.restaurentLink + 'GetHoldedBillDetail?BillNo=' + invoiceNo).subscribe(
      (Response: any) => {
        this.myPrintData = Response;

        this.mytableNo = Response[0].tableTitle;
        this.myCounterName = Response[0].entryUser;
        this.myInvTime = Response[0].createdOn;
        this.myInvDate = Response[0].invDate;
        // this.myOrderType = Response[0].orderType;
        this.myOtherCharges = Response[0].otherCharges;
        this.myRemarks = Response[0].remarks;
        this.myOrderNo = Response[0].orderNo;
        this.myBookerName = Response[0].bookerName;
        this.myInvType = Response[0].invType;
        this.myGstAmount = 0;
        this.myGstValue = 0;
        this.myFbrInvoiceNo = '';
        this.myFbrStatus = false;

        this.mySubTotal = 0;
        Response.forEach((e: any) => {
          this.mySubTotal += e.salePrice * e.quantity;
        });

        setTimeout(() => {
          if (this.gstFeature) {
            this.global.printData('#printGSTRestBill');
          }
          if (!this.gstFeature) {
            this.global.printData('#printRestBill');
          }

          this.type = '';
        }, 200);

      })

    this.myDuplicateFlag = false;


  }

  generateQRCode(): void {

    // $('#qrCode').empty();
    //   $('#qrCode').qrcode({
    //     text: this.myFbrInvoiceNo || 'N/A',
    //     width: 100,
    //     height: 100
    //   });

    $('#output').qrcode({
      text: this.myFbrInvoiceNo || 'N/A',
    });
    var canvas = $('#output canvas');
    // const element = $('#output')[0];
    var img = $(canvas)[0].toDataURL("image/png");
    $('#output').empty();
    $('.qr-code-generator').empty();
    $('.qr-code-generator').prepend('<img src="' + img + '" width="80" height="80" />')

    // // var img = canvas.get(0).toDataURL("image/png");
    // html2canvas(element).then((canvas) => {
    //   // Convert the canvas to a data URL (base64)
    //   const imageData = canvas.toDataURL('image/png');

    //   // Set the image source to the generated data URL
    //   // $('#output').attr('src', imageData);
    //   $('#output').empty();
    //   $('#qrCode').empty();
    //   $('#qrCode').prepend('<img src="' + imageData + '" width="90" height="90" />')

    // }).catch((error) => {
    //   console.error('Error generating image:', error);
    // });
    // //or

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
    this.myDuplicateFlag = false;
    this.myTime;
    this.myCounter = '';
    this.type = '';
    this.myBookerName = '';
  }

}



