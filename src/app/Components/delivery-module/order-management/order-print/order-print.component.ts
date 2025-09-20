import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-order-print',
  templateUrl: './order-print.component.html',
  styleUrls: ['./order-print.component.scss']
})
export class OrderPrintComponent implements OnInit {
  apiReq = environment.mainApi + this.global.mobileLink;

  
  billPrintType: any = '';;
  companyProfile: any = [];
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
  footerText:any ='';

  logoHeight: any = 0;
  logoWidth: any = 0;
  companyAddress: any = '';
  CompanyMobile: any = '';
  companyName: any = '';
  crudList: any = { c: true, r: true, u: true, d: true };



  
  discFeature = this.global.discFeature;
  BookerFeature = this.global.BookerFeature;
  showCompanyName = this.global.showCmpNameFeature;
  showCompanyLogo = this.global.showCompanyLogo;
  gstFeature = this.global.gstFeature;
  prodDetailFeature = this.global.prodDetailFeature;
  FBRFeature = this.global.FBRFeature;
  printKotFeature = this.global.printKot;
  billFormate1 = this.global.BillFormate1Feature;
  billFormate2 = this.global.BillFormate2Feature;
  VehicleSaleFeature = this.global.VehicleSaleFeature;
  northEdgeEnterPriseBillFeature = this.global.northEdgeEnterPriseBillFeature;
    CusDiscFeature = this.global.CusDiscFeature;


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
  ngOnInit(): void {
    
  }

  tmp


  
  tmpOrderRow: any = [];
  SingleOrderDetail: any = [];

  OrderDetailTotal = 0;


  getSingleOrderDetail(item: any) {
    this.tmpOrderRow = item;

    var url = `${this.apiReq}GetSingleOrderDetail?OrderNo=${item.orderNo}`
    this.http.get(url).subscribe(
      {
        next: (Response: any) => {
          this.SingleOrderDetail = Response;
          this.OrderDetailTotal = 0;
          if (this.SingleOrderDetail.length > 0) {
            this.SingleOrderDetail.forEach((e: any) => {
              this.OrderDetailTotal += e.salePrice * e.quantity;
            });

          }

          setTimeout(() => {
            this.global.printData('#PrintOrder')
          }, 200);

        },
        error: error => {
          console.log(error);
        }
      }
    )

  }

}
