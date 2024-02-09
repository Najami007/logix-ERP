import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-order-dashboard',
  templateUrl: './order-dashboard.component.html',
  styleUrls: ['./order-dashboard.component.scss']
})
export class OrderDashboardComponent implements OnInit {


  constructor(
    private http:HttpClient,
    private global:GlobalDataModule,
    private msg:NotificationService,
    private app:AppComponent,
    private dialog:MatDialog
  ){}

  ngOnInit(): void {
    this.global.setHeaderTitle('Kitchen DashBoard');
    this.getAllOrder()
  }


  curDate = new Date()

  AllOrderList:any = [];

  getAllOrder(){
    this.http.get(environment.mainApi+this.global.restaurentLink+'GetOrdersAndVoidItemsDetail?todate='+this.global.dateFormater(this.curDate,'-')+'&type=void').subscribe(
      (Response:any)=>{
        this.AllOrderList = Response;
        console.log(Response);
      }
    )
  }

}
