import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PincodeComponent } from 'src/app/Components/User/pincode/pincode.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { RecipeCategoryComponent } from '../recipe-category.component';

@Component({
  selector: 'app-addrecipe-category',
  templateUrl: './addrecipe-category.component.html',
  styleUrls: ['./addrecipe-category.component.scss']
})
export class AddrecipeCategoryComponent implements OnInit {

  crudList: any = { c: true, r: true, u: true, d: true };

  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private global: GlobalDataModule,
    private dialog: MatDialog,
    private route: Router,
    private app: AppComponent,
    // @Inject (MAT_DIALOG_DATA) public data:any,
    // private dialogRef:MatDialogRef<AddMenuCategoryComponent>

  ) {
    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })
  }


  ngOnInit(): void {

  }


  @Output() refreshTableEmitter = new EventEmitter();

  RecipeCatID: any;

  btnType: any = 'Save';
  categoryTitle: any = '';
  description: any = '';



  save() {

    if (this.categoryTitle == '' || this.categoryTitle == undefined) {
      this.msg.WarnNotify('Enter Category Title');
    } else {

      if (this.btnType == 'Save') {
        this.app.startLoaderDark();

        this.http.post(environment.mainApi + this.global.restaurentLink + 'InsertRecipeCategory', {
          RecipeCatTitle: this.categoryTitle,

          UserID: this.global.getUserID(),
        }).subscribe(
          (Response: any) => {
            if (Response.msg == 'Data Saved Successfully') {

              this.msg.SuccessNotify(Response.msg);
              this.refreshTableEmitter.emit();
              this.categoryTitle = '';
              this.app.stopLoaderDark();
              this.reset();

            } else {
              this.msg.WarnNotify(Response.msg);
              this.app.stopLoaderDark();
            }
          }
        )
      } else if (this.btnType == 'Update') {

        this.global.openPinCode().subscribe(pin => {
          if (pin != '') {
            this.app.startLoaderDark();

            this.http.post(environment.mainApi + this.global.restaurentLink + 'UpdateRecipeCategory', {
              RecipeCatID: this.RecipeCatID,
              RecipeCatTitle: this.categoryTitle,
              PinCode: pin,


              UserID: this.global.getUserID(),
            }).subscribe(
              (Response: any) => {
                if (Response.msg == 'Data Updated Successfully') {

                  this.msg.SuccessNotify(Response.msg);
                  this.refreshTableEmitter.emit();
                  this.categoryTitle = '';
                  this.app.stopLoaderDark();
                  this.reset();

                } else {
                  this.msg.WarnNotify(Response.msg);
                  this.app.stopLoaderDark();
                }
              }
            )
          }
        })

      }

    }


  }


  reset() {
    this.categoryTitle = '';
    this.btnType = 'Save';
    this.RecipeCatID = 0;

  }




}
