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
  selector: 'app-rtl-bill-print',
  templateUrl: './rtl-bill-print.component.html',
  styleUrls: ['./rtl-bill-print.component.scss']
})
export class RtlBillPrintComponent {



  companyProfile: any = [];
  companyLogo: any = '';
  logoHeight:any = 0;
  logoWidth:any = 0;
  companyAddress: any = '';
  CompanyMobile: any = '';
  companyName: any = '';
   crudList:any = {c:true,r:true,u:true,d:true};
   
  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    public global:GlobalDataModule,
    private dialogue:MatDialog,
    private app:AppComponent,
    private route:Router
  ){
    

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

  
  myPrintTableData: any = [];
  myInvoiceNo = '';
  mytableNo = '';
  myCounterName = '';
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
  myTime:any;
  myQtyTotal =0;
  PrintAfterSave(InvNo:any){
    

    this.http.get(environment.mainApi+this.global.inventoryLink+'PrintBill?BillNo='+InvNo).subscribe(
      (Response:any)=>{
       
        this.myPrintTableData = Response;
        this.myInvoiceNo = InvNo;
        this.myInvDate = Response[0].createdOn ;
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

        this.myQtyTotal = 0;
        Response.forEach((e:any) => {
            this.myQtyTotal += e.quantity;
        });

        setTimeout(() => {
          this.global.printData('#cncBillPrint');
        }, 2000);
     
      }
    )


  
  }

}
