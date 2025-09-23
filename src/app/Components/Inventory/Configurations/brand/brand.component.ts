import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {

  crudList: any = { c: true, r: true, u: true, d: true };

  appConfigFeature = this.globaldata.appConfigFeature;
          ImageUrlFeature = this.globaldata.ImageUrlFeature;

  constructor(private http: HttpClient,
    private msg: NotificationService,
    private dialogue: MatDialog,
    public globaldata: GlobalDataModule,
    private app: AppComponent,
    private route: Router,
    private titleService: Title

  ) {

    this.globaldata.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());

    })


  }
  ngOnInit(): void {
    this.globaldata.setHeaderTitle('Brand');
    this.getBrandList();


  }

  txtSearch: any;
  brandTitle: any;
  brandCode: any;
  description: any;
  brandID: number = 0;
  btnType: any = 'Save';

  BrandList: any = [];





  getBrandList() {
    this.http.get(environment.mainApi + this.globaldata.inventoryLink + 'GetBrand').subscribe(
      (Response: any) => {
        this.BrandList = Response;
      },
      (Error: any) => {
        this.msg.WarnNotify(Error);

      }
    )
  }


  isBase64Image(str: string): boolean {
    if (typeof str !== "string") {
      return false;
    }

    // Regex for data:image/* base64 string
    const base64ImageRegex = /^data:image\/(png|jpg|jpeg|gif|webp|bmp|svg\+xml);base64,[A-Za-z0-9+/]+={0,2}$/;

    return base64ImageRegex.test(str);
  }




  save() {
    if (this.brandTitle == '' || this.brandTitle == undefined) {
      this.msg.WarnNotify('Enter Category Title')
    } else if (this.brandCode == '' || this.brandCode == undefined) {
      this.msg.WarnNotify('Enter Brand Code')
    } else {

      if (this.description == '' || this.description == undefined) {
        this.description = '-';
      }


      if (!this.isBase64Image(this.brandImage)) {
        this.brandImage = '-';
      }

      var postData: any = {
        BrandID: this.brandID,
        BrandTitle: this.brandTitle,
        BrandCode: this.brandCode,
        BrandDescription: this.description,
        BrandImage: this.brandImage,
        PinCode: '',
        UserID: this.globaldata.getUserID()
      }

      if (this.btnType == 'Save') {
        this.insert(postData, 'insert');
      } else if (this.btnType == 'Update') {
        this.globaldata.openPinCode().subscribe(pin => {
          if (pin != '') {
            postData.PinCode = pin;
            this.insert(postData, 'update');
          }
        })

      }

    }

  }



  insert(postData: any, type: any) {
    this.app.startLoaderDark();

    var url = '';
    if (type == 'insert') {
      url = 'insertbrand'
    }
    if (type == 'update') {
      url = 'updateBrand'
    }
    this.http.post(environment.mainApi + this.globaldata.inventoryLink + url, postData).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Saved Successfully' || Response.msg == 'Data Updated Successfully') {
          this.msg.SuccessNotify(Response.msg);
          this.getBrandList();
          this.reset();
          this.app.stopLoaderDark();

        } else {
          this.msg.WarnNotify(Response.msg);
          this.app.stopLoaderDark();
        }
      },
      (error: any) => {
        this.app.stopLoaderDark();
      }
    )
  }





  reset() {
    this.brandCode = '';
    this.description = '';
    this.brandTitle = '';
    this.brandID = 0;
    this.brandImage = '';
    this.btnType = 'Save';

  }


  edit(row: any) {
    this.brandID = row.brandID;
    this.brandTitle = row.brandTitle;
    this.brandCode = row.brandCode;
    this.description = row.brandDescription;
    this.brandImage = this.ImageUrlFeature ? row.imagesPath : row.brandImage;
      this.btnType = 'Update';

  }

  delete(row: any) {

    Swal.fire({
      title: 'Alert!',
      text: 'Confirm to Delete the Data',
      position: 'center',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
    }).then((result) => {

      if (result.isConfirmed) {
        this.globaldata.openPinCode().subscribe(pin => {

          if (pin != '') {

            this.app.startLoaderDark();

            this.http.post(environment.mainApi + this.globaldata.inventoryLink + 'deletebrand', {
              BrandID: row.brandID,
              PinCode: pin,
              UserID: this.globaldata.getUserID()

            }).subscribe(
              (Response: any) => {
                if (Response.msg == 'Data Deleted Successfully') {
                  this.msg.SuccessNotify(Response.msg);
                  this.getBrandList();
                  this.app.stopLoaderDark();


                } else {
                  this.msg.WarnNotify(Response.msg);
                  this.app.stopLoaderDark();
                }
              },
              (error: any) => {
                this.app.stopLoaderDark();
              }
            )

          }
        })


      }
    }
    )



  }




  brandImage: any = '';

  onImgSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const imgSize = file.size;
    const isConvert: number = parseFloat((imgSize / 1048576).toFixed(2));

    ////////////// will check the file type ////////////////
    if (this.globaldata.getExtension(event.target.value) !== 'pdf') {
      const fileReader: FileReader = new FileReader();

      fileReader.onload = async () => {
        const originalBase64 = fileReader.result as string;

        // 👉 if file size > 1MB, compress before assigning
        if (isConvert > 1) {
          this.msg.WarnNotify('File Size is more than 1MB, compressing...');
          this.brandImage = await this.compressBase64(originalBase64, 400, 400, 0.5);
        } else {
          // assign compressed anyway (smaller size, faster upload)
          this.brandImage = await this.compressBase64(originalBase64, 400, 400, 0.5);
        }

        console.log(this.brandImage);
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
      this.brandImage = '';
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




  linkWithApp(item: any) {



    Swal.fire({
      title: 'Do you want to link Brand with app?',
      showCancelButton: true,
      confirmButtonText: "Confirm",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        var postData: any = {
          FlagType: 'Brand',
          FlagID: item.brandID,
          FlagStatus: !item.linkWithApp,
        }

        this.http.post(environment.mainApi + this.globaldata.inventoryLink + 'LinkWithMobApp', postData).subscribe(
          {
            next: (Response: any) => {
              if (Response.msg == 'Data Updated Successfully') {
                this.msg.SuccessNotify(Response.msg);
                item.linkWithApp = !item.linkWithApp;


              } else {
                this.msg.WarnNotify(Response.msg);
              }
            },
            error: error => {
              console.log(error);
            }
          }

        )

      }
    });



  }


}