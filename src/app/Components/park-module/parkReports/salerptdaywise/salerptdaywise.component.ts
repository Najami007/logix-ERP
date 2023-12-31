import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

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
    this.global.setHeaderTitle('Sale Report Daywise');

  }

  fromDate:any = new Date();
  toDate:any = new Date();
  totalAmount:any= 0;

  dataList:any = [];



  getReport(){
    this.app.startLoaderDark();
    this.http.get(environment.mainApi+'park/GetTicketSummarySingleDate?ToDate='+this.global.dateFormater(this.toDate,'-')).subscribe(
      (Response:any)=>{
      //  console.log(Response);
        this.dataList = Response;
        this.totalAmount = 0;
        Response.forEach((e:any) => {
          
          this.totalAmount += e.ticketTotal;

        });
        this.app.stopLoaderDark();
      }
    )
  }


  print(){
    this.global.printData('#PrintDiv');
  }


  printDetails:any =[];

  printTicket(ticketNo:any){

    this.http.get(environment.mainApi+'park/PrintTicket?ticketno='+ticketNo).subscribe(
      (Response:any)=>{
       this.printDetails = Response;
      //  console.log(Response);

       setTimeout(() => {
        this.global.printData('#ticketPrint');
       }, 100);
      }
    )

  }


  


}
