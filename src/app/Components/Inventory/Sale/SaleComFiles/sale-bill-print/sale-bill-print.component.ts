import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
declare var $: any;
// import * as $ from 'jquery-qrcode';
import html2canvas from 'html2canvas';
import { KOTPrintComponent } from '../kotprint/kotprint.component';


@Component({
  selector: 'app-sale-bill-print',

  templateUrl: './sale-bill-print.component.html',
  styleUrls: ['./sale-bill-print.component.scss']
})
export class SaleBillPrintComponent implements OnInit {
  @ViewChild('qrCodeContainer', { static: true }) qrCodeContainer!: ElementRef;
  @ViewChild(KOTPrintComponent) kotPrint: any;

  discFeature = this.global.discFeature;
  BookerFeature = this.global.BookerFeature;
  showCompanyName = this.global.showCmpNameFeature;
  showCompanyLogo = this.global.showCompanyLogo;
  gstFeature = this.global.gstFeature;
  prodDetailFeature = this.global.prodDetailFeature;
  FBRFeature = this.global.FBRFeature;
  printKotFeature = this.global.printKot;



  billPrintType: any = '';;
  companyProfile: any = [];
  companyLogo: any = '';
  CompanyNTN = '';
  CompanySTRN = '';
  logoHeight: any = 0;
  logoWidth: any = 0;
  companyAddress: any = '';
  CompanyMobile: any = '';
  companyName: any = '';
  crudList: any = { c: true, r: true, u: true, d: true };
  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    public global: GlobalDataModule,
    private route: Router
  ) {


    this.global.getCompany().subscribe((data) => {
      this.CompanyNTN = data[0].ntn;
      this.CompanySTRN = data[0].strn;
      this.companyProfile = data;
      this.companyLogo = data[0].companyLogo1;
      this.CompanyMobile = data[0].companyMobile;
      this.companyAddress = data[0].companyAddress;
      this.companyName = data[0].companyName;
      this.logoHeight = data[0].logo1Height;
      this.logoWidth = data[0].logo1Width;
    });




  }

  ngOnInit(): void {


  }

  fastFoodCID = this.global.getFastFoodCID();
  fastFoodSCID = this.global.getFastFoodSCID();

  billType: any = '';

  myPrintTableData: any = [];
  myInvoiceNo = '';
  mytableNo = '';
  myCounterName = '';
  myCustomerName = '';
  myInvDate: any = new Date();
  myOrderType = '';
  mySubTotal = 0;
  myNetTotal = 0;
  myOtherCharges = 0;
  myRemarks = '';
  myDiscount = 0;
  myCash = 0;
  myChange = 0;
  myBank = 0;
  myBalanceData = 0;
  myPaymentType = '';
  myDuplicateFlag = false;
  myTime: any;
  myQtyTotal = 0;
  myOfferDiscount = 0;
  myBookerName = '';
  myInvType = '';
  myGstTotal = 0;
  myAdvTaxAmount = 0;
  myAdvTaxValue = 0;
  myProductDetail: any = [];
  myFbrInvoiceNo = '';
  myFbrStatus = false;
  myFbrCode = '';
  myFbrResponse = '';
  myPOSFee = 0;
  myInvTime = new Date();
  PrintBill(InvNo: any) {
    this.billPrintType = this.global.getBillPrintType();
    this.http.get(environment.mainApi + this.global.inventoryLink + 'PrintBill?BillNo=' + InvNo).subscribe(
      (Response: any) => {
        this.myPrintTableData = Response;


        this.myInvoiceNo = InvNo;
        this.myInvDate = Response[0].createdOn;
        this.myCounterName = Response[0].entryUser;
        this.mySubTotal = Response[0].billTotal;
        this.myNetTotal = Response[0].netTotal;
        this.myOtherCharges = Response[0].otherCharges;
        this.myRemarks = Response[0].remarks;
        this.myCash = Response[0].cashRec;
        this.myBank = Response[0].netTotal - Response[0].cashRec;
        this.myDiscount = Response[0].billDiscount;
        this.myChange = Response[0].change;
        this.myPaymentType = Response[0].paymentType;
        this.myCustomerName = Response[0].partyName;
        this.myBookerName = Response[0].bookerName;
        this.myInvType = Response[0].invType;
        this.myAdvTaxAmount = Response[0].advTaxAmount;
        this.myAdvTaxValue = Response[0].advTaxValue;
        this.myFbrInvoiceNo = Response[0].fbrInvoiceNo;
        this.myFbrStatus = Response[0].fbrStatus;
        this.myFbrCode = Response[0].fbrCode;
        this.myFbrResponse = Response[0].fbrResponse;
        this.myPOSFee = Response[0].posFee;
        this.myInvTime = new Date();


        this.myQtyTotal = 0;
        this.myOfferDiscount = 0;
        this.myGstTotal = 0;
        Response.forEach((e: any) => {
          this.myQtyTotal += e.quantity;
          this.myOfferDiscount += e.discInR * e.quantity;
          this.myGstTotal += (e.salePrice - (e.salePrice / ((e.gst + 100) / 100))) * e.quantity;
        });

        if (this.FBRFeature) {
          this.generateQRCode();
        }
        setTimeout(() => {
          if (this.billPrintType == 'english') {
            this.global.printBill('#billEnglish', '.searchProduct');
          }
          if (this.billPrintType == 'urdu') {
            this.global.printBill('#BillUrdu', '.searchProduct');
          }
          this.qrCodeContainer;


          if (this.printKotFeature) {
            var FastFoodProducts = Response.filter((e: any) => e.subCategoryID == this.fastFoodSCID);
            this.PrintPartialKot(FastFoodProducts);
            // this.kotPrint.PrintPartialKot(FastFoodProducts);
          }

        }, 100);






      }
    )

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

    //   console.log('Image generated:', imageData);
    // }).catch((error) => {
    //   console.error('Error generating image:', error);
    // });
    // //or

  }


  myPrintData: any = [];
  PrintPartialKot(data: any) {
    if (data.length > 0) {
      // data.forEach((e) => {
      //   this.myPrintData = [];
      //   this.myPrintData.push(e);
      //   console.log(this.myPrintData);
      //   this.global.printFastFoodKOT('#printKOT');  
      // });
      this.myPrintData = data;
      setTimeout(() => {
        this.global.printBill('#printKOT', '');
      }, 2);
    }

  }


  emptyBill() {
    this.billType = '';

    this.myPrintTableData = [];
    this.myInvoiceNo = '';
    this.mytableNo = '';
    this.myCounterName = '';
    this.myCustomerName = '';
    this.myInvDate = new Date();
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
    this.myTime = '';
    this.myQtyTotal = 0;
    this.myOfferDiscount = 0;
    this.myBookerName = '';
    this.myInvType = '';
  }


}

