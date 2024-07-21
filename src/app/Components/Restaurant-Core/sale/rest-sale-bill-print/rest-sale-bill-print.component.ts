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
  selector: 'app-rest-sale-bill-print',
  templateUrl: './rest-sale-bill-print.component.html',
  styleUrls: ['./rest-sale-bill-print.component.scss']
})
export class RestSaleBillPrintComponent {



  crudList: any = [];
  companyProfile: any = [];
  companyLogo: any = '';
  companyAddress: any = '';
  CompanyMobile: any = '';
  companyName: any = '';

  mobileMask = this.global.mobileMask;

  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
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
    });

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })


  
  }







  myPrintData: any = [];
  myInvoiceNo = '';
  mytableNo = '';
  myCounterName = '';
  myInvDate: any = '';
  myInvTime:any = '';
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
  myTime:any;
  myCounter:any = '';



  printBill(invNo: any) {
    this.myDuplicateFlag = false;
   
      this.http.get(environment.mainApi+this.global.inventoryLink+'PrintBill?BillNo='+invNo).subscribe(
        (Response:any)=>{
         
          this.myInvoiceNo = Response[0].invBillNo;
          this.myInvDate = Response[0].invDate;
          this.myOrderType =Response[0].orderType;
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
          
          if(this.myPaymentType == 'Bank'){
            this.myBank = this.myNetTotal;
          }
          if(this.myPaymentType == 'Split'){
            this.myBank = this.myNetTotal - this.myCash;
          }

          this.myPrintData =Response;
          setTimeout(() => {
            this.global.printData('#print-bill');
          }, 500);
        }
      )

  }

}
