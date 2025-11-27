import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { error } from 'jquery';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-app-home-panel',
  templateUrl: './app-home-panel.component.html',
  styleUrls: ['./app-home-panel.component.scss']
})
export class AppHomePanelComponent {

  apiReq = environment.mainApi + this.global.mobileLink;
  crudList: any = { c: true, r: true, u: true, d: true };

  constructor(private http: HttpClient,
    private msg: NotificationService,
    private dialogue: MatDialog,
    public global: GlobalDataModule,
    private app: AppComponent,
    private route: Router,
    private titleService: Title

  ) {

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());

    })
  }


  ngOnInit(): void {
    this.global.setHeaderTitle('APP Home Screen');
    this.getHomePageData();
    this.getCategoryList();

  }


  containerID = 0;
  containerTitle: any = '';
  containerType: any = '';
  containerImg: any = '';
  categoryID: any = 0;
  subCategoryID: any = 0;


  tmpContainerRow: any = [];


  openEditModal(item: any) {
    this.containerID = item.hpID;
    this.tmpContainerRow = item;
    this.containerTitle = item.title;
    this.containerType = item.type;
    this.containerImg = item.imagesPath;
    this.categoryID = item.categoryID;
    this.getSubCategory();
    this.subCategoryID = item.subCategoryID;
    this.global.openBootstrapModal('#changeDetail', true)
  }

  homePageDataList: any = [];

  getHomePageData() {
    this.http.get(this.apiReq + 'GetHomePageImage').subscribe(
      {
        next: (Response: any) => {

          this.homePageDataList = Response;

        },
        error: error => {
          console.log(error);
        }
      }
    )
  }




  reset() {
    this.containerID = 0;
    this.containerImg = '';
    this.containerTitle = '';
    this.containerType = '';
  }


  categoryList: any = [];
  subCategoryList: any = [];
  tmpCategoryList: any = [];


  getSubCategory() {
    this.subCategoryID = 0;
    this.subCategoryList = [];
    if (this.categoryID > 0) {
      this.subCategoryList = this.tmpCategoryList.filter((e: any) => e.subCategoryID > 0 && e.categoryID == this.categoryID);
    }

  }

  getCategoryList() {

    var url = this.apiReq + 'GetMobCategory';

    this.http.get(url).subscribe(
      {
        next: (Response: any) => {
          this.tmpCategoryList = Response;
          if (Response.length > 0) {
            this.categoryList = this.tmpCategoryList.filter((e: any) => e.subCategoryID == 0);
          }
        },
        error: error => {
          console.log(error);
        }
      }
    )
  }



  updateBannerData() {
    if (this.containerTitle == '') {
      this.msg.WarnNotify('Enter Title');
      return;
    }

    if (this.containerType == '') {
      this.msg.WarnNotify('Select type');
      return;
    }

    if (this.categoryID == 0) {
      this.msg.WarnNotify('Select Category');
      return;
    }
    if (this.subCategoryID == 0) {
      this.msg.WarnNotify('Select Sub Category');
      return;
    }


    if (this.containerImg == '' || this.containerImg == undefined || this.containerImg == null) {
      this.msg.WarnNotify('Select Img');
      return;
    }

    var postData: any = {
      HpID: this.containerID,
      Title: this.containerTitle,
      Type: this.containerType,
      CategoryID: this.categoryID,
      SubCategoryID: this.subCategoryID,
      HpImage: this.global.isBase64Image(this.containerImg) ? this.containerImg : '-'
    }
    this.app.startLoaderDark();
    this.http.post(this.apiReq + 'AddHomePageImage', postData).subscribe(
      {
        next: (Response: any) => {

          if (Response.msg == 'Data Saved Successfully' || Response.msg == 'Data Updated Successfully') {
            this.msg.SuccessNotify(Response.msg);
            this.reset();
            this.getHomePageData();
          } else {
            this.msg.WarnNotify(Response.msg);
          }
          this.app.stopLoaderDark();
          this.global.closeBootstrapModal('#changeDetail', true)
        },
        error: error => {
          this.msg.WarnNotify(error.error.msg);
          this.app.stopLoaderDark();
          console.log(error);
        }
      }
    )
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
          this.msg.WarnNotify('File Size is more than 1MB, compressing...');
          this.containerImg = await this.compressBase64(originalBase64);
        } else {
          // assign compressed anyway (smaller size, faster upload)
          this.containerImg = await this.compressBase64(originalBase64);
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
      this.containerImg = '';
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


}
