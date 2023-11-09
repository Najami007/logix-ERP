import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

import * as $ from 'jquery';
import { MatDialog } from '@angular/material/dialog';
import { VoucherDetailsComponent } from '../../voucher/voucher-details/voucher-details.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cashbook',
  templateUrl: './cashbook.component.html',
  styleUrls: ['./cashbook.component.scss']
})
export class CashbookComponent implements OnInit{
  companyProfile:any= [];
  crudList:any = [];

  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private app:AppComponent,
    private globalData:GlobalDataModule,
    private dialogue:MatDialog,
    private route:Router
  ){
    this.http.get(environment.mainApi+'cmp/getcompanyprofile').subscribe(
      (Response:any)=>{
        this.companyProfile = Response;
        //console.log(Response)  
        
      }
    )
  }


  ngOnInit(): void {
    $('.cashSummary').hide();
   
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
 
 projectSearch:any;
 projectName:any;
  projectID:number = 0;
 projectList:any = [];





 getCrud(){
  this.http.get(environment.mainApi+'user/getusermenu?userid='+this.globalData.getUserID()+'&moduleid='+this.globalData.getModuleID()).subscribe(
    (Response:any)=>{
      this.crudList =  Response.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
    }
  )
}

 
 getProject(){
   this.http.get(environment.mainApi+'cmp/getproject').subscribe(
     (Response:any)=>{
       this.projectList = Response;
     }
   )
 }


 getTotal(){
  this.DebitTotal = 0;
  this.creditTotal = 0;
  
 this.tableData.forEach((e:any) => {
  
  this.DebitTotal += e.debit;
  this.creditTotal += e.credit;

 });
   


 }

/////////////////////////////////////////////////////////////////
  getDetailReport(param:any){

    if(this.projectID == 0 && param == 'project'){
      this.msg.WarnNotify('Select Project')
    }else{
      this.tableData = [];
      this.app.startLoaderDark();
      this.projectName = '';
      if(param == 'all'){
      
        this.projectID = 0;
      }
      if(this.projectID != 0){
        this.projectName = this.projectList.find((e:any)=> e.projectID == this.projectID).projectTitle;
      }
      
  
    
  
      $('#CashBookDetail').show();
      $('.cashSummary').hide();
  
      this.http.get(environment.mainApi+'acc/GetCashBookDetailRpt?fromdate='+this.globalData.dateFormater(this.fromDate,'-')+
      '&todate='+this.globalData.dateFormater(this.toDate,'-')+'&projectid='+this.projectID).subscribe(
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


  }


  //////////////////////////////////////////////////
  getSummary(){
    this.app.startLoaderDark();
 
    // $('#CashBookDetail').css('visibility','hidden');
    $('#CashBookDetail').hide();
    $('.cashSummary').show();

    this.http.get(environment.mainApi+'acc/GetCashBookSummaryRpt?fromdate='+this.globalData.dateFormater(this.fromDate,'-')+
    '&todate='+this.globalData.dateFormater(this.toDate,'-')+'&projectid='+this.projectID).subscribe(
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

 

  VoucherDetails(row:any){
    this.dialogue.open(VoucherDetailsComponent,{
      width:"40%",
      data:row,
    }).afterClosed().subscribe(val=>{
      
    })
  }
}
