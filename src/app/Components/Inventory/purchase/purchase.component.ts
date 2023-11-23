import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit{

  crudList:any = [];
  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private global:GlobalDataModule,
    private dialogue:MatDialog,
    private app:AppComponent,
    private route:Router
  ){
    this.global.getMenuList().subscribe((data)=>{
      this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
    })

  }

  
  ngOnInit(): void {
    this.global.setHeaderTitle('Purchase');
    this.getProducts();

  }

  productImage:any;

  PBarcode:any;   /// for Search barcode field
  productsData:any;   //// for showing the products
  holdDataList: any = [];          //////will hold data temporarily
  suppliersList:any;      //////  will shows the supplier list

  myTotalQty:any;
  mySubtoatal= 0;
  myTotal:any;
  myDue:any;





 
  currentPartyAddress:any;  /////////// will shows the current party address on page
  currentPartyCity:any;      /////////// will shows the current party City on page
  currentPartyMobile:any;   /////////// will shows the current party Mobile on page
  currentPartyCNIC:any;     /////////// will shows the current party CNIC on page


  partyID:any;               /////// will get the party id for Api
  invoiceDate = new Date;    //////////// invoice date for api



  productList:any = [];



  getProducts(){
    this.http.get(environment.mainApi+'inv/GetActiveProduct').subscribe(
      (Response)=>{
        this.productList = Response;
        console.log(Response);
 
      }
    )
  }




  holdDataFunction(data:any){

   

    var condition = this.holdDataList.find(
      (x: any) => x.productID == data.productID
    );

    var index = this.holdDataList.indexOf(condition);

    if (condition == undefined) {

    console.log(data);
    this.holdDataList.push({
      productID:data.productID,
      productTitle:data.productTitle,
      barcode:data.barcode,
      productImage:data.productImage,
      quantity:1,
      costPrice:data.costPrice,
      salePrice:data.salePrice,
      discPercent:data.discPercentage,
      disRupee:data.discRupees,

    })

    this.productImage = data.productImage;
    this.getTotal();
    this.PBarcode = '';
    $('#searchProduct').trigger('focus');
  }else {
    this.holdDataList[index].quantity += 1;
    this.productImage = this.holdDataList[index].productImage;
    this.getTotal();
    this.PBarcode = '';
    $('#searchProduct').trigger('focus');
  }
  

    this.PBarcode = '';
  }


  getTotal() {
    this.mySubtoatal = 0;
    this.myTotalQty = 0;
    for (var i = 0; i < this.holdDataList.length; i++) {
      this.mySubtoatal +=
        this.holdDataList[i].quantity * this.holdDataList[i].costPrice;
      this.myTotalQty += parseFloat(this.holdDataList[i].quantity);
      // this.myTotal = this.mySubtoatal - this.myDiscount;
      // this.myDue = this.myPaid - this.myTotal;
    }
  }


  delRow(item: any) {
    var index = this.holdDataList.findIndex((e:any)=> e.productID == item.productID);
    this.holdDataList.splice(index, 1);
    this.getTotal();
    
  }


  onRowClick(item:any){
    var index = this.holdDataList.findIndex((e:any)=> e.productID == item.productID);
    this.productImage = this.holdDataList[index].productImage;
  }



}
