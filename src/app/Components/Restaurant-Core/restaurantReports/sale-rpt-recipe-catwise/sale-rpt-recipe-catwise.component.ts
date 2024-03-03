import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Time } from 'highcharts';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { SaleBillDetailComponent } from '../../sale/sale-bill-detail/sale-bill-detail.component';


@Component({
  selector: 'app-sale-rpt-recipe-catwise',
  templateUrl: './sale-rpt-recipe-catwise.component.html',
  styleUrls: ['./sale-rpt-recipe-catwise.component.scss']
})
export class SaleRptRecipeCatwiseComponent implements OnInit {



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
    this.global.setHeaderTitle('Sale Report (Categorywise)');
    this.getUsers();
    this.getCategories();

  }



  orderTypeList:any = [{val:'Dine In', title:'Dine In'},{val:'Take Away', title:'Take Away'},{val:'Home Delivery', title:'Home Delivery'},]

  orderType:any = 'Dine In';

  userList: any = [];
  userID = 0;
  userName = '';

  fromDate: Date = new Date();
  fromTime: any = '00:00';
  toDate: Date = new Date();
  toTime: any = '23:59';

  SaleDetailList: any = [];

  reportType: any;

  categoriesList:any = [];
  recipeCatID = 0;
  CategoryTitle = '';


  
  getCategories(){
    this.http.get(environment.mainApi+this.global.restaurentLink+'GetRecipeCategories').subscribe(
      (Response:any)=>{
        this.categoriesList = Response;
      }
    )
  }


  
  onCatSelected() {
    var title = this.categoriesList.find((e: any) => e.recipeCatID == this.recipeCatID);
    this.CategoryTitle = title.recipeCatTitle;
  }




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




  onUserSelected() {
    var curUser = this.userList.find((e: any) => e.userID == this.userID);
    this.userName = curUser.userName;
  }


  grandTotal = 0;


  getReport(type:any) {

    // alert(this.recipeCatID);
   
  if(this.recipeCatID == 0 || this.recipeCatID == undefined){
    this.msg.WarnNotify('Select Category')
  }else{
    if(type == 'summary'){
      this.reportType = 'Summary';
      this.app.startLoaderDark();
      this.http.get(environment.mainApi + this.global.inventoryLink + 'GetSaleSummaryRecipeCatAndDateWise?reqCID='+this.recipeCatID+'&reqUID='+this.userID+'&FromDate='+
    this.global.dateFormater(this.fromDate, '-')+'&todate='+this.global.dateFormater(this.toDate, '-')+'&fromtime='+this.fromTime+'&totime='+this.toTime).subscribe(
      (Response: any) => {
        console.log(Response)
        this.SaleDetailList = Response;
        this.grandTotal = 0;
        Response.forEach((e:any) => {
          this.grandTotal += e.total;
        });
        this.app.stopLoaderDark();
      },
      (Error:any)=>{
        this.app.stopLoaderDark();
      }
    )
    }

    if(type == 'detail'){
      this.reportType = 'Detail';
      this.app.startLoaderDark();
      this.http.get(environment.mainApi + this.global.inventoryLink + 'GetSaleDetailRecipeCatAndDateWise?reqCID='+this.recipeCatID+'&reqUID='+this.userID+'&FromDate='+
    this.global.dateFormater(this.fromDate, '-')+'&todate='+this.global.dateFormater(this.toDate, '-')+'&fromtime='+this.fromTime+'&totime='+this.toTime).subscribe(
      (Response: any) => {
        this.SaleDetailList = Response;
        this.grandTotal = 0;
        Response.forEach((e:any) => {
          this.grandTotal += e.quantity * e.salePrice;
        });
        this.app.stopLoaderDark();
      } ,
      (Error:any)=>{
        this.app.stopLoaderDark();
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

