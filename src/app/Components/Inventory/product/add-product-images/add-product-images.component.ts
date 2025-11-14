import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-add-product-images',
  templateUrl: './add-product-images.component.html',
  styleUrls: ['./add-product-images.component.scss']
})
export class AddProductImagesComponent implements OnInit {


  ImageUrlFeature = this.global.ImageUrlFeature;

  crudList: any = [];

  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    public global: GlobalDataModule,
    private dialogue: MatDialog,
    private app: AppComponent,
    private route: Router
  ) {

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })

  }
  ngOnInit(): void {

    this.getProducts();
  }


  productImg: any = '';
  PBarcode: any = '';
  productList: any = [];


  getProducts() {
    this.global.getProducts().subscribe(
      (data: any) => { this.productList = data; });
  }



  productDetailRow: any = [];

  searchByCode(e: any) {

    var barcode = this.PBarcode;
    var qty: number = 0;
    var BType = '';

    if (this.PBarcode !== '') {
      if (e.keyCode == 13) {
        // this.app.startLoaderDark();
        this.global.getProdDetail(0, barcode).subscribe(
          (Response: any) => {
            if (Response == '' || Response == null || Response == undefined) {
              this.msg.WarnNotify('No Product Found')
              return;
            } else {

              this.pushProdData(Response[0], qty);
            }
          }
        )
        this.PBarcode = '';
        $('#psearchProduct').trigger('focus');

      }
    }
  }


  searchProduct() {

    var barcode = this.PBarcode;
    var qty: number = 0;

    if (this.PBarcode !== '') {

      // this.app.startLoaderDark();
      this.global.getProdDetail(0, barcode).subscribe(
        (Response: any) => {
          if (Response == '' || Response == null || Response == undefined) {
            this.msg.WarnNotify('No Product Found')
            return;
          } else {
            this.pushProdData(Response[0], qty);
          }
        }
      )
      this.PBarcode = '';
      $('#psearchProduct').trigger('focus');


    }
  }

  holdDataFunction(data: any) {
    this.global.getProdDetail(data.productID, '').subscribe(
      (Response: any) => {
        this.pushProdData(Response[0], 1)
      }
    )

    this.app.stopLoaderDark();
    this.PBarcode = '';
    $('#psearchProduct').trigger('focus');

  }

  pushProdData(data: any, qty: any) {
    /////// check already present in the table or not
    const targetBarcode = data.barcode2 || data.barcode;

    this.productDetailRow = data;
    this.PBarcode = '';
    this.productImg = this.ImageUrlFeature ? data.imagesPath : data.productImage;

  }



  rowFocused = -1;
  prodFocusedRow = 0;


  changeFocus(e: any, cls: any) {


    this.prodFocusedRow = 0;
    /////move down
    if (e.keyCode == 40) {
      if (this.productList.length >= 1) {
        $('.prodRow0').trigger('focus');
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
          e.preventDefault();
          $(clsName).trigger('focus');
          //  e.which = 9;   
          //  $(clsName).trigger(e)       
        }
      }
    }


    //Move up
    if (e.keyCode == 38) {

      if (this.prodFocusedRow == 0) {
        e.preventDefault();
        $(endFocus).trigger('focus');
        this.prodFocusedRow = 0;

      }

      if (prodList.length > 1) {

        this.prodFocusedRow -= 1;

        var clsName = cls + this.prodFocusedRow;
        //  alert(clsName);
        e.preventDefault();
        $(clsName).trigger('focus');


      }

    }

  }






  onImgSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const imgSize = file.size;
    const isConvert: number = parseFloat((imgSize / 1048576).toFixed(2));

    ////////////// will check the file type ////////////////
    if (this.global.getExtension(event.target.value) !== 'pdf') {
      const fileReader: FileReader = new FileReader();

      fileReader.onload = async () => {
        const originalBase64 = fileReader.result as string;

        // 👉 if file size > 1MB, compress before assigning
        if (isConvert > 1) {
          // this.msg.WarnNotify('File Size is more than 1MB, compressing...');
          this.productImg = await this.compressBase64(originalBase64, 600, 600, 0.6);
        } else {
          // assign compressed anyway (smaller size, faster upload)
          this.productImg = await this.compressBase64(originalBase64, 600, 600, 0.6);
        }

      };

      fileReader.readAsDataURL(file);

      // reset file input
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        input.value = '';
      }
    } else {
      this.msg.WarnNotify('File Must Be in jpg or png format');
      event.target.value = '';
      this.productImg = '';
    }
  }


  // ✅ helper compression function
  private compressBase64(base64: string, maxWidth: number = 800, maxHeight: number = 800, quality: number = 0.7): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = base64;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject('Canvas not supported');
          return;
        }

        let width = img.width;
        let height = img.height;

        // Scale down
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // export as JPEG
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };

      img.onerror = (err) => reject(err);
    });
  }



  saveProductImage() {

    var productID = this.productDetailRow.productID;
    console.log(productID);
    if(productID == 0 || productID == '0' || productID < 1 || productID == undefined){
      this.msg.WarnNotify('Select Product');
      return;
    }

    if(this.productImg == '' || this.productImg == null || this.productImg == undefined){
      this.msg.WarnNotify('Select Product Image');
      return;
    }

    var postData = {
      ProductID: this.productDetailRow.productID,
      productImage: this.productImg,

    };
    this.app.startLoaderDark();
    this.http.post(environment.mainApi + this.global.inventoryLink + 'updateProductImage', postData).subscribe(
      {
        next: (Response: any) => {
          if (Response.msg == 'Data Updated Successfully') {
            this.msg.SuccessNotify(Response.msg);
            this.reset();
          } else {
            this.msg.WarnNotify(Response.msg);
          }
          this.app.stopLoaderDark();
        },
        error: (Error: any) => {
          this.app.stopLoaderDark();
          console.log(Error);
        }
      }
    )
  }


  reset() {
    this.productImg = '';
    this.productDetailRow = [];
    this.PBarcode = '';
    $('#psearchProduct').trigger('focus');
  }



  ///////////////////////////////////////////////////////////////////////


   scannedValue = '';
  showScanner = false;

  cameras: MediaDeviceInfo[] = [];
  selectedDevice: any | null = null;

  
  openScanner() {
    this.global.openBootstrapModal('#scanBarcodeModal',true);
    this.showScanner = true;
  }

  closeScanner() {
     this.global.closeBootstrapModal('#scanBarcodeModal',true);
    this.showScanner = false;
  }

  onScanSuccess(result: string) {
    this.PBarcode = result;
    this.closeScanner();
  }

  onCamerasFound(devs: MediaDeviceInfo[]) {
    this.cameras = devs;
    this.selectedDevice = devs[0]?.deviceId ?? null;
  }

}
