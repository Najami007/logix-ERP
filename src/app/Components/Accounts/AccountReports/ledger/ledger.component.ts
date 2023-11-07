import { animate } from '@angular/animations';
import { Component, ElementRef, OnInit ,ViewChild} from '@angular/core';
import {FormControl } from '@angular/forms';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { formatDate } from '@angular/common';
import { CircleProgressOptions } from 'ng-circle-progress';
import { AppComponent } from 'src/app/app.component';
import { Subscription } from 'rxjs';
import { TopNavBarComponent } from 'src/app/Components/Layout/top-nav-bar/top-nav-bar.component';
import { MatDialog } from '@angular/material/dialog';
import { VoucherDetailsComponent } from '../../voucher/voucher-details/voucher-details.component';

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss']
})
export class LedgerComponent {


  date = new FormControl(new Date());

  CoaList:any;

  logo:any;
  logo1:any;
  CompanyName:any = 'abc';
  CompanyName2:any;
   companyAddress :any;
   companyPhone :any;
   companyMobileno:any;
   companyEmail:any;
  

  constructor( private globalData: GlobalDataModule,
    private http:HttpClient,
    private msg:NotificationService,
    private app:AppComponent,
    private dialogue:MatDialog
    

    ) {
      
        this.http.get(environment.mainApi+'cmp/getcompanyprofile').subscribe(
          (Response:any)=>{
            this.companyProfile = Response;
            //console.log(Response)  
            
          }
        )
      
    
    }

  ngOnInit(): void {
   
    this.globalData.setHeaderTitle('Ledger');
    this.getProject();
    
    this.getCoa();

   
  }

  companyProfile:any = [];
  projectSearch:any;
  coaID:any;
  projectID:number = 0;
  startDate = new Date();
  EndDate = new Date();
  debitTotal=0;
  creditTotal=0;
  curCOATitle:any;

  



  tableData:any = [];
 placholder = 'Search...';
 txtSearch = '';
 curDate = new Date();




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

 projectList:any = [];




 
 getProject(){
   this.http.get(environment.mainApi+'cmp/getproject').subscribe(
     (Response:any)=>{
       this.projectList = Response;
     }
   )
 }


 ////////////////////////getting total of debit and credit Sides///////////
 


  getTotal(){
      this.debitTotal = 0;
      this.creditTotal = 0; 
      for(var i=0;i<this.tableData.length;i++){
        this.debitTotal += this.tableData[i].debit;
        this.creditTotal += this.tableData[i].credit;
      }
    }
  
 
  PrintTable() {
    this.globalData.printData('#printRpt');
    
  }


  /////////////////////////////////////////////

  getCoa(){
    this.app.startLoaderDark();
    this.http.get(environment.mainApi+'acc/GetVoucherCOA').subscribe(
      (Response)=>{
        // console.log(Response);
        this.CoaList = Response;
        this.app.stopLoaderDark();
      }
    )
  }


  ///////////////////////////////////////////////////////

  getLedgerReport(param:any){

    if(this.coaID == '' || this.coaID == undefined){
      this.msg.WarnNotify('Select Chart Of Account Title')
    }else if((this.projectID == 0 || this.projectID == undefined) && param == 'project'){
      this.msg.WarnNotify('Select Project')
    } else{
      this.app.startLoaderDark();

      if(param.value == 'all'){
        alert();
        this.projectID = 0;
      }
      
      /////////////////// finding the coaTitle from coalist by coaID////////
      var curRow = this.CoaList.find((e:any)=> e.coaID == this.coaID);
    
      this.curCOATitle = curRow.coaTitle;
      /////////////////////////////////////////////////

     
      this.http.get(environment.mainApi+'acc/GetLedgerRpt?coaid='+this.coaID +'&fromdate='
      +this.globalData.dateFormater(this.startDate,'-') +'&todate='+this.globalData.dateFormater(this.EndDate,'-')+'&projectID='+this.projectID).subscribe(
        (Response)=>{
          // console.log(Response);
          this.tableData = Response;
          this.getTotal();
          this.app.stopLoaderDark();
        },
        
      )
    }


    
  }




   ///////////////////////////////////////////////////

   printBill(row:any){
    // this.companyProfile = this.globalData.comapnayProfile;

    this.lblInvoiceNo = row.invoiceNo;
    this.lblInvoiceDate = row.invoiceDate;
    this.lblRemarks = row.invoiceRemarks;

    this.getInvoiceDetail(row.invoiceNo);
    

    
      setTimeout(() => {
        this.globalData.printData('#InvociePrint');
      }, 500);

    
  

    
  }



  /////////////////////////////////////////////

  getInvoiceDetail(invoiceNo:any){

    this.lblDebitTotal = 0;
    this.lblCreditTotal = 0;
    this.invoiceDetails = [];

    
    this.http.get(environment.mainApi+'acc/GetSpecificVocherDetail?InvoiceNo='+invoiceNo).subscribe(
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


  VoucherDetails(row:any){
    this.dialogue.open(VoucherDetailsComponent,{
      width:"40%",
      data:row,
    }).afterClosed().subscribe(val=>{
      
    })
  }


}
