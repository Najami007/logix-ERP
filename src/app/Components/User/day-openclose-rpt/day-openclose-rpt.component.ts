import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Time } from 'highcharts';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { SaleBillDetailComponent } from '../../Restaurant-Core/Sales/sale1/sale-bill-detail/sale-bill-detail.component';

@Component({
  selector: 'app-day-openclose-rpt',
  templateUrl: './day-openclose-rpt.component.html',
  styleUrls: ['./day-openclose-rpt.component.scss']
})
export class DayOpencloseRptComponent implements OnInit {



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
    this.global.setHeaderTitle('Day Open Close Report');

  

  }



 
  userList: any = [];
  userID = 0;
  userName = '';

  fromDate: Date = new Date();
  fromTime: any = '00:00';
  toDate: Date = new Date();
  toTime: any = '23:59';

  DOClist: any = [];
  saleSummaryList:any = [];
  reportType: any;




  
  QtyTotal = 0;
  detailTotal = 0;
  summaryTotal = 0;


  getReport() {


      this.http.get(environment.mainApi + this.global.userLink + 'GetDayOpenCloseHistory?FromDate='+
      this.global.dateFormater(this.fromDate, '-')+'&todate='+this.global.dateFormater(this.toDate, '-')+'&fromtime='+this.fromTime+'&totime='+this.toTime).subscribe(
        (Response: any) => {
          this.DOClist = Response;
          console.log(Response)
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
