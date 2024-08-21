import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';

import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';


@Component({
  selector: 'app-sale-bill-print',
  templateUrl: './sale-bill-print.component.html',
  styleUrls: ['./sale-bill-print.component.scss']
})
export class SaleBillPrintComponent implements OnInit {

  discFeature = this.global.getFeature('disc');
  BookerFeature = this.global.getFeature('bkr');
  showCompanyName = this.global.getFeature('cmpName');
  showCompanyLogo = this.global.getFeature('cmpLogo');

  companyProfile: any = [];
  companyLogo: any = '';
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

  billType:any = '';

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
  myPaymentType = '';
  myDuplicateFlag = false;
  myTime: any;
  myQtyTotal = 0;
  myOfferDiscount=0;
  myBookerName = '';
  myInvType ='';

  PrintBill(InvNo: any) {

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
         

        this.myQtyTotal = 0;
        this.myOfferDiscount=0;
        Response.forEach((e: any) => {
          this.myQtyTotal += e.quantity;
          this.myOfferDiscount += e.discInR * e.quantity;
        });

        setTimeout(() => {
          this.global.printData('#billPrint');
        }, 2000);
        // setTimeout(() => {
        //   this.global.printData('#cncBillPrint');
        //   this.global.printData('#cncBillPrint2');
        // }, 2000);

      }
    )



  }


  emptyBill(){
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
    this.myOfferDiscount=0;
    this.myBookerName = '';
    this.myInvType ='';
  }


}

