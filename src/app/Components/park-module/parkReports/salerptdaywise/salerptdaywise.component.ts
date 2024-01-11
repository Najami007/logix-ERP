import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { TicketDetailComponent } from '../../park-sale/ticket-detail/ticket-detail.component';

@Component({
  selector: 'app-salerptdaywise',
  templateUrl: './salerptdaywise.component.html',
  styleUrls: ['./salerptdaywise.component.scss']
})
export class SalerptdaywiseComponent {

  
  companyProfile:any = [];
  crudList:any = [];
  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private app:AppComponent,
    private global:GlobalDataModule,
    private route:Router,
    private dialogue:MatDialog
    
  ){

    this.global.getCompany().subscribe((data)=>{
      this.companyProfile = data;
    });

    this.global.getMenuList().subscribe((data)=>{
      this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
    })
  }





  ngOnInit(): void {
    this.global.setHeaderTitle('Sale Report Daywise');

  }

  fromDate:any = new Date();
  toDate:any = new Date();
  totalAmount:any= 0;
  saleTotalAmount:any = 0;
  returnTotalAmount:any = 0;
  SaleList:any = [];
  returnList:any = [];

  dataList:any = [];



  getReport(){
    this.app.startLoaderDark();
    this.http.get(environment.mainApi+'park/GetTicketSummarySingleDate?ToDate='+this.global.dateFormater(this.toDate,'-')).subscribe(
      (Response:any)=>{
      //  console.log(Response);
      this.SaleList = [];
      this.returnList = [];
       this.saleTotalAmount = 0;
       this.returnTotalAmount  = 0;
        Response.forEach((e:any) => {

          if(e.type == 'S'){
            this.SaleList.push(e);
            this.saleTotalAmount += e.ticketTotal;

          }
          if(e.type == 'SR'){
            this.returnList.push(e);
            this.returnTotalAmount += e.ticketTotal;
          }
          

        });
        this.app.stopLoaderDark();
      }
    )
  }


  print(){
    this.global.printData('#PrintDiv');
  }




  getTktDetail(row:any){
    
    this.dialogue.open(TicketDetailComponent,{
      data:row,
      width:'40%'
    }).afterClosed().subscribe()


  }



  


}
