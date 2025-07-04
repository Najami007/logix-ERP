import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Time } from 'highcharts';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { SaleBillPrintComponent } from '../../Sale/SaleComFiles/sale-bill-print/sale-bill-print.component';
import { PurchaseBillPrintComponent } from '../../Purchases/purchase-bill-print/purchase-bill-print.component';

@Component({
  selector: 'app-invrptprodwise',
  templateUrl: './invrptprodwise.component.html',
  styleUrls: ['./invrptprodwise.component.scss']
})
export class InvrptprodwiseComponent implements OnInit {

 @ViewChild(SaleBillPrintComponent)  salebillPrint:any;
 @ViewChild(PurchaseBillPrintComponent)  purchaseBillPrint:any;

  companyProfile: any = [];
  crudList:any = {c:true,r:true,u:true,d:true};
  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    private global: GlobalDataModule,
    private route: Router

  ) {

    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
    });

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })

   this.getProduct();
  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Product In Out History');
    this.getUsers();
    this.getReportTypes();

  }


  getProduct(){
     this.global.getProducts().subscribe(
      (Response: any) => {
        if(Response.length > 0){
        this.productList = Response.map((e:any,index:any)=>{
          (e.indexNo = index + 1);
          return e;
      });
    
        this.productList.sort((a: any, b: any) => b.indexNo - a.indexNo);
        }
      }
    )
  }


  
  onProdSelected() {
    var index = this.productList.findIndex((e: any) => e.productID == this.productID);
    this.productList[index].indexNo = this.productList[0].indexNo + 1;
    this.productList.sort((a: any, b: any) => b.indexNo - a.indexNo);
  }


  reportsList:any = []


getReportTypes(){
  this.http.get(environment.mainApi+this.global.inventoryLink+'GetInvoiceTypes_15').subscribe(
    (Response:any)=>{
      console.log(Response);
      this.reportsList = Response;
    }
  )
}


  rptType:any = 'S';



  productList: any = [];
  productID = 0;


  userList: any = [];
  userID = 0;
  userName = '';

  fromDate: Date = new Date();
  fromTime: any = '00:00';
  toDate: Date = new Date();
  toTime: any = '23:59';

  invDetailList: any = [];

  reportType: any;


  getUsers() {
    this.global.getUserList().subscribe((data: any) => { this.userList = data; });
  }

  onUserSelected() {
    var curUser = this.userList.find((e: any) => e.userID == this.userID);
    this.userName = curUser.userName;
  }


  QtyTotal = 0;
  saleTotal = 0;
  costTotal = 0;

  getReport(type: any) {
    this.reportType = this.reportsList.find((e:any)=>e.val == type).title;

   
    if (this.productID == 0 || this.productID == undefined) {
      this.msg.WarnNotify('Select Product')
    } else {
      this.app.startLoaderDark();
      this.http.get(environment.mainApi + this.global.inventoryLink +'GetProductInOutDetailDateWise?reqType='+type+'&reqPID='+this.productID+'&reqUID='+this.userID+'&FromDate='+
        this.global.dateFormater(this.fromDate, '-')+'&todate='+this.global.dateFormater(this.toDate, '-')+'&fromtime='+this.fromTime+'&totime='+this.toTime).subscribe(
          (Response: any) => {
             this.invDetailList = [];
            this.QtyTotal = 0;
            this.saleTotal = 0;
            this.costTotal = 0;
              if (Response.length == 0 || Response == null) {
              this.global.popupAlert('Data Not Found!');
                this.app.stopLoaderDark();
              return;
              
            }
           
            if(type == 'R'){
              Response.forEach((e:any) => {

                if(e.issueType != 'Stock Transfer'){
                  this.invDetailList.push(e);
                  this.QtyTotal += e.quantity;
                  this.saleTotal += e.salePrice * e.quantity;
                  this.costTotal += e.costPrice * e.quantity;
                 
                }
              });
            }else{
              this.invDetailList = Response;
              Response.forEach((e:any) => {
                this.QtyTotal += e.quantity;
                this.saleTotal += e.salePrice * e.quantity;
                this.costTotal += e.costPrice * e.quantity;
            });
            }

            this.app.stopLoaderDark();
           
     
          },
          (Error:any)=>{
            this.app.stopLoaderDark();
            this.msg.WarnNotify('Unable to Connect to Data')
          }
        )
    }



  }

  print() {
    this.global.printData('#PrintDiv')
  }

  printBill(item:any){

    if(item.invType == 'S' || item.invType == 'SR'){
      this.salebillPrint.PrintBill(item.invBillNo);
       this.salebillPrint.billType = 'Duplicate';
    }

    if(item.invType == 'P' || item.invType == 'PR'){
      this.purchaseBillPrint.printBill(item);
    }
   }


}
