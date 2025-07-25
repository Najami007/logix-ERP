import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { error } from 'jquery';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent implements OnInit {

  crudList: any = { c: true, r: true, u: true, d: true };

  constructor(private http: HttpClient,
    private msg: NotificationService,
    private dialogue: MatDialog,
    private globaldata: GlobalDataModule,
    private app: AppComponent,
    private route: Router

  ) {
    this.globaldata.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })

  }
  ngOnInit(): void {
    this.globaldata.setHeaderTitle('Product Category');
    this.getCategory();

  }

  txtSearch: any;
  categoryTitle: any;
  description: any;
  categoryID: any;
  btnType: any = 'Save';

  categoryList: any = [];




  getCategory() {
    this.http.get(environment.mainApi + this.globaldata.inventoryLink + 'GetCategory').subscribe(
      (Response: any) => {
        this.categoryList = Response;
      }
    )
  }


  // getCrud(){
  //   this.http.get(environment.mainApi+'user/getusermenu?userid='+this.globaldata.getUserID()+'&moduleid='+this.globaldata.getModuleID()).subscribe(
  //     (Response:any)=>{
  //       this.crudList =  Response.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
  //     }
  //   )
  // }



  save() {
    if (this.categoryTitle == '' || this.categoryTitle == undefined) {
      this.msg.WarnNotify('Enter Category Title')
    } else {

      if (this.description == '' || this.description == undefined) {
        this.description = '-';
      }

      if (this.btnType == 'Save') {
        this.insert();
      } else if (this.btnType == 'Update') {
        this.update();

      }

    }

  }



  insert() {
    this.app.startLoaderDark();
    this.http.post(environment.mainApi + this.globaldata.inventoryLink + 'insertcategory', {
      CategoryTitle: this.categoryTitle,
      CategoryDescription: this.description,
      UserID: this.globaldata.getUserID()
    }).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Saved Successfully') {
          this.msg.SuccessNotify(Response.msg);
          this.getCategory();
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

  update() {
    this.globaldata.openPinCode().subscribe(pin => {

      if (pin != '') {
        this.app.startLoaderDark();
        this.http.post(environment.mainApi + this.globaldata.inventoryLink + 'updatecategory', {
          CategoryID: this.categoryID,
          CategoryTitle: this.categoryTitle,
          CategoryDescription: this.description,
          PinCode: pin,
          UserID: this.globaldata.getUserID()
        }).subscribe(
          (Response: any) => {
            if (Response.msg == 'Data Updated Successfully') {
              this.msg.SuccessNotify(Response.msg);
              this.getCategory();
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
    })

  }


  reset() {
    this.categoryTitle = '';
    this.description = '';
    this.btnType = 'Save';

  }


  edit(row: any) {
    this.categoryID = row.categoryID;
    this.categoryTitle = row.categoryTitle;
    this.description = row.categoryDescription;
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

            this.http.post(environment.mainApi + this.globaldata.inventoryLink + 'deletecategory', {
              CategoryID: row.categoryID,
              PinCode: pin,
              UserID: this.globaldata.getUserID()

            }).subscribe(
              (Response: any) => {
                if (Response.msg == 'Data Deleted Successfully') {
                  this.msg.SuccessNotify(Response.msg);
                  this.getCategory();
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


}
