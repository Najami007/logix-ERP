import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-customer-balance-report',
  templateUrl: './customer-balance-report.component.html',
  styleUrls: ['./customer-balance-report.component.scss']
})
export class CustomerBalanceReportComponent {

  companyProfile:any= [];
  crudList:any = {c:true,r:true,u:true,d:true};
  constructor(
    private http:HttpClient,
    private global:GlobalDataModule,
    private app:AppComponent,
    private route:Router,
    private msg:NotificationService
  ){
    this.global.getCompany().subscribe((data)=>{
      this.companyProfile = data;
    });

    this.global.getMenuList().subscribe((data)=>{
      this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
    })
  }


  ngOnInit(): void {
    this.global.setHeaderTitle('Customer Balance Report');
    this.getParty();
  }



  TableData:any = [];

  getParty(){
    this.http.get(environment.mainApi+this.global.inventoryLink+'GetCustomersBalanceRpt').subscribe(
      {
        next:value =>{
          this.TableData = value;
          
         },
        error: error=>{
          this.msg.WarnNotify('Error Occured While Loading Data')  ;      
        }         
      })
  }


  print(){
    this.global.printData('#PrintDiv');
  }




}