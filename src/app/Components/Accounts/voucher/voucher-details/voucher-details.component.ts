import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
import * as $ from 'jquery';

@Component({
  selector: 'app-voucher-details',
  templateUrl: './voucher-details.component.html',
  styleUrls: ['./voucher-details.component.scss']
})
export class VoucherDetailsComponent {

constructor(
  private http:HttpClient,
  @Inject(MAT_DIALOG_DATA) public editData : any,
  private dialogRef: MatDialogRef<VoucherDetailsComponent>,
  private global:GlobalDataModule,
  private msg:NotificationService
){}



ngOnInit(): void {

  this.getInvoiceDetail(this.editData.invoiceNo);


  
}


invoiceDetails:any =[];

lblDebitTotal:any = 0;

lblCreditTotal:any = 0;




getInvoiceDetail(invoiceNo:any){
  $('.loaderDark').show();

  this.lblDebitTotal = 0;
  this.lblCreditTotal = 0;
  this.invoiceDetails = [];

  
  this.http.get(environment.mainApi+'GetSpecificVocherDetail?InvoiceNo='+invoiceNo).subscribe(
    (Response:any)=>{
      // console.log(Response);
      this.invoiceDetails = Response;
      if(Response != ''){
       
        Response.forEach((e:any) => {
          this.lblDebitTotal += e.debit;
          this.lblCreditTotal += e.credit;
        });
      }
      $('.loaderDark').fadeOut();
    },
    (error:any)=>{
      console.log(error);
      this.msg.WarnNotify('Error Occured While Printing');
      $('.loaderDark').fadeOut();
    }
  )
}



 //////////////////////////////////////////////////
 closeDialogue(){
  this.dialogRef.close();
}



}