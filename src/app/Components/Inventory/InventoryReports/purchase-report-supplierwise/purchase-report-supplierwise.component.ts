import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Time } from 'highcharts';
import { SaleBillDetailComponent } from 'src/app/Components/Restaurant-Core/sale/sale-bill-detail/sale-bill-detail.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-purchase-report-supplierwise',
  templateUrl: './purchase-report-supplierwise.component.html',
  styleUrls: ['./purchase-report-supplierwise.component.scss']
})
export class PurchaseReportSupplierwiseComponent implements OnInit {



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
  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Purchase Report (Supplierwise)');
    this.getUsers();
    this.getSupplier();
    $('#detailTable').show();
    $('#summaryTable').hide();

  }




  supplierList:any = [];
  partyID = 0;

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

    this.app.startLoaderDark()
    this.http.get(environment.mainApi + this.global.userLink + 'getuser').subscribe(
      (Response) => {
        this.userList = Response;
        this.app.stopLoaderDark();

      },
      (error: any) => {
        console.log(error);
        this.app.stopLoaderDark();
      }
    )

  }


  getSupplier(){
    this.http.get(environment.mainApi+this.global.companyLink+'getsupplier').subscribe(
      {
        next:value =>{
          this.supplierList = value;       
        },
        error: error=>{
          this.msg.WarnNotify('Error Occured While Loading Data')
         
        }         
      }
      )
  }




  onUserSelected() {
    var curUser = this.userList.find((e: any) => e.userID == this.userID);
    this.userName = curUser.userName;
  }


  grandTotal = 0;


  getReport(type:any) {

    // alert(this.recipeCatID);
   
  if(this.partyID == 0 || this.partyID == undefined){
    this.msg.WarnNotify('Select Supplier')
  }else{

   if(type == 'detail'){
    $('#detailTable').show();
    $('#summaryTable').hide();
    this.reportType = 'Detail';
    this.http.get(environment.mainApi+this.global.inventoryLink + 'GetPurchaseRptSupplierWiseDetail_5?reqUserID='+this.userID+'&reqPartyID='+this.partyID+'&FromDate='+
    this.global.dateFormater(this.fromDate, '-')+'&todate='+this.global.dateFormater(this.toDate, '-')+'&fromtime='+this.fromTime+'&totime='+this.toTime).subscribe(
      (Response: any) => {
        //console.log(Response);
        this.DetailList = Response;
        this.grandTotal = 0;
        Response.forEach((e:any) => {
          if(e.invType == 'P'){
            this.grandTotal += e.costPrice * e.quantity;
          }

          if(e.invType == 'PR'){
            this.grandTotal -= e.costPrice * e.quantity;
          }
          
        });

      }
    )
   }

   if(type == 'summary'){
    $('#detailTable').hide();
        $('#summaryTable').show();
        this.reportType = 'Summary';
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetPurchaseRptSupplierWiseSummary_4?reqUserID='+this.userID+'&reqPartyID='+this.partyID+'&FromDate='+
    this.global.dateFormater(this.fromDate, '-')+'&todate='+this.global.dateFormater(this.toDate, '-')+'&fromtime='+this.fromTime+'&totime='+this.toTime).subscribe(
      (Response: any) => {
        //console.log(Response);
        this.summaryList = Response;
        this.grandTotal = 0;
        Response.forEach((e:any) => {
          if(e.invType == 'P'){
            this.grandTotal += e.netTotal + e.overHeadAmount + e.billDiscount ;
          }
          if(e.invType == 'PR'){
            this.grandTotal -= e.netTotal + e.overHeadAmount +e.billDiscount ;
          }
        });

      }
    )
   }
    

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


}

