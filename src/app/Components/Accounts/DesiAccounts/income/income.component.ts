import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';

import { environment } from 'src/environments/environment.development';
import { AddIncomeComponent } from './add-income/add-income.component';
import { VoucherDetailsComponent } from 'src/app/Components/Accounts/CommonComponent/voucher-details/voucher-details.component';


@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent {
  
  page:number = 1;
  count: number = 0;
 
  tableSize: number = 0;
  tableSizes : any = [];

  onTableDataChange(event:any){

    this.page = event;
    this.getSavedData();
  }

  onTableSizeChange(event:any):void{
    this.tableSize = event.target.value;
    this.page =1;
    this.getSavedData();
  }


  companyProfile:any = [];
  crudList:any = {c:true,r:true,u:true,d:true};

  constructor(private http:HttpClient,
    private msg:NotificationService,
    private dialogue: MatDialog,
    private globaldata:GlobalDataModule,
    private app:AppComponent,
    private route:Router
    
    ){
     

      this.globaldata.getMenuList().subscribe((data)=>{
        this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
      });

      this.globaldata.getCompany().subscribe((data)=>{
        this.companyProfile = data;
      });

    }
  ngOnInit(): void {
    this.globaldata.setHeaderTitle('Income');
    this.getSavedData();
    this.tableSize = this.globaldata.paginationDefaultTalbeSize;
    this.tableSizes = this.globaldata.paginationTableSizes;
   
   
  }


  savedDataList:any = [];
  

  add(){
    this.dialogue.open(AddIncomeComponent,{
      width:'30%',
    }).afterClosed().subscribe(value =>{
      if(value == 'update'){
          this.getSavedData();
      }
    })
  }



  edit(item:any){
    this.dialogue.open(AddIncomeComponent,{
      width:'30%',
      data:item,
    }).afterClosed().subscribe(value =>{
      if(value == 'update'){
          this.getSavedData();
      }
    })
  }

  getSavedData(){

      this.http.get(environment.mainApi+this.globaldata.accountLink+'GetPayRec?reqType=INC').subscribe(
        (Response:any)=>{
          this.savedDataList = Response;
         
        }
      )
  }



  
  delete(row:any){


    this.globaldata.openPinCode().subscribe(pin=>{
      if(pin!= ''){

        //////on confirm button pressed the api will run
        this.http.post(environment.mainApi+this.globaldata.accountLink+'DeleteVoucher',{
          InvoiceNo: row.invoiceNo,
          PinCode:pin,
          UserID: this.globaldata.getUserID(),
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Deleted Successfully'){
              this.msg.SuccessNotify(Response.msg);
              this.getSavedData();
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
          this.globaldata.printData('#InvociePrint');
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

    
    this.http.get(environment.mainApi+this.globaldata.accountLink+'GetSpecificVocherDetail?InvoiceNo='+invoiceNo).subscribe(
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

    this.globaldata.openPinCode().subscribe(pin=>{
      if(pin!= ''){
   
    
            //////on confirm button pressed the api will run
            this.http.post(environment.mainApi+this.globaldata.accountLink+'ApproveVoucher',{
              InvoiceNo: row.invoiceNo,
              PinCode:pin,
            UserID: this.globaldata.getUserID(),
            }).subscribe(
              (Response:any)=>{
                
                if(Response.msg == 'Voucher Approved Successfully'){
                  this.msg.SuccessNotify(Response.msg);
                  this.getSavedData();
                }else{
                  this.msg.WarnNotify(Response.msg);
                }
                
              }
            )
        
      }
    })


   
  }


}