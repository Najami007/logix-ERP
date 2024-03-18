import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-price-checker',
  templateUrl: './price-checker.component.html',
  styleUrls: ['./price-checker.component.scss']
})
export class PriceCheckerComponent implements OnInit {

  crudList:any = {c:true,r:true,u:true,d:true};
  companyProfile:any = [];

  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private app:AppComponent,
    public global:GlobalDataModule,
    private dialog:MatDialog,
    private route:Router
  ){

    this.global.getMenuList().subscribe((data)=>{
      this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());

    })

    this.global.getCompany().subscribe((data)=>{
      this.companyProfile = data;
    });

  }
  ngOnInit(): void {
   this.global.setHeaderTitle('Price Checker');
   setTimeout(() => {
    $('#barcode').trigger('focus');
   }, 500);
  }

  


  barcode:any = '';

  productName:any = '';
  productPrice:any = 0;

  seacrhBarcode(e:any){
    if(e.keyCode == 13){
      this.global.getProdDetail(0,this.barcode).subscribe(
        (Response:any)=>{
          this.productName = Response[0].productTitle;
          this.productPrice = Response[0].salePrice;
          this.barcode = '';
        }
      )

      this.barcode = '';
    }
    }
  

}
