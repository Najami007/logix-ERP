import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-barcode-report',
  templateUrl: './barcode-report.component.html',
  styleUrls: ['./barcode-report.component.scss']
})
export class BarcodeReportComponent implements OnInit {

  companyProfile: any = [];

  companyName = '';
  crudList: any = { c: true, r: true, u: true, d: true };
  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    private global: GlobalDataModule,
    private route: Router,
    private dialog: MatDialog

  ) {

    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
      if (data != '') {
        this.companyName = data[0].companyName;
      }
    });

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })


  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Barcode Report');

    this.global.getProducts().subscribe(
      (Response: any) => {
        this.productList = Response;
      }
    )
  }


  manufactureDate = new Date();
  expiryDate = new Date();
  showLess = false;
  hideExpiry = true;
  hidePrice = false;
  hideBarcode = false;
  hideName = false;
  hideCmp = false;
  productList: any = [];


  PBarcode: any;
  curProduct: any = [];

  onProductSelected(item: any) {
    this.curProduct = [];
    // this.curProduct.push(item);
    this.global.getProdDetail(item.productID, '').subscribe(
      (Response: any) => {
        if (Response.length > 0) {
          this.curProduct = Response;
        } else {
          this.msg.WarnNotify('Product Not Found!')
        }

      }
    )

    this.PBarcode = '';

  }


  searchByCode(e: any) {

    if (this.PBarcode !== '') {
      if (e.keyCode == 13) {
        ///// check the product in product list by barcode
        this.global.getProdDetail(0, this.PBarcode).subscribe(
          (Response: any) => {
            if (Response.length > 0) {
              this.curProduct = Response;
            } else {
              this.msg.WarnNotify('Product Not Found!')
            }

          }
        )

        // var row =  this.productList.find((p:any)=> p.barcode == this.PBarcode);

        // /////// check already present in the table or not
        // if(row !== undefined){
        //   this.curProduct = [];
        //   this.curProduct.push(row);
        // }else{
        //   this.msg.WarnNotify('Product Not Found')
        // }


        this.PBarcode = '';
        $('#searchProduct').trigger('focus');

      }
    }


  }




  rowFocused = -1;
  prodFocusedRow = 0;
  changeFocus(e: any, cls: any) {

    if (e.target.value == '') {

    } else {
      this.prodFocusedRow = 0;
      /////move down
      if (e.keyCode == 40) {
        if (this.productList.length >= 1) {
          $('.prodRow0').trigger('focus');
        }
      }
    }
  }

  handleProdFocus(item: any, e: any, cls: any, endFocus: any, prodList: []) {


    /////// increment in prodfocus on tab click
    if (e.keyCode == 9 && !e.shiftKey) {
      this.prodFocusedRow += 1;

    }
    /////// decrement in prodfocus on shift tab click
    if (e.shiftKey && e.keyCode == 9) {
      this.prodFocusedRow -= 1;

    }
    /////move down
    if (e.keyCode == 40) {


      if (prodList.length > 1) {
        this.prodFocusedRow += 1;
        if (this.prodFocusedRow >= prodList.length) {
          this.prodFocusedRow -= 1
        } else {
          var clsName = cls + this.prodFocusedRow;
          //  alert(clsName);
          $(clsName).trigger('focus');
          e.which = 9;
          $(clsName).trigger(e)
        }
      }
    }


    //Move up
    if (e.keyCode == 38) {

      if (this.prodFocusedRow == 0) {
        $(endFocus).trigger('focus');
        this.prodFocusedRow = 0;

      }

      if (prodList.length > 1) {

        this.prodFocusedRow -= 1;

        var clsName = cls + this.prodFocusedRow;
        //  alert(clsName);
        $(clsName).trigger('focus');


      }

    }

  }


  print() {

    this.global.printBarcode('#PrintDiv')

  }



getBarcodeWidth(value: string): number {
  // Base width (e.g., 2px per character, adjust as needed)
  const baseWidth = 1.5 

  // Ensure a minimum width for short values
  // return Math.max(2, baseWidth); 

  // Or scale dynamically:
  return Math.max(1, value.length < 10 ? 1.4 : 2 / value.length );
}

}
