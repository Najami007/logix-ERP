import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { NotificationService } from 'src/app/Shared/service/notification.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';
import { AppComponent } from 'src/app/app.component';

import { Router } from '@angular/router';
import { PincodeComponent } from '../../../User/pincode/pincode.component';


@Component({
  selector: 'app-product-sub-category',
  templateUrl: './product-sub-category.component.html',
  styleUrls: ['./product-sub-category.component.scss']
})
export class ProductSubCategoryComponent implements OnInit {

  crudList: any = { c: true, r: true, u: true, d: true };
      appConfigFeature = this.globaldata.appConfigFeature;

  constructor(private http: HttpClient,
    private msg: NotificationService,
    private dialogue: MatDialog,
    public globaldata: GlobalDataModule,
    private app: AppComponent,
    private route: Router

  ) {
    this.globaldata.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })

  }



  ngOnInit(): void {
    this.globaldata.setHeaderTitle('Sub Category');
    this.getCategory();
    this.getSubCategory();


  }


  txtSearch: any;
  btnType: string = 'Save';
  categorySearch: any;
  categoryID: any = 0;
  subCategoryTitle: any = '';
  categoryList: any = [];
  subCategoryList: any[] = [];
  subCategoryID: any = 0;
  description: any = '';




  ///////////////////////////////////////////////////////////

  getCategory() {
    this.http.get(environment.mainApi + this.globaldata.inventoryLink + 'GetCategory').subscribe(
      (Response: any) => {
        this.categoryList = Response;
      }
    )
  }


  /////////////////////////////////////////////////////////////////////

  getSubCategory() {
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });
    this.http.get(environment.mainApi + this.globaldata.inventoryLink + 'GetSubCategory', { headers: reqHeader }).subscribe(
      (Response: any) => {
        this.subCategoryList = Response;
      }
    )
  }





  save() {
    if (this.categoryID == '' || this.categoryID == undefined) {
      this.msg.WarnNotify('Enter Category Title')
    } else if (this.subCategoryTitle == '' || this.subCategoryTitle == undefined) {
      this.msg.WarnNotify('Enter Sub Category Title')
    } else {

      if (this.description == '' || this.description == undefined) {
        this.description = '-';
      }


      var postData: any = {
        SubCategoryID: this.subCategoryID || 0,
        CategoryID: this.categoryID,
        SubCategoryTitle: this.subCategoryTitle,
        SubCategoryDescription: this.description,
        subCatImage: this.subCatImage,
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
    console.log(postData);
    var url = '';
    if (type == 'insert') {
      url = 'InsertSubCategory'
    }
    if (type == 'update') {
      url = 'UpdateSubCategory'
    }

    this.http.post(environment.mainApi + this.globaldata.inventoryLink + url, postData).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Saved Successfully' || Response.msg == 'Data Updated Successfully') {
          this.msg.SuccessNotify(Response.msg);
          this.getSubCategory();
          this.reset();
          this.app.stopLoaderDark();

        } else {
          this.msg.WarnNotify(Response.msg);
          this.app.stopLoaderDark();
        }
      },
      (error: any) => {
        console.log(error);
        this.app.stopLoaderDark();
      }
    )
  }





  reset() {
    this.categoryID = 0;
    this.subCategoryID = 0;
    this.subCategoryTitle = '';
    this.description = '';
    this.subCatImage = '';
    this.btnType = 'Save';
  }


  edit(row: any) {
    this.categoryID = row.categoryID;
    this.subCategoryID = row.subCategoryID;
    this.subCategoryTitle = row.subCategoryTitle;
    this.description = row.subCategoryDescription;
    this.subCatImage = row.subCatImage;
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

            this.http.post(environment.mainApi + this.globaldata.inventoryLink + 'DeleteSubCategory', {
              SubCategoryID: row.subCategoryID,
              PinCode: pin,
              UserID: this.globaldata.getUserID()

            }).subscribe(
              (Response: any) => {
                if (Response.msg == 'Data Deleted Successfully') {
                  this.msg.SuccessNotify(Response.msg);
                  this.getSubCategory();
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
    })



  }




  subCatImage: any = '';

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
          this.subCatImage = await this.compressBase64(originalBase64, 400, 400, 0.5);
        } else {
          // assign compressed anyway (smaller size, faster upload)
          this.subCatImage = await this.compressBase64(originalBase64, 400, 400, 0.5);
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
      this.subCatImage = '';
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
        title: 'Do you want to link Sub category with app?',
        showCancelButton: true,
        confirmButtonText: "Confirm",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
  
          var postData: any = {
            FlagType: 'SubCat',
            FlagID: item.subCategoryID,
            FlagStatus: !item.linkWithApp ,
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
