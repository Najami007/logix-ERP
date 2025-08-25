import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-mnu-invoice-print',
  templateUrl: './mnu-invoice-print.component.html',
  styleUrls: ['./mnu-invoice-print.component.scss']
})
export class MnuInvoicePrintComponent {


  curDate = new Date();

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

  apiReq = environment.mainApi + this.global.manufacturingLink;

  constructor(
    private http: HttpClient,
    private global: GlobalDataModule,

  ) {

    this.global.getCompany().subscribe((data) => {
      this.CompanyNTN = data[0].ntn;
      this.CompanySTRN = data[0].strn;
      this.companyProfile = data;
      this.companyLogo = data[0].companyLogo1;
      this.CompanyMobile = data[0].companyMobile;
      this.companyPhone = data[0].companyPhone;
      this.companyAddress = data[0].companyAddress;
      this.companyName = data[0].companyName;
      this.logoHeight = data[0].logo1Height;
      this.logoWidth = data[0].logo1Width;
      this.companyPNTN = data[0].pntn;
      this.companyFTN = data[0].ftn;
      this.companyBankTitle = data[0].bankName;
      this.companyBankCode = data[0].bankCode;
      this.companyAccTitle = data[0].accTitle;
      this.companyAccNumber = data[0].accNumber;
      this.companyIBAN = data[0].iban;
      this.companyRegistrationNo = data[0].registrationNo;
      this.footerText = data[0].footerText;
    });
  }

  logoHeight: any = 0;
  logoWidth: any = 0;
  companyAddress: any = '';
  CompanyMobile: any = '';
  companyPhone:any = '';
  companyName: any = '';
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
  footerText: any = '';




  myCounterName = '';
  tmpInvBillNo = '';
  tmpInvDate = new Date();
  tmpDeliveryDate = new Date();
  tmpDeliveryTo = '';
  tmpDeliveryContactNo = '';
  tmpDeliveryAddress = '';
  tmpDeliveryRemarks = '';
  tmpShippingCompany = '';
  tmpCustomerName = '';
  myBillTotal = 0;
  myBillDiscount = 0;
  myNetTotal = 0;


  tableDataList: any = [];
  printChallan(orderNo: any) {
    this.http.get(this.apiReq + `GetOrderDetail?BillNo=${orderNo}`).subscribe(
      {
        next: (Response: any) => {
          this.tableDataList = [];
          if (Response.length > 0) {
            Response.forEach((e: any) => {
              this.tableDataList.push({
                mnuItemID: e.mnuItemID, productTitle: e.productTitle, quantity: e.quantity, costPrice: e.costPrice, salePrice: e.salePrice
              })
               this.myCounterName = Response[0].entryUser;
              this.tmpInvBillNo = Response[0].invBillNo;
              this.tmpInvDate = Response[0].invDate;
              this.tmpDeliveryDate = new Date(Response[0].deliveryDate);
              this.tmpDeliveryTo = Response[0].deliverTo;
              this.tmpDeliveryContactNo = Response[0].deliveryContactNo;
              this.tmpDeliveryAddress = Response[0].deliveryAddress;
              this.tmpDeliveryRemarks = Response[0].deliveryRemarks;
              this.tmpShippingCompany = Response[0].shpCmpName;
              this.tmpCustomerName = Response[0].partyName;

              this.myBillTotal = Response[0].billTotal;
              this.myBillDiscount = Response[0].billDiscount;
              this.myNetTotal = Response[0].netTotal;
            })


            setTimeout(() => {
              this.global.printData('#printSaleInv');
            }, 200);

          }


        },
        error: error => {
          console.log(error);
        }
      }
    )
  }

}
