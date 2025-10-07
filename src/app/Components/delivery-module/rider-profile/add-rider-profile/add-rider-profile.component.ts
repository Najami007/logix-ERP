import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { error } from 'jquery';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-add-rider-profile',
  templateUrl: './add-rider-profile.component.html',
  styleUrls: ['./add-rider-profile.component.scss']
})
export class AddRiderProfileComponent {


  apiReq = environment.mainApi + this.global.mobileLink;
  crudList: any = { c: true, r: true, u: true, d: true };

  @Output() updateEmitter = new EventEmitter();

  constructor(private http: HttpClient,
    private msg: NotificationService,
    private dialogue: MatDialog,
    public global: GlobalDataModule,
    private route: Router,
    private titleService: Title

  ) {

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());

    })


  }
  ngOnInit(): void {
  }


  btnType = 'Save';


  partyName: any = '';
  contactNo: any = '';

  partyAddress: any = '';
  description: any = '';


  MobUserID: any = 0;
  FirstName: any = ''
  LastName: any = '';
  MobileNo: any = '';
  Email: any = '';
  Password: any = '';
  userAddress: any = '';





  save() {

    if (this.FirstName == '') {
      this.msg.WarnNotify('Enter First Name');
      return;
    }

    if (this.LastName == '') {
      this.msg.WarnNotify('Enter Last Name');
      return;
    }

    if (this.Email == '') {
      this.msg.WarnNotify('Enter Email');
      return;
    }

    if (this.MobileNo == '') {
      this.msg.WarnNotify('Enter Mobile No');
      return;
    }

    if (this.userAddress == '') {
      this.msg.WarnNotify('Enter Address');
      return;
    }

    if (this.Password == '' && this.MobUserID == 0) {
      this.msg.WarnNotify('Enter Password');
      return;
    }

    if (this.Password.length < 4 && this.MobUserID == 0) {
      this.msg.WarnNotify('Password must be more then 4 digits');
      return;
    }


    var postData: any = {
      MobUserID: this.MobUserID,
      FirstName: this.FirstName,
      LastName: this.LastName,
      MobileNo: this.MobileNo,
      Email: this.Email,
      Password: this.Password,
      userAddress: this.userAddress || '-',
      MobUserImage: this.partyImg,
      UserType: "Rider",
      RegType: "Normal",
      PinCode: ''
    }

    if (this.btnType == 'Save') {
      this.insert(postData, 'insert')
    }

    if (this.btnType == 'Update') {
      this.global.openPinCode().subscribe(pin => {
        if (pin != '') {
          postData.PinCode = pin;

          this.insert(postData, 'update');
          if (this.isBase64Image(this.partyImg)) {
            this.insertUserImage(postData, 'insert');
          }
        }
      })

    }

  }


  insert(postData: any, type: any) {

    var url = ''

    if (type == 'insert') {
      url = 'InsertMobUser';
    }
    if (type == 'update') {
      url = 'UpdateMobUser';
    }

    this.http.post(this.apiReq + url, postData).subscribe(
      {
        next: (Response: any) => {

          if (Response.msg == 'Data Saved Successfully' || Response.msg == 'Data Updated Successfully') {
            this.msg.SuccessNotify(Response.msg);
            this.reset();
            this.updateEmitter.emit();
          } else {
            this.msg.WarnNotify(Response.msg);
          }

        },
        error: error => {
          console.log(error);
          this.msg.WarnNotify(error.error.msg);
        }
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



  insertUserImage(postData: any, type: any) {

    var url = ''

    if (type == 'insert') {
      url = 'UpdateMobUserImage';
    }


    this.http.post(this.apiReq + url, postData).subscribe(
      {
        next: (Response: any) => {

          if (Response.msg == 'Data Saved Successfully' || Response.msg == 'Data Updated Successfully') {
            this.msg.SuccessNotify(Response.msg);
            this.reset();
            setTimeout(() => {
              this.updateEmitter.emit();
            }, 1000);
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





  reset() {

    this.FirstName = '';
    this.LastName = '';
    this.Email = '';
    this.MobUserID = 0;
    this.MobileNo = '';
    this.userAddress = '';
    this.Password = '';
    this.partyImg = '';
    this.btnType = 'Save';

  }





  partyImg: any = '';

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
          this.partyImg = await this.compressBase64(originalBase64, 400, 400, 0.6);
        } else {
          // assign compressed anyway (smaller size, faster upload)
          this.partyImg = await this.compressBase64(originalBase64, 400, 400, 0.6);
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
      this.partyImg = '';
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


