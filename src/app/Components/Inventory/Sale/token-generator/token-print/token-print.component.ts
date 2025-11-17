import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
declare var $: any;
// import * as $ from 'jquery-qrcode';


@Component({
  selector: 'app-token-print',
  templateUrl: './token-print.component.html',
  styleUrls: ['./token-print.component.scss']
})
export class TokenPrintComponent {


  @ViewChild('qrCodeContainer', { static: true }) qrCodeContainer!: ElementRef;

  companyLogo: any = '';
  CompanyNTN = '';
  CompanySTRN = '';
  companyPNTN = '';
  companyFTN = '';
  companyBankTitle = '';
  companyBankCode = '';
  companyAccTitle = '';
  companyAccNumber = '';
  companyIBAN = '';
  companyRegistrationNo = '';
  footerText: any = '';

   logoHeight: any = 0;
  logoWidth: any = 0;
  companyAddress: any = '';
  CompanyMobile: any = '';
  companyName: any = '';

  companyProfile: any = [];
  constructor(private http: HttpClient,
    private msg: NotificationService,
    private dialogue: MatDialog,
    private globaldata: GlobalDataModule,

  ) {


    this.globaldata.getCompany().subscribe((data) => {
      this.companyProfile = data;
      this.CompanyNTN = data[0].ntn;
      this.CompanySTRN = data[0].strn;
      this.companyProfile = data;
      this.companyLogo = data[0].companyLogo1;
      this.CompanyMobile = data[0].companyMobile;
      this.companyAddress = data[0].companyAddress;
      this.companyName = data[0].companyName;
      this.logoHeight = data[0].logo1Height;
      this.logoWidth = data[0].logo1Width;
      this.companyPNTN = data[0].pntn;
      this.companyFTN = data[0].ftn;
      this.companyBankTitle =data[0].bankName;
      this.companyBankCode =data[0].bankCode;
      this.companyAccTitle = data[0].accTitle;
      this.companyAccNumber = data[0].accNumber;
      this.companyIBAN = data[0].iban;
      this.companyRegistrationNo = data[0].registrationNo;
      this.footerText = data[0].footerText;
    });

  }



  dataRow: any = [];

  myTokenNo: any = []


  printToken(item: any) {
    this.dataRow = item;
    setTimeout(() => {
      this.generateQRCode();
    }, 100);
    setTimeout(() => {
      this.globaldata.printData('#printToken');
    }, 200);
  }



  generateQRCode(): void {

    // $('#qrCode').empty();
    //   $('#qrCode').qrcode({
    //     text: this.myFbrInvoiceNo || 'N/A',
    //     width: 100,
    //     height: 100
    //   });

    $('#outputToken').qrcode({
      text: '123456' ,// this.myTokenNo || 'N/A',
    });
    var canvas = $('#outputToken canvas');
    // const element = $('#output')[0];
    var img = $(canvas)[0].toDataURL("image/png");
    $('#outputToken').empty();
    $('.qr-code-generator-token').empty();
    $('.qr-code-generator-token').prepend('<img src="' + img + '" width="65" height="65" />')


  }

}
