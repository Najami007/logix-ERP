import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

import * as $ from 'jquery';

@Component({
  selector: 'app-product-barcodes',
  templateUrl: './product-barcodes.component.html',
  styleUrls: ['./product-barcodes.component.scss']
})
export class ProductBarcodesComponent implements OnInit {

  discFeature = this.global.discFeature;


  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    public global: GlobalDataModule,
    private dialogue: MatDialog,
    private route: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProductBarcodesComponent>,
  ) {

  }
  ngOnInit(): void {
    if (this.data) {
      this.productDetail = this.data;
    }
    this.getProductDiscList();
  }


  proDiscID = 0;

  productDetail: any = [];

  flavourTitle: any = ''
  barcode: any = '';
  quantity: any = '';
  discInR: any = '';
  discInP: any = '';
  btnType: any = 'Save';


  productDiscList: any = [];

  getProductDiscList() {

    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetProductDiscount?reqProID=' + this.productDetail.productID).subscribe(
      (Response: any) => {
        this.productDiscList = Response;
      }
    )
  }



  save() {


    if (this.flavourTitle == '') {
      this.msg.WarnNotify('Enter Title');
      return;
    }
    if (this.barcode == '') {
      this.msg.WarnNotify('Enter Barcode');
      return;
    }
    if (this.quantity == '' || this.quantity == '0' || this.quantity == 0 || this.quantity == undefined) {
      this.msg.WarnNotify('Enter Quantity');
      return;
    }

    if ((this.productDetail.costPrice * Number(this.quantity)) > ((this.productDetail.salePrice * Number(this.quantity)) - Number(this.discInR))) {
      this.msg.WarnNotify('Discount Not Valid');
      return;
    }


    var postData = {
      ProDiscID: this.proDiscID,
      ProductID: this.productDetail.productID,
      FlavourTitle: this.flavourTitle,
      Barcode: this.barcode,
      Quantity: this.quantity,
      DiscInP: this.discInP || 0,
      DiscInR: this.discInR || 0,

      PinCode: "",
      UserID: this.global.getUserID()

    }


    this.global.openPinCode().subscribe(
      pin => {

        if (pin != '') {
          postData.PinCode = pin;
          if (this.btnType == 'Save') {
            this.insertProductDiscount('insert', postData)
          }

          if (this.btnType == 'Update') {
            this.insertProductDiscount('update', postData)
          }

        }

      }
    )







  }


  insertProductDiscount(type: any, postData: any) {

    var url = ''

    if(type == 'insert'){
      url = 'InsertProductDiscount';
    }
    if(type == 'update'){
      url = 'UpdateProductDiscount';
    }
    $('.loaderDark').show();
    this.http.post(environment.mainApi + this.global.inventoryLink + url, postData).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Saved Successfully' || Response.msg == 'Data Updated Successfully') {
          this.msg.SuccessNotify(Response.msg);
          this.reset();
          this.getProductDiscList();
        } else {
          this.msg.WarnNotify(Response.msg);

        }
        $('.loaderDark').hide();
      },
      (Error: any) => {
        console.log(Error);
        $('.loaderDark').hide();

      }
    )
  }


  deleteProductDisc(item: any) {

    var postData = {
      ProDiscID: item.proDiscID,
      barcode: item.barcode,
      PinCode: '',
      UserID: this.global.getUserID()
    }

    this.global.openPinCode().subscribe(
      pin => {
        if (pin != '') {
          postData.PinCode = pin;
          $('.loaderDark').show();
          this.http.post(environment.mainApi + this.global.inventoryLink + 'DeleteProductDiscount', postData).subscribe(
            (Response: any) => {
              if (Response.msg == 'Data Deleted Successfully') {
                this.msg.SuccessNotify(Response.msg);
                this.reset();
                this.getProductDiscList();
              } else {
                this.msg.WarnNotify(Response.msg);

              }
              $('.loaderDark').hide();
            },
            (Error: any) => {
              console.log(Error);
              $('.loaderDark').hide();

            }
          )
        }
      }
    )

  }


  activeDisc(item: any) {
    var postData = {
      ProDiscID: item.proDiscID,
      barcode: item.barcode,
      ActiveStatus: !item.activeStatus,
      PinCode: '',
      UserID: this.global.getUserID()
    }

    this.global.openPinCode().subscribe(
      pin => {
        if (pin != '') {
          postData.PinCode = pin;
          $('.loaderDark').show();
          this.http.post(environment.mainApi + this.global.inventoryLink + 'ActiveProductDiscount', postData).subscribe(
            (Response: any) => {
              if (Response.msg == 'Data Updated Successfully') {
                this.msg.SuccessNotify(Response.msg);
                this.reset();
                this.getProductDiscList();
              } else {
                this.msg.WarnNotify(Response.msg);

              }
              $('.loaderDark').hide();
            },
            (Error: any) => {
              console.log(Error);
              $('.loaderDark').hide();

            }
          )
        }
      }
    )

  }


  editProdDisc(item: any) {
    this.proDiscID = item.proDiscID;
    this.flavourTitle = item.flavourTitle;
    this.barcode = item.barcode;
    this.quantity = item.quantity;
    this.discInP = item.discInP;
    this.discInR = item.discInR;
    this.btnType = 'Update';
  }





  reset() {
    this.proDiscID = 0;
    this.flavourTitle = '';
    this.barcode = '';
    this.quantity = '';
    this.discInP = '';
    this.discInR = '';
    this.btnType = 'Save';
  }


  closeDialog() {
    this.dialogRef.close();
  }


  onDiscChange(type: any) {

    if (this.quantity == 0 || this.quantity == '') {
      this.discInP = 0;
      this.discInR = 0;
      this.msg.WarnNotify('Quantity Not Valid')
      return;
    }

    if (type === 'perc') {
      this.discInR = ((this.productDetail.salePrice * this.quantity) * this.discInP) / 100;
    }
    if (type === 'amount') {
      this.discInP = (this.discInR / (this.productDetail.salePrice * this.quantity)) * 100
    }
  }

}
