import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  apiReq = environment.mainApi + this.global.mobileLink;
  companyProfile: any = [];
  crudList: any = { c: true, r: true, u: true, d: true };
  constructor(
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<OrderDetailComponent>,
    public global: GlobalDataModule,
    private route: Router,
  ) {

    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
    });

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })
  }
  ngOnInit(): void {
   if(this.data){
    this.tmpOrderRow = this.data;
    this.getSingleOrderDetail(this.data);
   }
  }



  tmpOrderRow: any = [];
  SingleOrderDetail: any = [];
  OrderDetailTotal: any = 0;





  getSingleOrderDetail(item: any) {

    var url = `${this.apiReq}GetSingleOrderDetail?OrderNo=${item.orderNo}`;
    this.http.get(url).subscribe(
      {
        next: (Response: any) => {
          this.SingleOrderDetail = Response;
          this.OrderDetailTotal = 0;
          if (this.SingleOrderDetail.length > 0) {
            this.SingleOrderDetail.forEach((e: any) => {
              this.OrderDetailTotal += e.salePrice * e.quantity;
            });

          }

        },
        error: error => {
          console.log(error);
        }
      }
    )

  }


  closeDialog(){
    this.dialogRef.close();
  }


}
