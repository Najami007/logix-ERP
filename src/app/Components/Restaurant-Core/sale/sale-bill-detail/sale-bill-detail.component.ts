import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-sale-bill-detail',
  templateUrl: './sale-bill-detail.component.html',
  styleUrls: ['./sale-bill-detail.component.scss']
})
export class SaleBillDetailComponent implements OnInit{


  constructor(
    private http:HttpClient,
    @Inject(MAT_DIALOG_DATA) public data : any,
    private dialogRef: MatDialogRef<SaleBillDetailComponent>,
    private global:GlobalDataModule,
    private msg:NotificationService,
    private dialogue:MatDialog
  ){}
  ngOnInit(): void {

    this.getDetails(this.data);
 
  }



  myPrintData: any = [];
  myInvoiceNo = '';
  mytableNo = '';
  myCounterName = '';
  myInvDate: Date = new Date();
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


  getDetails(item:any){
    this.myInvoiceNo = item.invBillNo;
    this.mytableNo = item.tableTitle;
    this.myInvDate = item.createdOn;
    this.myCounterName = item.entryUser;
    this.myOrderType = item.orderType;
    this.myOtherCharges = item.otherCharges;
    this.myRemarks = item.remarks;
    this.myCash = item.cashRec;
    this.myBank = item.netTotal - item.cashRec;
    this.myDiscount = item.billDiscount;
    this.myChange = item.change;
    this.myPaymentType = item.paymentType;
    this.http.get(environment.mainApi+this.global.restaurentLink+'PrintBill?BillNo='+item.invBillNo).subscribe(
      (Response:any)=>{
        this.myPrintData = Response;
        Response.forEach((e:any) => {
          this.mySubTotal += e.quantity * e.salePrice;
        });
      }
    )

  }



  closeDialog(){
    this.dialogRef.close()
  }

}

