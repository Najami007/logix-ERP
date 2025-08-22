import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AddcityComponent } from 'src/app/Components/Company/settings/city/addcity/addcity.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

import * as $ from 'jquery';

@Component({
  selector: 'app-add-shipping-company',
  templateUrl: './add-shipping-company.component.html',
  styleUrls: ['./add-shipping-company.component.scss']
})
export class AddShippingCompanyComponent implements OnInit {


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
  ngOnInit(): void {
    this.getCityNames();
  }


  btnType: any = 'Save';
  scAutoID = 0;
  ShpCmpName: any = '';
  OwnerName: any = '';
  RepName: any = '';
  ContactNo: any = '';
  CityID: any = 0;
  Description: any = '';




  //////////////////////////////////////////////////////
  //////////////////////getting the City Names/////////////////
  //////////////////////////////////////////////////////////////

  CitiesNames: any = []

  getCityNames() {
    this.http.get(environment.mainApi + this.globaldata.companyLink + 'getcity').subscribe(
      {
        next: value => {
          this.CitiesNames = value;
        },
        error: error => {
          console.log(error);
        }
      }
    )
  }
  /////////////////////////////////////////////////////////////////////////



  @ViewChild('city') mycity: any;

  addCity() {
    setTimeout(() => {
      this.mycity.close()

    }, 100);
    this.dialogue.open(AddcityComponent, {
      width: "40%",

    }).afterClosed().subscribe(val => {
      if (val == 'Update') {
        this.getCityNames();
      }
    })
  }


  save() {


    if (this.ShpCmpName == '' || this.ShpCmpName == undefined) {
      this.msg.WarnNotify('Enter Shipment Company Name');
      return;
    }

    if (this.OwnerName == '' || this.OwnerName == undefined) {
      this.msg.WarnNotify('Enter Owner Name');
      return;
    }

    if (this.RepName == '' || this.RepName == undefined) {
      this.msg.WarnNotify('Enter Company Representative Name');
      return;
    }

    if (this.ContactNo == '' || this.ContactNo == undefined) {
      this.msg.WarnNotify('Enter Contact No');
      return;
    }

    if (this.CityID == 0 || this.ContactNo == undefined) {
      this.msg.WarnNotify('Select City');
      return;
    }


    var postData: any = {
      SCAutoID: this.scAutoID,
      ShpCmpName: this.ShpCmpName,
      OwnerName: this.OwnerName,
      RepName: this.RepName,
      ContactNo: this.ContactNo,
      CityID: this.CityID,
      Description: this.Description || '-',
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
      url = 'InsertShpCmp'
    }

    if (type == 'update') {
      url = 'UpdateShpCmp';
      postData['PinCode'] = pinCode;
    }


    $('.loaderDark').show();

    this.http.post(environment.mainApi + this.globaldata.manufacturingLink + url, postData).subscribe(
      {
        next: (Response: any) => {
          if (Response.msg == 'Data Saved Successfully' || Response.msg == 'Data Updated Successfully') {
            this.msg.SuccessNotify(Response.msg);
             this.reset();
            this.saveEmitter.emit();
           

          } else {
            this.msg.WarnNotify(Response.msg);
          }
          $('.loaderDark').fadeOut();
        },
        error: error => {
          console.log(error)
          $('.loaderDark').fadeOut();
        }
      }
    )
  }


  reset() {

    this.ShpCmpName = '';
    this.scAutoID = 0;
    this.OwnerName = '';
    this.RepName = '';
    this.ContactNo = '';
    this.Description = '';
    this.CityID = 0;
    this.btnType = 'Save';

  }

}
