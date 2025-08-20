import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent {


  @Output() saveEmitter = new EventEmitter();


  crudList: any = { c: true, r: true, u: true, d: true };

  constructor(private http: HttpClient,
    private msg: NotificationService,
    private dialogue: MatDialog,
    private globaldata: GlobalDataModule,
    private route: Router,
    private titleService: Title

  ) {

    this.globaldata.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());

    })


  }


  btnType: any = 'Save';
  MnuItemCatID = 0;
  categoryTitle = '';






  save() {


    if (this.categoryTitle == '' || this.categoryTitle == undefined) {
      this.msg.WarnNotify('Enter Category Title');
      return;
    }



    var postData: any = {
      MnuItemCatID: this.MnuItemCatID,
      MnuItemCatTitle: this.categoryTitle,
      UserID: this.globaldata.getUserID()
    }

    if (this.btnType == 'Save') {
      this.insert('insert', '', postData)
    }

    if (this.btnType == 'Update') {

      this.globaldata.openPinCode().subscribe(pin => {
        if (pin != '') {
          this.insert('update', pin, postData);
        }
      })
    }




  }


  insert(type: any, pinCode: any, postData: any) {
    var url = ''

    if (type == 'insert') {
      url = 'InsertMnuItemCategory'
    }

    if (type == 'update') {
      url = 'UpdateMnuItemCategory';
      postData['PinCode'] = pinCode;
    }


    $('.loaderDark').show();
    this.http.post(environment.mainApi + this.globaldata.manufacturingLink + url, postData).subscribe(
      {
        next: (Response: any) => {
          if (Response.msg == 'Data Saved Successfully' || Response.msg == 'Data Updated Successfully') {
            this.msg.SuccessNotify(Response.msg);
            this.saveEmitter.emit();

          } else {
            this.msg.WarnNotify(Response.msg);
          }
          $('.loaderDark').fadeOut();
        },
        error: error => {
          console.log(error);
          $('.loaderDark').fadeOut()
        }
      }
    )
  }


  reset() {

    this.MnuItemCatID = 0;
    this.categoryTitle = '';
    this.btnType = 'Save';

  }

}
