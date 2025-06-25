import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Time } from 'highcharts';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';


@Component({
  selector: 'app-void-report',
  templateUrl: './void-report.component.html',
  styleUrls: ['./void-report.component.scss']
})
export class VoidReportComponent implements OnInit {

  
  
  companyProfile:any = [];
  crudList:any = {c:true,r:true,u:true,d:true};
  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private app:AppComponent,
    private global:GlobalDataModule,
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
    this.global.setHeaderTitle('Void Report (Userwise)');
    this.getUsers();

  }




tmpRptType = 's';
rptType:any = 's';


  userList:any = [];
  userID = 0;
  userName = '';

  fromDate:Date = new Date();
  fromTime:any = '00:00';
  toDate:Date = new Date();
  toTime:any = '23:59';

  voidList:any = [];

  reportType:any;

  getUsers() {
    this.global.getUserList().subscribe((data: any) => { this.userList = data; });
  }


  
  onUserSelected(){
    var curUser =  this.userList.find((e:any)=> e.userID == this.userID);
     this.userName = curUser.userName;
   }


   getReport(){

    this.app.startLoaderDark();
    this.http.get(environment.mainApi+this.global.inventoryLink+'GetVoidItemsRptDateWise?reqUID='+this.userID+'&FromDate='+
    this.global.dateFormater(this.fromDate,'-')+'&todate='+this.global.dateFormater(this.toDate,'-')+'&fromtime='+this.fromTime+'&totime='+this.toTime).subscribe(
      (Response:any)=>{
           if (Response.length == 0 || Response == null) {
            this.global.popupAlert('Data Not Found!');
            this.app.stopLoaderDark();
            return;

          }
        this.voidList = Response;
        
        this.app.stopLoaderDark();
      },
      (Error:any)=>{
        this.app.stopLoaderDark();
      }
    )
   

   }




   print(){
    this.global.printData('#PrintDiv')
   }
 

}

