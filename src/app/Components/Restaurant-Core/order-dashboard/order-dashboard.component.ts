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
    this.getVoidList();
    this.getOrderList();
  }


  curDate = new Date()

  voidOrderList:any = [];
  newOrderList:any = [];
  
  PendingOrderList:any = [];
  deliveredOrderList:any = [];

  getVoidList(){
    this.http.get(environment.mainApi+this.global.restaurentLink+'GetOrdersAndVoidItemsDetail?todate='+this.global.dateFormater(this.curDate,'-')+'&type=void').subscribe(
      (Response:any)=>{
        this.voidOrderList = Response;
      
      }
    )
  }


  getOrderList(){
    this.PendingOrderList = [];
    this.newOrderList = [];
    this.http.get(environment.mainApi+this.global.restaurentLink+'GetOrdersAndVoidItemsDetail?todate='+this.global.dateFormater(this.curDate,'-')+'&type=order').subscribe(
      (Response:any)=>{
        // this.newOrderList = Response;
         console.log(Response);
        Response.forEach((e:any) => {
        if(e.quantity > 0){
          if(e.reqStatus == false ){
            this.newOrderList.push(e)
          }
          if(e.reqStatus == true && e.dStatus == false ){
            this.PendingOrderList.push(e);
          }

          if(e.reqStatus == true && e.dStatus == true){
            this.deliveredOrderList.push(e)
          }
        }
        });

        console.log(this.PendingOrderList);
      }
    )
  }



  approveOrder(item:any){
    this.app.startLoaderDark();
    this.http.post(environment.mainApi+this.global.restaurentLink+'ApproveOrderVoidRequest',{
      AutoInvDetID: item.autoInvDetID,
      UserID: this.global.getUserID()
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Approved Successfully'){
          this.msg.SuccessNotify('Order Accepted');
          
          this.getOrderList();
        }else{
          this.msg.WarnNotify(Response.msg);
        }

        this.app.stopLoaderDark();
      }
    )
  }


  ApproveDelivery(item:any){
    this.app.startLoaderDark();
    this.http.post(environment.mainApi+this.global.restaurentLink+'UpdateDeliveryStatus',{
      AutoInvDetID: item.autoInvDetID,
      UserID: this.global.getUserID()
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Delivered Successfully'){
          this.msg.SuccessNotify('Order Delivered');
          
          this.getOrderList();
        }else{
          this.msg.WarnNotify(Response.msg);
        }

        this.app.stopLoaderDark();
      }
    )
  }

}
