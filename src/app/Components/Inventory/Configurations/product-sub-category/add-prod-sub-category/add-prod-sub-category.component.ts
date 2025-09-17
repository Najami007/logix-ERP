import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
import * as $ from 'jquery';

@Component({
  selector: 'app-add-prod-sub-category',
  templateUrl: './add-prod-sub-category.component.html',
  styleUrls: ['./add-prod-sub-category.component.scss']
})
export class AddProdSubCategoryComponent {



  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<AddProdSubCategoryComponent>,
    private global: GlobalDataModule,
    private msg: NotificationService,
  ) { }

  ngOnInit(): void {
    this.getCategory();
    setTimeout(() => {
      $('#category').trigger('focus')
    }, 500);

  }


  categorySearch: any;
  categoryID: any;
  subCategoryTitle: any;
  categoryList: any = [];
  subCategoryList: any = [];
  subCategoryID: any;
  description: any;



  getCategory() {
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetCategory').subscribe(
      (Response: any) => {
        this.categoryList = Response;
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

      $('.loaderDark').show();
      this.http.post(environment.mainApi + this.global.inventoryLink + 'InsertSubCategory', {
        CategoryID: this.categoryID,
        SubCategoryTitle: this.subCategoryTitle,
        SubCategoryDescription: this.description,
        SubCatImage:'',
        UserID: this.global.getUserID()
      }).subscribe(
        (Response: any) => {
          if (Response.msg == 'Data Saved Successfully') {
            this.msg.SuccessNotify(Response.msg);
            this.reset();
            this.dialogRef.close('Update');
            $('.loaderDark').fadeOut(500);

          } else {
            this.msg.WarnNotify(Response.msg);
            $('.loaderDark').fadeOut(500);
          }
        },
        (error: any) => {
          $('.loaderDark').fadeOut(500);
        }
      )

    }

  }


  reset() {
    this.categoryID = '';
    this.subCategoryID = '';
    this.subCategoryTitle = '';
    this.description = '';
  }

  closeDialogue() {
    this.dialogRef.close();
  }

}
