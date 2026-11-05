import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { environment } from 'src/environments/environment.development';


@Component({
  selector: 'app-print-bill-token',
  templateUrl: './print-bill-token.component.html',
  styleUrls: ['./print-bill-token.component.scss']
})
export class PrintBillTokenComponent {


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

  apiReq = environment.mainApi + this.global.miningLink;

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
  companyPhone: any = '';
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
  myRemarks: any = '';

  myShippingCharges = 0;
  myLabourCharges = 0;
  myTransportCharges = 0;

  printDataList: any = [];

  tableDataList: any = [];
  tmpVehicleDetail:any = [];


  


  printInvoice(invBillNo: any): void {
    this.http.get<any[]>(
      this.apiReq + `PrintMiningBill?InvBillNo=${invBillNo}`
    ).subscribe({
      next: (response) => {
        console.log(response,'Print Data');
        this.tableDataList = [];
        this.printDataList = [];

        if (!response || response.length === 0) {
          console.warn('No invoice data found.');
          return;
        }

        const first = response[0];

        const tmpList: any = {
          myTransportCharges: first.transportCharges,
          myLabourCharges: first.labourCharges,

          myCounterName: first.entryUser,
          tmpInvBillNo: first.invBillNo,
          tmpInvDate: first.invDate,
          tmpDeliveryDate: first.deliveryDate
            ? new Date(first.deliveryDate)
            : null,
          tmpDeliveryTo: first.deliverTo,
          tmpDeliveryContactNo: first.deliveryContactNo,
          tmpDeliveryAddress: first.deliveryAddress,
          tmpDeliveryRemarks: first.deliveryRemarks,
          tmpShippingCompany: first.transportPartyName,
          tmpCustomerName: first.partyName,

          myBillTotal: first.billTotal,
          myBillDiscount: first.billDiscount,
          myNetTotal: first.netTotal,
          myRemarks: first.remarks,
          myApprovedStatus:first.approvedStatus,
          tmpVehicleDetail:first.vehicleDetail,

          tableDataList: response.map((e: any) => ({
            mnuItemID: e.mnuItemID,
            productTitle: e.productTitle,
            quantity: e.quantity,
            vehCapacity:e.vehCapacity,
            costPrice: e.costPrice,
            salePrice: e.salePrice
          }))
        };

        // Create three print copies.
        this.printDataList = Array.from(
          { length: 3 },
          () => ({
            ...tmpList,
            
            tableDataList: tmpList.tableDataList.map((item: any) => ({
              ...item
            }))
          })
        );

        console.log(this.printDataList, 'Print Data List');

        setTimeout(() => {
          this.global.printData('#printToken');
        }, 200);
      },
      error: (error) => {
        console.error('Error fetching mining bill:', error);
      }
    });
  }



}

