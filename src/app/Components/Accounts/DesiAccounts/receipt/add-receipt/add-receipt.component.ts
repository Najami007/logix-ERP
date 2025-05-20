import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddrecipeCategoryComponent } from 'src/app/Components/Restaurant-Core/recipe-category/addrecipe-category/addrecipe-category.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-add-receipt',
  templateUrl: './add-receipt.component.html',
  styleUrls: ['./add-receipt.component.scss']
})
export class AddReceiptComponent implements OnInit {

  
  constructor(
    private http:HttpClient,
    private dialogRef: MatDialogRef<AddrecipeCategoryComponent>,
    public global:GlobalDataModule,
    private msg:NotificationService,
    @Inject(MAT_DIALOG_DATA) public editData : any,
  ){}

  ngOnInit(): void {
    this.getSupplier();
    this.getProject();
    setTimeout(() => {
      $('#customer').trigger('focus');
    }, 500);

    if(this.editData){
       this.invoiceNo = this.editData.invoiceNo;
      this.invoiceDate = new Date(this.editData.invoiceDate);
      this.partyID = this.editData.partyID;
      this.paymentType = this.editData.type;
      this.coaID = this.editData.coaid;
      this.amount = this.editData.amount;
      this.discount = this.editData.discount;
      this.remarks = this.editData.invoiceRemarks;
      this.bankReceiptNo = this.editData.bankReceiptNo;
       this.projectID = this.editData.projectID;
      setTimeout(() => {
        this.getCoaList();
      }, 200);
      this.btnType = 'Update';
    }
    this.getCoaList();
  }


  btnType = 'Save';
  invoiceNo = '';
  invoiceDate = new Date();
  customerBalance = 0;
  amount = 0;
  discount:any = 0;
  customerList:any = [];
  coaList:any = [];
  coaID = 0;
  remarks = '';
  partyID = 0;
  bankReceiptNo = '';
  projectID = 0;
  paymentTypeList = [{value:'CRV',title:'Cash'},{value:'BRV',title:'Bank'},];

  paymentType = 'CRV';

  projectList:any = [];

  getProject(){
    this.http.get(environment.mainApi+this.global.companyLink+'getproject').subscribe(
      (Response:any)=>{
        this.projectList = Response;
       // console.log(Response);
      
      }
    )
  }


  getSupplierBalance(){
    var partyType = this.customerList.find((e:any)=> e.partyID == this.partyID).partyType;
    var reqType = partyType == 'Supplier' ? 'sup' : 'cus';
    this.http.get(environment.mainApi+this.global.accountLink+'getcussupbalance?reqtype='+reqType+'&reqpartyid='+this.partyID).subscribe(
      (Response:any)=>{
         this.customerBalance = Response[0].amount;
      }
    )
  }

  getSupplier(){
    this.global.getPartyList().subscribe(
      (Response)=>{
        this.customerList = Response;
      }
    )
  }


  ////////////////////////////////////////////

  getCoaList() {


    this.global.getCashBankCoa(this.paymentType).subscribe(
      (Response: any) => {
        this.coaList = Response;
       if(Response.length > 0){
        this.coaID = Response[0].coaID;
       }
      },
      (Error) => {
      
      }
    )
  }



    //////////////////////////////////////////

    Save(){
      if(this.partyID == 0 || this.partyID == undefined){
        this.msg.WarnNotify('Select Supplier')
      }else if(this.paymentType == '' || this.paymentType == undefined){
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
      this.http.post(environment.mainApi+this.global.accountLink+'InsertReceipt',{
        InvoiceDate: this.global.dateFormater(this.invoiceDate,'-'),
        PartyID: this.partyID, 
        Type: this.paymentType,
        InvoiceRemarks: this.remarks,
        BankReceiptNo: this.bankReceiptNo,
        COAID: this.coaID,
        Amount: this.amount,
        ProjectID:this.projectID,
        Discount: this.discount,
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
          this.http.post(environment.mainApi+this.global.accountLink+'UpdateReceipt',{
            InvoiceNo:this.invoiceNo,
            InvoiceDate: this.global.dateFormater(this.invoiceDate,'-'),
            PartyID: this.partyID, 
            InvoiceRemarks: this.remarks,
            BankReceiptNo: this.bankReceiptNo,
            COAID: this.coaID,
            Amount: this.amount,
            Discount: this.discount,
            Pincode:pin,
            ProjectID:this.projectID,
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
    this.partyID = 0;
    this.paymentType = '';
    this.coaID = 0;
    this.amount = 0;
    this.discount = 0;
    this.remarks = '';
    this.btnType = 'Save';
          
  }


}
