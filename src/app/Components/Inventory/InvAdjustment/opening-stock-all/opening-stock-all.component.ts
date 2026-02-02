import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
import * as $ from 'jquery';



@Component({
  selector: 'app-opening-stock-all',
  templateUrl: './opening-stock-all.component.html',
  styleUrls: ['./opening-stock-all.component.scss']
})
export class OpeningStockAllComponent {

  disableDateFeature = this.global.DisableInvDate;
  crudList = [];
  companyProfile: any = [];
  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    public global: GlobalDataModule,
    private dialog: MatDialog,
    private route: Router
  ) {

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());

    })

    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
    });

  }





  ngOnInit(): void {
    this.global.setHeaderTitle('Opening Stock');
    this.getProductList();
    this.getLocation();




  }


  locationList: any = []
  getLocation() {
    this.global.getWarehouseLocationList().subscribe((data: any) => { this.locationList = data; });
    
  }


  productList: any = [];
  getProductList() {
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetOpeningProductsList').subscribe(
      (Response: any) => {
        
        this.productList = Response;
        if (Response.length > 0) {
          this.invBillNo = Response[0].invBillNo;
          this.locationID = Response[0].locationID; 
        }
        setTimeout(() => {
          $(".qty0").trigger('focus');
          $(".qty0").trigger('select');
        }, 200);
      }
    )
  }



  rowFocused = -1;
  handleUpdown(item: any, e: any, cls: string, index: any) {
    const container = $(".table-logix");
    if (e.keyCode == 9) {
      if (cls == '.sp') {
        this.rowFocused = index + 1;
      } else {
        this.rowFocused = index;
      }

    }


    if (e.shiftKey && e.keyCode == 9) {

      if (cls == '.qty') {
        this.rowFocused = index - 1;
      } else {
        this.rowFocused = index;
      }
    }



    if ((e.keyCode == 13 || e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 16 || e.keyCode == 46 || e.keyCode == 37 || e.keyCode == 110 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 48 || e.keyCode == 49 || e.keyCode == 50 || e.keyCode == 51 || e.keyCode == 52 || e.keyCode == 53 || e.keyCode == 54 || e.keyCode == 55 || e.keyCode == 56 || e.keyCode == 57 || e.keyCode == 96 || e.keyCode == 97 || e.keyCode == 98 || e.keyCode == 99 || e.keyCode == 100 || e.keyCode == 101 || e.keyCode == 102 || e.keyCode == 103 || e.keyCode == 104 || e.keyCode == 105)) {
      // 13 Enter ///////// 8 Back/remve ////////9 tab ////////////16 shift ///////////46 del  /////////37 left //////////////110 dot
    }
    else {
      e.preventDefault();
    }

    /////move down
    if (e.keyCode === 40) {
      if (this.productList.length > 1) {
        this.rowFocused = Math.min(this.rowFocused + 1, this.productList.length - 1);
        const clsName = cls + this.rowFocused;
        this.global.scrollToRow(clsName, container);
        e.preventDefault();
        $(clsName).trigger('select');
        $(clsName).trigger('focus');

      }
    }


    //Move up
    if (e.keyCode === 38) {
      if (this.rowFocused > 0) {

        this.rowFocused -= 1;
        const clsName = cls + this.rowFocused;
        this.global.scrollToRow(clsName, container);
        e.preventDefault();
        $(clsName).trigger('select');
        $(clsName).trigger('focus');

      } else {
        e.preventDefault();

      }
    }



  }

  invoiceDate = new Date();
  locationID = 0;
  invRemarks = '';
  projectID = this.global.getProjectID();
  bookerID = 1
  invBillNo = '-';

  insertOpening() {

    if(this.locationID == 0 || this.locationID == undefined){
      this.msg.WarnNotify('Select Location');
      return;
    }

    var tmpProdList = this.productList.filter((e: any) => e.quantity > 0)
    .map(({productID,productTitle,barcode,quantity,costPrice,avgCostPrice,salePrice})=>(
      {productID,productTitle,barcode,quantity,costPrice,avgCostPrice,salePrice,expiryDate:new Date()}
    ));
    var subTotal = 0;
    tmpProdList.forEach((e: any) => {
      subTotal += e.quantity * e.costPrice;
    });



    var postData: any = {
      InvBillNo: this.invBillNo,
      InvType: 'OS',
      InvDate: this.global.dateFormater(this.invoiceDate, '-'),
      LocationID: this.locationID,
      ProjectID: this.projectID,
      BookerID: this.bookerID,
      BillTotal: subTotal,
      NetTotal: subTotal,
      Remarks: this.invRemarks || '-',
      InvoiceDocument: "-",
      InvDetail: JSON.stringify(tmpProdList),
      UserID: this.global.getUserID(),
    }
    this.app.startLoaderDark();
    this.http.post(environment.mainApi + this.global.inventoryLink + 'InsertOpeningProductsList', postData).subscribe(
      {
        next: (Response: any) => {
          if (Response.msg == 'Data Saved Successfully' || Response.msg == 'Data Updated Successfully') {
            this.msg.SuccessNotify(Response.msg);
            this.getProductList();
          } else {
            this.msg.WarnNotify(Response.msg);
          }

          this.app.stopLoaderDark();
        },
        error: error => {
          console.log(error);
          this.app.stopLoaderDark();
        }
      }
    )
  }




}
