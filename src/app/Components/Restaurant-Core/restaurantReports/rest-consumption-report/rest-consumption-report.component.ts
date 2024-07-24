import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-rest-consumption-report',
  templateUrl: './rest-consumption-report.component.html',
  styleUrls: ['./rest-consumption-report.component.scss']
})
export class RestConsumptionReportComponent  {

  companyProfile: any = [];
  crudList: any = { c: true, r: true, u: true, d: true };

  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    private global: GlobalDataModule,
    private route: Router,
    private dialog: MatDialog,

  ) {


    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
    });

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })
  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Sale Report (Datewise)');
    this.getUsers();
    $('#detailTable').show();
    $('#summaryTable').hide();

  }




  userList: any = [];
  userID = 0;
  userName = '';



  fromDate: Date = new Date();
  fromTime: any = '00:00';
  toDate: Date = new Date();
  toTime: any = '23:59';


  ConsumptionList:any = [];




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



  getReport(){

    this.http.get(environment.mainApi+this.global.inventoryLink+'GetConsumptionRptDateWise?reqUID=' + this.userID + '&FromDate=' +
        this.global.dateFormater(this.fromDate, '-') + '&todate=' + this.global.dateFormater(this.toDate, '-') + '&fromtime=' + this.fromTime + '&totime=' + this.toTime).subscribe(
          (Response:any)=>{
            console.log(Response);
            this.ConsumptionList = Response;

          }
        )

  }




  
  print() {
    this.global.printData('#PrintDiv')
  }



}

