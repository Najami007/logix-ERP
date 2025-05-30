import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss']
})
export class AddExpenseComponent implements OnInit {

  
  constructor(
    private http:HttpClient,
   
    public global:GlobalDataModule,
    private msg:NotificationService,
    private dialogRef: MatDialogRef<AddExpenseComponent>,
    @Inject(MAT_DIALOG_DATA) public editData : any,
  ){}

  ngOnInit(): void {
    this.getSupplier();
    setTimeout(() => {
      $('#type').trigger('focus');
    }, 500);
    this.getRefCoaList();
    this.getCoaList();

    if(this.editData){
     
      this.invoiceNo = this.editData.invoiceNo;
      this.invoiceDate = new Date(this.editData.invoiceDate);
      this.partyID = this.editData.partyID;

      this.refCoaID = this.editData.refCOAID;
      this.coaID = this.editData.coaid;
   
      this.amount = this.editData.amount;
      this.discount = this.editData.discount;
      this.remarks = this.editData.invoiceRemarks;
      this.bankReceiptNo = this.editData.bankReceiptNo;
      this.projectID = this.editData.projectID;
      this.btnType = 'Update';
    }
  }

  btnType =  'Save';

  invoiceNo = '';
  invoiceDate = new Date();
  supplierBalance = 0;
  amount = 0;
  discount = 0;
  customerList:any = [];
  coaList:any = [];
  coaID = 0;
  refCoaID = 0;
  refCoaList:any = [];
  bankReceiptNo = '';
  remarks = '';
  partyID = 0;
  projectID = this.global.getProjectID();
  paymentType = '';


  getSupplier(){
    this.global.getCustomerList().subscribe(
      (Response)=>{
        this.customerList = Response;
      }
    )
  }


  ////////////////////////////////////////////

  getCoaList(){
    this.global.getCashBankCoa('EXP')
      .subscribe(
      (Response: any) => {
  
        this.coaList = Response;
      },
      (Error) => {
        console.log(Error);
      }
    )
  }

  getRefCoaList() {

  

    this.global.getCashBankCoa('CRV').subscribe(
      (Response: any) => {
        Response.forEach((e:any) => {
          this.refCoaList.push(e);
        
        });
        if(Response.length > 0){
          this.coaID = this.refCoaList[0].coaID;
         }
      }
    )

    this.global.getCashBankCoa('BRV').subscribe(
      (Response: any) => {
        Response.forEach((e:any) => {
          this.refCoaList.push(e);
          
        });
        
      }
    )

    
  }


  save(){
    
    if(this.coaID == 0 || this.coaID == undefined || this.coaID == null){
      this.msg.WarnNotify('Select Expense Head')
    }else if(this.refCoaID == 0 || this.refCoaID == undefined || this.refCoaID == null){
      this.msg.WarnNotify('Select Cash Or Bank')
    }else if(this.amount == 0 || this.amount == undefined || this.amount == null){
      this.msg.WarnNotify('Enter Amount')
    }else{

      if(this.bankReceiptNo == '' || this.bankReceiptNo == null || this.bankReceiptNo == undefined){
        this.bankReceiptNo = '-';
      }
      if(this.remarks == '' || this.remarks == undefined || this.remarks == null){
        this.remarks = '-';
      }  

      if(this.btnType == 'Save'){
        this.insert();
      }

      if(this.btnType == 'Update'){
        this.update();
      }

    }

  }


  insert(){
    $('.loaderDark').show();
    this.http.post(environment.mainApi+this.global.accountLink+'InsertExpense',{
    InvoiceDate: this.global.dateFormater(this.invoiceDate,'-'),
    Type: "JV",
    InvoiceRemarks: this.remarks,
    BankReceiptNo: this.bankReceiptNo,
    COAID: this.coaID,
    RefCOAID: this.refCoaID,
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

  update(){
    
    this.global.openPinCode().subscribe(pin => {

      if(pin != ''){
        $('.loaderDark').show();
        this.http.post(environment.mainApi+this.global.accountLink+'UpdateExpense',{
        InvoiceNo: this.invoiceNo,
        InvoiceDate: this.global.dateFormater(this.invoiceDate,'-'),
        InvoiceRemarks: this.remarks,
        BankReceiptNo: this.bankReceiptNo,
        COAID: this.coaID,
        RefCOAID: this.refCoaID,
        Amount: this.amount,
        ProjectID:this.projectID,
        PinCode: pin,
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
    this.invoiceDate = new Date();
    this.invoiceNo = '';
    this.coaID = 0;
    this.refCoaID = 0;
    this.amount = 0;
    this.discount = 0;
    this.btnType = 'Save';

  }

}
