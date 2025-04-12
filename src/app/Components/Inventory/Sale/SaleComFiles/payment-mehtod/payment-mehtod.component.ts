import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-payment-mehtod',
  templateUrl: './payment-mehtod.component.html',
  styleUrls: ['./payment-mehtod.component.scss']
})
export class PaymentMehtodComponent {


    constructor(
        private http:HttpClient,
        @Inject(MAT_DIALOG_DATA) public data : any,
        private dialogRef: MatDialogRef<PaymentMethodChangeEvent>,
        public global:GlobalDataModule,
        private msg:NotificationService,
    
      ){}
    
      ngOnInit(): void {
  
        this.getBankList();

        if(this.data){
          this.invBillNo = this.data.invBillNo;
          this.netTotal = this.data.netTotal;
          this.paymentType = this.data.paymentType;
          this.getTotal();
        }
        
      }
    
    
      invBillNo = '';
      netTotal = 0;
      change = 0;
      invoiceDate = new Date();
      customerName = '';
      partyID = 0;
      billRemarks = '';
      paymentType = 'Cash';
      cash:any = 0;
      bankCash:any = 0;
      bankCoaID = 0;
  
      bankCoaList:any = [];
  
      getBankList() {
  
        this.global.getBankList().subscribe((data: any) => {
          this.bankCoaList = data;
          if(data){
            this.bankCoaID = data[0].coaID;
          }
          // setTimeout(() => {
          //   this.bankCoaID = data[0].coaID;
          // }, 200);
        });
      }

      getTotal(){
        if(this.paymentType == 'Bank'){
          this.bankCash = this.netTotal;

        }

          if(this.paymentType == 'Cash'){
            this.bankCash = 0;
          }

        if(this.paymentType == 'Split'){
          this.bankCash = this.netTotal - parseFloat(this.cash);
        }
        this.change = (parseFloat(this.cash) + parseFloat(this.bankCash)) - this.netTotal;
      }
  
  
      save(){

        this.cash = parseFloat(this.cash);
        this.bankCash = parseFloat(this.bankCash);

        if(this.bankCash < 0 || this.cash < 0){
          this.msg.WarnNotify('Entered Amount is not Valid')
        }else if(this.paymentType == 'Cash' && (this.cash < this.netTotal)  ){
          this.msg.WarnNotify('Entered Amount Is not Valid');
        }else if(this.paymentType == 'Bank' && (this.bankCash < this.netTotal || this.bankCash > this.netTotal)){
          this.msg.WarnNotify('Entered Amount Is not Valid')
        }else if(this.paymentType == 'Split' && ((this.bankCash + this.cash) !== this.netTotal)){
          this.msg.WarnNotify('Entered Amount Is not Valid')
        } 
        else{
          this.http.post(environment.mainApi+this.global.inventoryLink+'changePaymentMode',{
            invBillNo:this.invBillNo,
            InvDate: this.global.dateFormater(this.invoiceDate, '-'),
            PartyID: this.partyID,
            PaymentType:this.paymentType,
            InvType: "S",
            Remarks: this.billRemarks || '-',
            OrderType: "Take Away",
            NetTotal: this.netTotal,
            CashRec: this.cash,
            Change: this.change,
            BankCoaID: this.bankCoaID,
            BankCash: this.bankCash,
            CusName: this.customerName || '-',
            UserID: this.global.getUserID()
  
          }).subscribe(
            (Response:any)=>{
              if(Response.msg == 'Data Updated Successfully'){
                this.msg.SuccessNotify(Response.msg);
                this.dialogRef.close()
              }else{
                this.msg.WarnNotify(Response.msg);
              }
            }
          )
        }
  
      }
  
      close(){
        this.dialogRef.close();
      }

}
