import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Time } from 'highcharts';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-invrptprodwise',
  templateUrl: './invrptprodwise.component.html',
  styleUrls: ['./invrptprodwise.component.scss']
})
export class InvrptprodwiseComponent implements OnInit {



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

    this.global.getProducts().subscribe(
      (Response: any) => {
        this.productList = Response;
      }
    )
  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Inventory Report (Product Wise)');
    this.getUsers();

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


  rptType:any = 's';



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

    this.app.startLoaderDark()
    this.http.get(environment.mainApi + this.global.userLink + 'getuser').subscribe(
      (Response) => {
        this.userList = Response;
    

        this.app.stopLoaderDark();

      },
      (error: any) => {
       
        this.app.stopLoaderDark();
      }
    )

  }




  onUserSelected() {
    var curUser = this.userList.find((e: any) => e.userID == this.userID);
    this.userName = curUser.userName;
  }


  QtyTotal = 0;

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
            if(type == 'R'){
              Response.forEach((e:any) => {

                if(e.issueType != 'Stock Transfer'){
                  this.invDetailList.push(e);
                  this.QtyTotal += e.quantity;
                }
              });
            }else{
              this.invDetailList = Response;
              Response.forEach((e:any) => {
                this.QtyTotal += e.quantity;
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


}
