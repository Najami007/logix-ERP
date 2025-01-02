import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Time } from 'highcharts';
import { SaleBillDetailComponent } from 'src/app/Components/Restaurant-Core/Sales/sale1/sale-bill-detail/sale-bill-detail.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';


@Component({
  selector: 'app-sale-purchase-comparison-rpt-datewise',
  templateUrl: './sale-purchase-comparison-rpt-datewise.component.html',
  styleUrls: ['./sale-purchase-comparison-rpt-datewise.component.scss']
})
export class SalePurchaseComparisonRptDatewiseComponent  implements OnInit {



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
    this.global.setHeaderTitle('Purchase Report(Prod & Supplierwise)');
    this.getUsers();
    this.getSupplier();
   
  }




  supplierList:any = [];
  partyID = 0;
  productList:any = [];
  productID = 0;
  userList: any = [];
  userID = 0;
  userName = '';

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


  getSupplier(){
    this.global.getSupplierList().subscribe((data: any) => { this.supplierList = data; });

  }




  onUserSelected() {
    var curUser = this.userList.find((e: any) => e.userID == this.userID);
    this.userName = curUser.userName;
  }


 
  purQtyTotal = 0;
  saleQtyTotal = 0;
  purchaseTotal = 0;
  saleTotal = 0;

  getReport(type:any) {

    // alert(this.recipeCatID);
 
    this.reportType = 'Detail';
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetPurchaseSaleComparisonRptDateWise_8?FromDate='+this.global.dateFormater(this.fromDate, '-')+
    '&todate='+this.global.dateFormater(this.toDate, '-')+'&fromtime='+this.fromTime+'&totime='+this.toTime).subscribe(
      (Response: any) => {
    
        this.DetailList = Response;
        this.purQtyTotal = 0;
        this.saleQtyTotal = 0;
        this.purchaseTotal = 0;
        this.saleTotal = 0;
        Response.forEach((e:any) => {
       
          this.purQtyTotal += e.purQty;
          this.saleQtyTotal += e.saleQty;
          this.purchaseTotal += e.purTotal;
          this.saleTotal += e.saleTotal;
        
        });

      }
    )
  

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


}

