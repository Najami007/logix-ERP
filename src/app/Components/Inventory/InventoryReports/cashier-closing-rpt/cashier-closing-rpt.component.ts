import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Time } from 'highcharts';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-cashier-closing-rpt',
  templateUrl: './cashier-closing-rpt.component.html',
  styleUrls: ['./cashier-closing-rpt.component.scss']
})
export class CashierClosingRptComponent implements OnInit {



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

    this.global.getCurrentOpenDay().subscribe(
      (Response:any)=>{
        console.log(Response);
        // this.curDayOpen = Response;
        if(Response != ''){
          this.getReport(Response[0].docID);
        }
      }
    )

  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Cashier Closing Report');
 

  }





  ClosingDetail: any = [];



  getReport(id:any) {
      this.http.get(environment.mainApi + this.global.inventoryLink +'GetDayClosingRpt_9?reqDayID='+id).subscribe(
          (Response: any) => {
            this.ClosingDetail = Response;
            console.log(Response);
          }
        )
    



  }




  print() {
    this.global.printData('#PrintDiv')
  }


}

