import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

@Component({
  selector: 'app-add-rider-profile',
  templateUrl: './add-rider-profile.component.html',
  styleUrls: ['./add-rider-profile.component.scss']
})
export class AddRiderProfileComponent {



    crudList: any = { c: true, r: true, u: true, d: true };
  
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


    partyName:any = '';
    contactNo:any = '';

    partyAddress:any = '';
    description:any = '';





    save(){

    }




    reset(){
      
    }




    
  partyImg:any = '';

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
          this.partyImg = await this.compressBase64(originalBase64, 400, 400, 0.5);
        } else {
          // assign compressed anyway (smaller size, faster upload)
          this.partyImg = await this.compressBase64(originalBase64, 400, 400, 0.5);
        }

        console.log(this.partyImg);
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


