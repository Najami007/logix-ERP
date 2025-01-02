import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Time } from 'highcharts';
import { SaleBillDetailComponent } from 'src/app/Components/Restaurant-Core/Sales/sale1/sale-bill-detail/sale-bill-detail.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { SaleBillPrintComponent } from '../../Sale/SaleComFiles/sale-bill-print/sale-bill-print.component';

@Component({
  selector: 'app-sale-report-prod-customerwise',
  templateUrl: './sale-report-prod-customerwise.component.html',
  styleUrls: ['./sale-report-prod-customerwise.component.scss']
})
export class SaleReportProdCustomerwiseComponent implements OnInit {

  @ViewChild(SaleBillPrintComponent)  billPrint:any;

  companyProfile: any = [];
  crudList:any = {c:true,r:true,u:true,d:true};
  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    private global: GlobalDataModule,
    private route: Router,
    private dialog:MatDialog

  ) {

    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
    });

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })


    this.global.getProducts().subscribe(
      (Response: any) => {
        this.productList = Response;
      }
    )
  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Purchase Report(Prod & Customerwise)');
    this.getUsers();
    this.getCustomer();
   
  }




  partyList:any = [];
  partyID = 0;
  productList:any = [];
  productID = 0;
  userList: any = [];
  userID = 0;
  userName = '';
  partyName = '';

  fromDate: Date = new Date();
  fromTime: any = '00:00';
  toDate: Date = new Date();
  toTime: any = '23:59';

  DetailList: any = [];
  summaryList:any = [];
  reportType: any;





  getUsers() {
    this.global.getUserList().subscribe((data: any) => { this.userList = data; });
  }

  getCustomer(){

      this.global.getCustomerList().subscribe((data: any) => { this.partyList = data; });

  }


  onPartySelected(){
    this.partyName = this.partyList.find((e: any) => e.partyID == this.partyID).partyName;
  
  }


  onUserSelected() {
    var curUser = this.userList.find((e: any) => e.userID == this.userID);
    this.userName = curUser.userName;
  }


  grandTotal = 0;
  profitTotal = 0;


  getReport(type:any) {

    // alert(this.recipeCatID);
   
  if(this.partyID == 0 || this.partyID == undefined){
    this.msg.WarnNotify('Select Customer')
  }else if(this.productID == 0 || this.productID == undefined){
    this.msg.WarnNotify('Select Product')
  }
  else{


 
    this.reportType = 'Detail';
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetSaleDetailCustomerAndProductDateWise?reqUID='+this.userID+
    '&FromDate='+this.global.dateFormater(this.fromDate, '-')+'&todate='+this.global.dateFormater(this.toDate, '-')+
    '&fromtime='+this.fromTime+'&totime='+this.toTime+'&PartyID='+this.partyID+'&ProductID='+ this.productID).subscribe(
      (Response: any) => {
        this.DetailList = Response;
        this.grandTotal = 0;
        this.profitTotal = 0;
        Response.forEach((e:any) => {
          if(e.invType == 'S'){
            this.grandTotal += (e.salePrice * e.quantity) - (e.discInR * e.quantity);
            this.profitTotal += ((e.salePrice * e.quantity) - (e.discInR * e.quantity)) - (e.avgCostPrice * e.quantity);
          }

          if(e.invType == 'SR'){
            this.grandTotal -= (e.salePrice * e.quantity) - (e.discInR * e.quantity);
            this.profitTotal -= ((e.salePrice * e.quantity) - (e.discInR * e.quantity)) - (e.avgCostPrice * e.quantity);
          }
          
        });

      }
    )
   

 
    

  }
    



  }




  print() {
    this.global.printData('#PrintDiv')
  }

  billDetails(item:any){
    this.dialog.open(SaleBillDetailComponent,{
      width:'50%',
      data:item,
      disableClose:true,
    }).afterClosed().subscribe(value=>{
      
    })
  }

  printBill(item:any){

    if(item.invType == 'S' || item.invType == 'SR'){
      this.billPrint.PrintBill(item.invBillNo);
       this.billPrint.billType = 'Duplicate';
  
    }
   }


}
