import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

import * as $ from 'jquery';

@Component({
  selector: 'app-cashbook',
  templateUrl: './cashbook.component.html',
  styleUrls: ['./cashbook.component.scss']
})
export class CashbookComponent implements OnInit{


  logo:any;
  logo1:any;
  CompanyName:any;
  CompanyName2:any;
   companyAddress :any;
   companyPhone :any;
   companyMobileno:any;
   companyEmail:any;
  

  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private app:AppComponent,
    private globalData:GlobalDataModule
  ){}


  ngOnInit(): void {
    $('.cashSummary').hide();
    this.logo = this.globalData.Logo;
    this.logo1 = this.globalData.Logo1;
    this.CompanyName = this.globalData.CompanyName;
    this.CompanyName2 = this.globalData.CompanyName2;
    this.companyAddress = this.globalData.Address;
    this.companyPhone = this.globalData.Phone;
    this.companyMobileno = this.globalData.mobileNo;
    this.companyEmail = this.globalData.Email;
    this.globalData.setHeaderTitle('cash Book');
  }



  fromDate:Date = new Date();
  toDate:Date = new Date();


  tableData:any;

  cashSummary:any;
  DebitTotal:any = 0;
  creditTotal:any = 0;
 
  
 //////////////// print Variables/////////////////////

 lblInvoiceNo:any;
 lblInvoiceDate:any;
 lblRemarks:any;
 lblVoucherType:any;
 lblVoucherTable:any;
 lblDebitTotal:any;
 lblCreditTotal:any;
 lblVoucherPrintDate = new Date();
 invoiceDetails:any;
 




 getTotal(){
  this.DebitTotal = 0;
  this.creditTotal = 0;
  
 this.tableData.forEach((e:any) => {
  
  this.DebitTotal += e.debit;
  this.creditTotal += e.credit;

 });
   


 }

/////////////////////////////////////////////////////////////////
  getDetailReport(){
    this.tableData = [];
    this.app.startLoaderDark();

    $('#CashBookDetail').show();
    $('.cashSummary').hide();

    this.http.get(environment.mainApi+'GetCashBookDetailRpt?fromdate='+this.globalData.dateFormater(this.fromDate,'-')+
    '&todate='+this.globalData.dateFormater(this.toDate,'-')).subscribe(
      (Response:any)=>{
        
        this.tableData = Response;
        this.getTotal();
        this.app.stopLoaderDark();
    
      },
      (Error)=>{
        this.msg.WarnNotify('Error Occured While Loading Report')
        this.app.stopLoaderDark();
      }
    )
  }


  //////////////////////////////////////////////////
  getSummary(){
    this.app.startLoaderDark();
 
    // $('#CashBookDetail').css('visibility','hidden');
    $('#CashBookDetail').hide();
    $('.cashSummary').show();

    this.http.get(environment.mainApi+'GetCashBookSummaryRpt?fromdate='+this.globalData.dateFormater(this.fromDate,'-')+
    '&todate='+this.globalData.dateFormater(this.toDate,'-')).subscribe(
      (Response)=>{
        this.cashSummary = Response;
        this.app.stopLoaderDark();
      },
      (Error)=>{
        this.msg.WarnNotify('Error Occured While Loading Report')
        this.app.stopLoaderDark();
      }
    )
  }


  ////////////////////////////////////////////////////
  print(){

    this.globalData.printData('#printRpt')
  }


  /////////////////////////////////////////////

  getInvoiceDetail(invoiceNo:any){

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
      },
      (error:any)=>{
        console.log(error);
        this.msg.WarnNotify('Error Occured While Printing');
      }
    )
  }

}
