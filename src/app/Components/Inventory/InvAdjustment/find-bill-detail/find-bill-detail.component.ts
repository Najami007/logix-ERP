import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-find-bill-detail',
  templateUrl: './find-bill-detail.component.html',
  styleUrls: ['./find-bill-detail.component.scss']
})
export class FindBillDetailComponent implements OnInit {

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
  showLogixDetailFeature = this.global.showLogixDetailFeature;

  companyProfile: any = [];
  crudList: any = { c: true, r: true, u: true, d: true };
  constructor(private http: HttpClient,
    private msg: NotificationService,
    private dialogue: MatDialog,
    public global: GlobalDataModule,
    private app: AppComponent,
    private route: Router

  ) {


    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    });

    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
    });

  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Find Bill Detail')
    this.getReportTypes();
  }

  tmpRptType: any = 'S';
  reportsList: any = [];
  invBillNo: any = '';

  getReportTypes() {
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetInvoiceTypes_15').subscribe(
      (Response: any) => {
        this.reportsList = Response;
      }
    )
  }


  billDetail: any = [];


  findBill() {

    if (this.tmpRptType == 'S') {
      this.findSaleBill(this.invBillNo)
    }

  }



  myPrintTableData: any = [];
  myInvoiceNo = '';
  mytableNo = '';
  myCounterName = '';
  myCustomerName = '';
  myInvDate: any = new Date();
  myCreatedDate: any = new Date();
  myOrderType = '';
  mySubTotal = 0;
  myNetTotal = 0;
  myOtherCharges = 0;
  myRemarks = '';
  myDiscount = 0;
  myCash = 0;
  myChange = 0;
  myBank = 0;
  myCusBalance = 0;
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

  myCusDiscAmount: any = 0;

  myVehicleNo = '';
  myMeterReading = '';
  myVehicleName = '';
  partyNtn = '';

  findSaleBill(InvNo: any) {
    this.app.startLoaderDark();
    this.http.get(environment.mainApi + this.global.inventoryLink + 'PrintBill?BillNo=' + InvNo).subscribe(
      (Response: any) => {
        console.log(Response);
        if (Response == null) {
          this.global.popupAlert('Data Not Found!');
          this.app.stopLoaderDark();
          return;
        }
        if (Response.length == 0 ) {
          this.global.popupAlert('Data Not Found!');
          this.app.stopLoaderDark();
          return;
        }

        console.log(Response);
        this.myPrintTableData = Response;
        this.myInvoiceNo = InvNo;
        this.myInvDate = Response[0].invDate;
        this.myCreatedDate = Response[0].createdOn;
        this.myCounterName = Response[0].entryUser;
        this.mySubTotal = Response[0].billTotal;
        this.myNetTotal = Response[0].netTotal;
        this.myOtherCharges = Response[0].otherCharges;
        this.myRemarks = Response[0].remarks;
        this.myCash = Response[0].cashRec;
        this.myBank = Response[0].invType == 'S' ? Response[0].bankCash : -1 * Response[0].bankCash; //Response[0].netTotal - Response[0].cashRec;
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
        this.myCusBalance = Response[0].cusBalance;
        this.myVehicleNo = Response[0].vehicleNo;
        this.myMeterReading = Response[0].meterReading;
        this.myVehicleName = Response[0].vehicleName;
        this.partyNtn = Response[0].ntn;
        this.myInvTime = new Date();


        this.myQtyTotal = 0;
        this.myOfferDiscount = 0;
        this.myGstTotal = 0;
        this.myCusDiscAmount = 0;
        Response.forEach((e: any) => {
          this.myQtyTotal += e.quantity;
          this.myOfferDiscount += e.discInR * e.quantity;
          this.myGstTotal += (e.salePrice - (e.salePrice / ((e.gst + 100) / 100))) * e.quantity;
          this.myCusDiscAmount += e.cusDiscAmount * e.quantity;
        });

        this.app.stopLoaderDark();
      },
      (Error: any) => {
        console.log(Error);
        this.app.stopLoaderDark();
      }
    )

  }



  reset() {

  }

}
