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
    this.global.setHeaderTitle('Sale Report');
    this.getUsers();

  }


  reportsList:any = [
    {val:'s',title:'Sale Report'},
    {val:'sr',title:'Sale Return Report'},
    {val:'p',title:'Purchase Report'},
    {val:'pr',title:'Purchase Return Report'},
    {val:'I',title:'Issuance Report'},
    {val:'AI',title:'Adjustment In Report'},
    {val:'Ao',title:'Adjustment Out Report'},
    {val:'Dl',title:'Damage Loss Report'},
    {val:'E',title:'Expiry Report'},
  
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
        // console.log(Response);

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


  getReport(type: any) {


    console.log(this.userID,this.productID,type);
    if (this.productID == 0 || this.productID == undefined) {
      this.msg.WarnNotify('Select Product')
    } else {
      this.http.get(environment.mainApi + this.global.inventoryLink +'GetProductInOutDetailDateWise?reqType='+type+'&reqPID='+this.productID+'&reqUID='+this.userID+'&FromDate='+
        this.global.dateFormater(this.fromDate, '-')+'&todate='+this.global.dateFormater(this.toDate, '-')+'&fromtime='+this.fromTime+'&totime='+this.toTime).subscribe(
          (Response: any) => {
            this.invDetailList = Response;
            console.log(Response)
          }
        )
    }



  }




  print() {
    this.global.printData('#PrintDiv')
  }


}
