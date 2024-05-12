import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-add-opening',
  templateUrl: './add-opening.component.html',
  styleUrls: ['./add-opening.component.scss']
})
export class AddOpeningComponent {

  constructor(
    private http:HttpClient,
    private dialogRef: MatDialogRef<AddOpeningComponent>,
    public global:GlobalDataModule,
    private msg:NotificationService,
    @Inject(MAT_DIALOG_DATA) public editData : any,
  ){}

  ngOnInit(): void {
    setTimeout(() => {
      $('#supplier').trigger('focus');
    }, 500);

    if(this.editData){
      this.invoiceNo = this.editData.invoiceNo;
      this.invoiceDate = this.editData.invoiceDate;
      this.paymentType = this.editData.type;
      this.coaID = this.editData.coaid;
      this.amount = this.editData.amount;
      this.discount = this.editData.discount;
      this.remarks = this.editData.invoiceRemarks;
      this.bankReceiptNo = this.editData.bankReceiptNo;
      setTimeout(() => {
        this.getCoaList();
      }, 200);
      this.btnType = 'Update';
    }
  }


  btnType = 'Save';
  invoiceNo = '';
  invoiceDate = new Date();
  bankReceiptNo = '';
  supplierBalance = 0;
  amount = 0;
  discount:any = 0;
  supplierList:any = [];
  coaList:any = [];
  coaID = 0;
  remarks = '';
  projectID = 0;
  paymentTypeList = [{value:'CPV',title:'Cash'},{value:'BPV',title:'Bank'},];

  paymentType = '';


 
  

  ////////////////////////////////////////////

  getCoaList() {

 
    this.global.getCashBankCoa(this.paymentType).subscribe(
      (Response: any) => {
        this.coaList = Response;
      //  if(Response != '' && Response != null){
      //   this.coaID = Response[0].coaID;
      //  }
      },
      (Error) => {
      
      }
    )
  }


    //////////////////////////////////////////

    Save(){
      if(this.paymentType == '' || this.paymentType == undefined){
        this.msg.WarnNotify('Select Payment Type')
      }else if(this.coaID == 0 || this.coaID == undefined){
        this.msg.WarnNotify('Select COA')
      }else if(this.amount == 0 || this.amount == undefined || this.amount == null){
          this.msg.WarnNotify('Enter Amount')
      }else{

        if(this.bankReceiptNo == '' || this.bankReceiptNo == null || this.bankReceiptNo == undefined){
          this.bankReceiptNo = '-';
        }
        
        if(this.discount == '' || this.discount == undefined || this.discount == null){
          this.discount = 0;
        }

        if(this.remarks == '' || this.remarks == undefined || this.remarks == null){
          this.remarks  = '-';
        }
        
        if(this.btnType == 'Save'){
          this.insert()
        }

        if(this.btnType == 'Update'){
          this.Update();
        }
  
        
      }
    }


    insert(){
      $('.loaderDark').show();
      this.http.post(environment.mainApi+this.global.accountLink+'InsertOpeningCash',{
        InvoiceDate: this.invoiceDate,
        Type: this.paymentType,
        InvoiceRemarks: this.remarks,
        BankReceiptNo: this.bankReceiptNo,
        COAID: this.coaID,
        Amount: this.amount,
        ProjectID:this.projectID,
        UserID: this.global.getUserID()
      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Saved Successfully'){
            this.msg.SuccessNotify(Response.msg);
            this.reset();
            this.dialogRef.close('update');
          

          }else{
            this.msg.WarnNotify(Response.msg);
          }

          $('.loaderDark').fadeOut(500);
        },
        (Error:any)=>{
          $('.loaderDark').fadeOut(500);
        }
      )
    }

    Update(){
    
      this.global.openPinCode().subscribe(pin=>{
        if(pin != ''){
          $('.loaderDark').show();
          this.http.post(environment.mainApi+this.global.accountLink+'UpdateOpeningCash',{
            InvoiceNo:this.invoiceNo,
            InvoiceDate: this.invoiceDate,
            InvoiceRemarks: this.remarks,
            BankReceiptNo: this.bankReceiptNo,
            COAID: this.coaID,
            Amount: this.amount,
            ProjectID:this.projectID,
            Pincode:pin,
            UserID: this.global.getUserID()
          }).subscribe(
            (Response:any)=>{
              if(Response.msg == 'Data Updated Successfully'){
                this.msg.SuccessNotify(Response.msg);
                this.reset();
                this.dialogRef.close('update');
              
    
              }else{
                this.msg.WarnNotify(Response.msg);
              }
    
              $('.loaderDark').fadeOut(500);
            },
            (Error:any)=>{
              $('.loaderDark').fadeOut(500);
            }
          )
        }
      })
    }


  closeDialog(){
    this.dialogRef.close();
  }

  reset(){
    this.invoiceNo = '';
    this.invoiceDate = new Date();
    this.paymentType = '';
    this.coaID = 0;
    this.amount = 0;
    this.discount = 0;
    this.remarks = '';
    this.btnType = 'Save';
          
  }


}
