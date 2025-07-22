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

  constructor(private http: HttpClient,
    private msg: NotificationService,
    private dialogue: MatDialog,
    private globaldata: GlobalDataModule,
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




  save() {
    if (this.brandTitle == '' || this.brandTitle == undefined) {
      this.msg.WarnNotify('Enter Category Title')
    } else if (this.brandCode == '' || this.brandCode == undefined) {
      this.msg.WarnNotify('Enter Brand Code')
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
    this.http.post(environment.mainApi + this.globaldata.inventoryLink + 'insertbrand', {
      BrandTitle: this.brandTitle,
      BrandCode: this.brandCode,
      BrandDescription: this.description,
      UserID: this.globaldata.getUserID()
    }).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Saved Successfully') {
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

  update() {

    this.globaldata.openPinCode().subscribe(pin => {

      if (pin != '') {


        this.app.startLoaderDark();
        this.http.post(environment.mainApi + this.globaldata.inventoryLink + 'updateBrand', {
          BrandID: this.brandID,
          BrandTitle: this.brandTitle,
          BrandCode: this.brandCode,
          BrandDescription: this.description,
          PinCode: pin,
          UserID: this.globaldata.getUserID()
        }).subscribe(
          (Response: any) => {
            if (Response.msg == 'Data Updated Successfully') {
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
    })

  }



  reset() {
    this.brandCode = '';
    this.description = '';
    this.brandTitle = '';
    this.brandID = 0;
    this.btnType = 'Save';

  }


  edit(row: any) {
    this.brandID = row.brandID;
    this.brandTitle = row.brandTitle;
    this.brandCode = row.brandCode;
    this.description = row.brandDescription;
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

}