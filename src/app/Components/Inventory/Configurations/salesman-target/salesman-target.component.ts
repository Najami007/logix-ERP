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
  selector: 'app-salesman-target',
  templateUrl: './salesman-target.component.html',
  styleUrls: ['./salesman-target.component.scss']
})
export class SalesmanTargetComponent implements OnInit {

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
    this.getBookerList();
    this.getCategory();


  }

  bookerID:any = 0;
  categoryID:any = 0;
  subCategoryID:any = 0;


  txtSearch: any;
  brandTitle: any;
  brandCode: any;
  description: any;
  brandID: number = 0;
  btnType: any = 'Save';

  BrandList: any = [];

  BookerList:any = [];

  getBookerList(){
        this.globaldata.getBookerList().subscribe((data: any) => { this.BookerList = data; });

  }


  CategoriesList:any = [];
  /////////////////////// List of Categories //////////////////
  getCategory() {
    this.http.get(environment.mainApi + this.globaldata.inventoryLink + 'GetCategory').subscribe(
      (Response: any) => {
        this.CategoriesList = Response;
      }
    )
  }


    ////////////////////// Sub Categories List /////////////
SubCategoriesList:any = [];
  getSubCategory() {
    this.subCategoryID = 0;
    this.http.get(environment.mainApi + this.globaldata.inventoryLink + 'GetSubCategory').subscribe(
      (Response: any) => {
        if(Response.length > 0){
          this.SubCategoriesList = Response.filter((e: any) => e.categoryID == this.categoryID);
        }

      }
    )
  }



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




  save() {
    if (this.brandTitle == '' || this.brandTitle == undefined) {
      this.msg.WarnNotify('Enter Category Title')
    } else if (this.brandCode == '' || this.brandCode == undefined) {
      this.msg.WarnNotify('Enter Brand Code')
    } else {

      if (this.description == '' || this.description == undefined) {
        this.description = '-';
      }


      var postData: any = {
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
  
    this.btnType = 'Save';

  }


  edit(row: any) {

      this.btnType = 'Update';

  }

  delete(row: any) {


    var postData = {

    }

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

            this.http.post(environment.mainApi + this.globaldata.inventoryLink + 'deletebrand',postData).subscribe(
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



}
