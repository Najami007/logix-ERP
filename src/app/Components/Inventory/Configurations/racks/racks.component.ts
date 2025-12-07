import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { PincodeComponent } from '../../../User/pincode/pincode.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-racks',
  templateUrl: './racks.component.html',
  styleUrls: ['./racks.component.scss']
})
export class RacksComponent implements OnInit {

  crudList: any = { c: true, r: true, u: true, d: true };
      AddNewProductRestrictionFeature = this.globaldata.AddNewProductRestrictionFeature;


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
    this.globaldata.setHeaderTitle('Racks');
    this.getRacksList();



  }

  txtSearch: any;
  rackTitle: any;
  rackID: number = 0;
  btnType: any = 'Save';
  description: any;

  RacksList: any = [];





  getRacksList() {
    this.http.get(environment.mainApi + this.globaldata.inventoryLink + 'getrack').subscribe(
      (Response: any) => {
        this.RacksList = Response;
      }
    )
  }



  save() {


     if(this.AddNewProductRestrictionFeature && this.btnType == 'Save'){
      this.msg.WarnNotify('Not Allowed to Add New Rack');
      return;
    }


    if (this.rackTitle == '' || this.rackTitle == undefined) {
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
    this.http.post(environment.mainApi + this.globaldata.inventoryLink + 'insertRack', {
      RackTitle: this.rackTitle,
      RackDescription: this.description,
      UserID: this.globaldata.getUserID()
    }).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Saved Successfully') {
          this.msg.SuccessNotify(Response.msg);
          this.getRacksList();
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
        this.http.post(environment.mainApi + this.globaldata.inventoryLink + 'updateRack', {
          RackID: this.rackID,
          RackTitle: this.rackTitle,
          RackDescription: this.description,
          PinCode: pin,
          UserID: this.globaldata.getUserID()
        }).subscribe(
          (Response: any) => {
            if (Response.msg == 'Data Updated Successfully') {
              this.msg.SuccessNotify(Response.msg);
              this.getRacksList();
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
    this.rackTitle = '';
    this.rackID = 0;
    this.description = '';
    this.btnType = 'Save';

  }


  edit(row: any) {
    this.rackID = row.rackID;
    this.rackTitle = row.rackTitle;
    this.description = row.rackDescription;
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
            this.http.post(environment.mainApi + this.globaldata.inventoryLink + 'deleteRack', {
              RackID: row.rackID,
              PinCode: pin,
              UserID: this.globaldata.getUserID()

            }).subscribe(
              (Response: any) => {
                if (Response.msg == 'Data Deleted Successfully') {
                  this.msg.SuccessNotify(Response.msg);
                  this.getRacksList();
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
