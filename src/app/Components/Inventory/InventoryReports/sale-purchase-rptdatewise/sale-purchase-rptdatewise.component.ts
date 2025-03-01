import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { SaleBillPrintComponent } from '../../Sale/SaleComFiles/sale-bill-print/sale-bill-print.component';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { PurchaseBillPrintComponent } from '../../Purchases/purchase-bill-print/purchase-bill-print.component';

@Component({
  selector: 'app-sale-purchase-rptdatewise',
  templateUrl: './sale-purchase-rptdatewise.component.html',
  styleUrls: ['./sale-purchase-rptdatewise.component.scss']
})
export class SalePurchaseRptdatewiseComponent implements OnInit {

  @ViewChild(SaleBillPrintComponent)  saleBill:any;
   @ViewChild(PurchaseBillPrintComponent) purchaseBill:any;
  FBRFeature = this.global.FBRFeature;
  DiscFeature = this.global.discFeature;
  
  
  companyProfile:any = [];
  crudList:any = {c:true,r:true,u:true,d:true};
  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private app:AppComponent,
    public global:GlobalDataModule,
    private route:Router    
  ){

    this.global.getCompany().subscribe((data)=>{
      this.companyProfile = data;
    });

    this.global.getMenuList().subscribe((data)=>{
      this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
    })
  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Sale Purchase Report (Datewise)');
    this.getUsers();
    $('#detailTable').show();
    $('#summaryTable').hide();
  }




  reportsList:any = [
    {val:'s',title:'Sale Report'},
    {val:'sr',title:'Sale Return Report'},
    {val:'p',title:'Purchase Report'},
    {val:'pr',title:'Purchase Return Report'},
    {val:'I',title:'Issuance Report'},
    {val:'R',title:'Stock Receive'},
    {val:'AI',title:'Adjustment In Report'},
    {val:'Ao',title:'Adjustment Out Report'},
    {val:'Dl',title:'Damage Loss Report'},
    {val:'E',title:'Expiry Report'},
    {val:'OS',title:'Opening Stock Report'},
  
]
tmpRptType = 's';
rptType:any = 's';


  userList:any = [];
  userID = 0;
  userName = '';

  fromDate:Date = new Date();
  fromTime:any = '00:00';
  toDate:Date = new Date();
  toTime:any = '23:59';

  SaleDetailList:any = [];

  reportType:any;

  getUsers() {
    this.global.getUserList().subscribe((data: any) => { this.userList = data; });
  }



  
  onUserSelected(){
    var curUser =  this.userList.find((e:any)=> e.userID == this.userID);
     this.userName = curUser.userName;
   }

   billTotal = 0;
   chargesTotal = 0;
   netGrandTotal = 0;

   qtyTotal = 0;
   detNetTotal = 0;
   profitTotal = 0;
   profitPercentTotal = 0;
   discountTotal=0;
   offerDiscTotal = 0;
   summaryNetTotal= 0;
   myTaxTotal = 0;

   getReport(type:any){

   this.reportType = this.reportsList.find((e:any)=>e.val == this.rptType).title;

   if(type == 'taxSummary' && (this.rptType != 's')){
    this.msg.WarnNotify('Tax Is Only For Sales')
    return;
   }
  
   this.app.startLoaderDark();
    this.rptType = this.tmpRptType;
   if(type == 'summary'){
   
    $('#detailTable').hide();
    $('#TaxsummaryTable').hide();
    $('#summaryTable').show();
    // this.reportType = 'Summary';
    this.http.get(environment.mainApi+this.global.inventoryLink+'GetInventorySummaryDateWise_2?reqType='+this.rptType+'&reqUserID='+this.userID+'&FromDate='+
    this.global.dateFormater(this.fromDate,'-')+'&todate='+this.global.dateFormater(this.toDate,'-')+'&fromtime='+this.fromTime+'&totime='+this.toTime).subscribe(
      (Response:any)=>{
        this.SaleDetailList = [];
       
        if(this.rptType == 'R'){
          Response.forEach((e:any)=>{
            if(e.issueType != 'Stock Transfer'){
              this.SaleDetailList.push(e);
            }
          }
           
          )
          // this.SaleDetailList = Response.fil;
        }else{
          this.SaleDetailList = Response;
        }
        this.billTotal = 0;
        this.chargesTotal = 0;
        this.netGrandTotal = 0;
        this.discountTotal = 0;
        this.offerDiscTotal = 0;
        this.summaryNetTotal = 0;

        this.SaleDetailList.forEach((e:any) => {
         
          this.billTotal += e.billTotal;
          this.chargesTotal += e.otherCharges;
          this.netGrandTotal += e.billTotal + e.overHeadAmount;
          this.discountTotal += e.billDiscount - e.percentageDiscount;
          this.offerDiscTotal += e.percentageDiscount;
          this.summaryNetTotal += e.netTotal;

        });
        this.app.stopLoaderDark();
      }
    )
   }
   if(type == 'taxSummary'){
    $('#detailTable').hide();
    $('#summaryTable').hide();
    $('#TaxsummaryTable').show();
    // this.reportType = 'Summary';
    this.http.get(environment.mainApi+this.global.inventoryLink+'GetInventorySummaryDateWise_2?reqType='+this.rptType+'&reqUserID='+this.userID+'&FromDate='+
    this.global.dateFormater(this.fromDate,'-')+'&todate='+this.global.dateFormater(this.toDate,'-')+'&fromtime='+this.fromTime+'&totime='+this.toTime).subscribe(
      (Response:any)=>{
        this.SaleDetailList = [];
       
        if(this.rptType == 'R'){
          Response.forEach((e:any)=>{
            if(e.issueType != 'Stock Transfer'){
              this.SaleDetailList.push(e);
            }
          }
           
          )
          // this.SaleDetailList = Response.fil;
        }else{
          this.SaleDetailList = Response;
        }
        this.billTotal = 0;
        this.chargesTotal = 0;
        this.netGrandTotal = 0;
        this.discountTotal = 0;
        this.offerDiscTotal = 0;
        this.summaryNetTotal = 0;
        this.myTaxTotal = 0;

        this.SaleDetailList.forEach((e:any) => {
         
          this.billTotal += e.billTotal;
          this.chargesTotal += e.otherCharges;
          this.discountTotal += e.billDiscount - e.percentageDiscount;
          this.offerDiscTotal += e.percentageDiscount;
          this.summaryNetTotal += e.netTotal;
          this.myTaxTotal += e.gstAmount;

        });
        this.app.stopLoaderDark();
      }
    )
   }

   if(type == 'detail'){
    $('#detailTable').show();
    $('#summaryTable').hide();
    $('#TaxsummaryTable').hide();

    // this.reportType = 'Detail';
    this.http.get(environment.mainApi+this.global.inventoryLink+'GetInventoryDetailDateWise_3?reqType='+this.rptType+'&reqUserID='+this.userID+'&FromDate='+
    this.global.dateFormater(this.fromDate,'-')+'&todate='+this.global.dateFormater(this.toDate,'-')+'&fromtime='+this.fromTime+'&totime='+this.toTime).subscribe(
      (Response:any)=>{
    
        this.SaleDetailList = [];
        if(this.rptType == 'R'){
          Response.forEach((e:any)=>{
            if(e.issueType != 'Stock Transfer'){
              this.SaleDetailList.push(e);
            }
          }
           
          )
          // this.SaleDetailList = Response.fil;
        }else{
          this.SaleDetailList = Response;
        }
    
        this.qtyTotal = 0;
        this.detNetTotal = 0;
        this.profitPercentTotal = 0;
        this.profitTotal = 0;
        this.discountTotal = 0;
         this.SaleDetailList.forEach((e:any) => {
          this.qtyTotal += e.quantity;
          if(this.rptType == 's' || this.rptType == 'sr'){
            this.detNetTotal += (e.salePrice - e.discInR) * e.quantity ;
            this.profitTotal += ((e.salePrice - e.discInR) * e.quantity) - (e.avgCostPrice * e.quantity);
            this.discountTotal  += e.discInR * e.quantity;
            //this.profitPercentTotal += ((e.salePrice - e.discInR) * e.quantity) - (e.avgCostPrice * e.quantity) / ;
          }
          else if(this.rptType == 'p' || this.rptType == 'pr'){
            this.detNetTotal += e.costPrice * e.quantity;
          }
          else{
            this.detNetTotal += e.avgCostPrice * e.quantity;
          }
         });
         this.app.stopLoaderDark();
        }
    )
   }

   }




   print(){
    this.global.printData('#PrintDiv')
   }

   sendToFbr(item:any){
    this.http.post(environment.mainApi+this.global.inventoryLink+'InvSendToFbr',{
      InvBillNo:item.invBillNo,
      UserID: this.global.getUserID()
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Updated Successfully'){
          this.msg.SuccessNotify(Response.msg);
          item.fbrStatus = true;
      
        }else{
          this.msg.WarnNotify(Response.msg);
        }
      }
    )
  }
 
   printBill(item:any){

    if(item.invType == 'S' || item.invType == 'SR'){
      this.saleBill.PrintBill(item.invBillNo);
   
       this.saleBill.billType = 'Duplicate';
      
    }

    if(item.invType == 'P' || item.invType == 'PR'){
      this.purchaseBill.printBill(item);
    }

   }




}
