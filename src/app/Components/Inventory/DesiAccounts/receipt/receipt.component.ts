import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { AddReceiptComponent } from './add-receipt/add-receipt.component';
import { environment } from 'src/environments/environment.development';
import { error } from 'jquery';
import { VoucherDetailsComponent } from 'src/app/Components/Accounts/voucher/voucher-details/voucher-details.component';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent {


  

  companyProfile:any = [];
  crudList:any = {c:true,r:true,u:true,d:true};

  constructor(private http:HttpClient,
    private msg:NotificationService,
    private dialogue: MatDialog,
    private global:GlobalDataModule,
    private app:AppComponent,
    private route:Router
    
    ){
     

      this.global.getMenuList().subscribe((data)=>{
        this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
      });

      this.global.getCompany().subscribe((data)=>{
        this.companyProfile = data;
      });

    }
  ngOnInit(): void {
    this.global.setHeaderTitle('Receipt');
    this.getReceipts();

   
  }


  receiptsList:any = [];


  addReceipt(){
    this.dialogue.open(AddReceiptComponent,{
      width:'30%',
    }).afterClosed().subscribe(value=>{
      if(value == 'update'){
        this.getReceipts();
      }
    })
  }

  getReceipts(){
    this.http.get(environment.mainApi+this.global.accountLink+'GetPayRec?reqType=REC').subscribe(
      (Response:any)=>{
        this.receiptsList = Response;
      },
      (Error:any)=>{
        this.msg.WarnNotify(Error);
      }
    )
  }

  edit(item:any){
    this.dialogue.open(AddReceiptComponent,{
      width:'30%',
      data:item,
    }).afterClosed().subscribe(value=>{
      if(value == 'update'){
        this.getReceipts();
      }
    })
  }

    
  delete(row:any){


    this.global.openPinCode().subscribe(pin=>{
      if(pin!= ''){

        //////on confirm button pressed the api will run
        this.http.post(environment.mainApi+this.global.accountLink+'DeleteVoucher',{
          InvoiceNo: row.invoiceNo,
          PinCode:pin,
          UserID: this.global.getUserID(),
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Deleted Successfully'){
              this.msg.SuccessNotify(Response.msg);
              this.getReceipts();
            }else{
              this.msg.WarnNotify(Response.msg);
            }
          }
        ) 
      
    

  }})

   
  }

  VoucherDetails(row:any){
    this.dialogue.open(VoucherDetailsComponent,{
      width:"40%",
      data:row,
    }).afterClosed().subscribe(val=>{
      
    })
  }


  
  //////////////// print Variables/////////////////////

 lblInvoiceNo:any;
 lblInvoiceDate:any;
 lblRemarks:any;
 lblVoucherType:any;
 lblProjectName:any;
 lblVoucherTable:any;
 lblDebitTotal:any;
 lblCreditTotal:any;
 lblVoucherPrintDate = new Date();


   ///////////////////////////////////////////////////

   printBill(row:any){

    
    this.lblInvoiceNo = row.invoiceNo;
    this.lblInvoiceDate = row.invoiceDate;
    this.lblRemarks = row.invoiceRemarks;
    this.lblVoucherType = row.type;
    this.lblProjectName = row.projectTitle;
    this.getInvoiceDetail(row.invoiceNo);
    

    
      setTimeout(() => {
        if(this.lblInvoiceDetails != ''){
          this.global.printData('#InvociePrint');
        }else{
          this.msg.WarnNotify('Error Occured While Printing');
        }
      }, 500);
    
  }



  lblInvoiceDetails:any = [];
  
  /////////////////////////////////////////////

  getInvoiceDetail(invoiceNo:any){

    this.lblDebitTotal = 0;
    this.lblCreditTotal = 0;
    this.lblInvoiceDetails = [];

    
    this.http.get(environment.mainApi+this.global.accountLink+'GetSpecificVocherDetail?InvoiceNo='+invoiceNo).subscribe(
      (Response:any)=>{
        
        this.lblInvoiceDetails = Response;
        if(Response != ''){
         
          Response.forEach((e:any) => {
            this.lblDebitTotal += e.debit;
            this.lblCreditTotal += e.credit;
          });
        }
      },
      (error:any)=>{
      
        this.msg.WarnNotify('Error Occured While Printing');
      }
    )
  }


  approveBill(row:any){

    this.global.openPinCode().subscribe(pin=>{
      if(pin!= ''){
   
    
            //////on confirm button pressed the api will run
            this.http.post(environment.mainApi+this.global.accountLink+'ApproveVoucher',{
              InvoiceNo: row.invoiceNo,
              PinCode:pin,
            UserID: this.global.getUserID(),
            }).subscribe(
              (Response:any)=>{
                
                if(Response.msg == 'Voucher Approved Successfully'){
                  this.msg.SuccessNotify(Response.msg);
                  this.getReceipts();
                }else{
                  this.msg.WarnNotify(Response.msg);
                }
                
              }
            )
        
      }
    })


   
  }

}
