
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, retry } from 'rxjs';
import { SaleBillDetailComponent } from 'src/app/Components/Restaurant-Core/Sales/sale1/sale-bill-detail/sale-bill-detail.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';


@Component({
  selector: 'app-rtl-saved-bill',
  templateUrl: './rtl-saved-bill.component.html',
  styleUrls: ['./rtl-saved-bill.component.scss']
})
export class RtlSavedBillComponent implements OnInit {

  companyProfile: any = [];
  companyLogo: any = '';
  logoHeight:any = 0;
  logoWidth:any = 0;
  companyAddress: any = '';
  CompanyMobile: any = '';
  companyName: any = '';
  constructor(
    private http:HttpClient,
    @Inject(MAT_DIALOG_DATA) public data : any,
    private dialogRef: MatDialogRef<RtlSavedBillComponent>,
    public global:GlobalDataModule,
    private msg:NotificationService,
    private dialogue:MatDialog
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
  ngOnInit(): void {
    this.getSavedBill();
  }


  savedbillList:any =[];


  




  public getBillDetail(billNo:any):Observable<any>{
    return this.http.get(environment.mainApi+this.global.inventoryLink+'GetSingleBillDetail?reqInvBillNo='+billNo).pipe(retry(3));
   }
 

  //////////////////////////////////////////////////////////////////////////////////
  
 
  

  getSavedBill(){

    this.http.get(environment.mainApi+this.global.inventoryLink+'GetOpenDaySale').subscribe(
      (Response:any)=>{
        this.savedbillList = [];
        Response.forEach((e:any) => {
          if(e.invType == 'S'){
            this.savedbillList.push(e);
          }
          
        });
       
      }
    )

  }




  myPrintData: any = [];
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


 



  printDuplicateBill(item:any){
    
    this.global.openPassword('Password').subscribe(pin => {
      if (pin !== '') {
        this.http.post(environment.mainApi + this.global.userLink + 'MatchPassword', {
          RestrictionCodeID: 5,
          Password: pin,
          UserID: this.global.getUserID()

        }).subscribe(
          (Response: any) => {
            if (Response.msg == 'Password Matched Successfully') {

              this.myInvoiceNo = item.invBillNo;
              this.mytableNo = item.tableTitle;
              this.myInvDate = item.createdOn ;
              this.myCounterName = item.entryUser;
              this.myOrderType = item.orderType;
              this.mySubTotal = item.billTotal;
              this.myNetTotal = item.netTotal;
              this.myOtherCharges = item.otherCharges;
              this.myRemarks = item.remarks;
              this.myCash = item.cashRec;
              this.myBank = item.netTotal - item.cashRec;
              this.myDiscount = item.billDiscount;
              this.myChange = item.change;
              this.myPaymentType = item.paymentType;
              this.myDuplicateFlag = true;
              this.http.get(environment.mainApi+this.global.inventoryLink+'PrintBill?BillNo='+item.invBillNo).subscribe(
                (Response:any)=>{
                  //console.log(Response);
                  this.myPrintData = Response;
                  this.myQtyTotal = 0;
                  Response.forEach((e:any) => {
                      this.myQtyTotal += e.quantity;
                  });
                }
              )
          
          
              setTimeout(() => {
                this.global.printData('#duplicate');
              }, 500);
             
            } else {
              this.msg.WarnNotify(Response.msg);
            }
          }
        )
      }
    })
    //console.log(item)
  
  }

  billDetails(item:any){

    
    this.global.openPassword('Password').subscribe(pin => {
      if (pin !== '') {
        this.http.post(environment.mainApi + this.global.userLink + 'MatchPassword', {
          RestrictionCodeID: 5,
          Password: pin,
          UserID: this.global.getUserID()

        }).subscribe(
          (Response: any) => {
            if (Response.msg == 'Password Matched Successfully') {
              this.dialogue.open(SaleBillDetailComponent,{
                width:'50%',
                data:item,
                disableClose:true,
              }).afterClosed().subscribe(value=>{
                
              })
            } else {
              this.msg.WarnNotify(Response.msg);
            }
          }
        )
      }
    })

   
  }


  closeDialog(){
    this.dialogRef.close()
  }


}

