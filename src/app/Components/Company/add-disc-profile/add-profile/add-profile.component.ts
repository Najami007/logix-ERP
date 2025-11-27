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
  selector: 'app-add-profile',
  templateUrl: './add-profile.component.html',
  styleUrls: ['./add-profile.component.scss']
})
export class AddProfileComponent implements OnInit {


  @Output() saveEmitter = new EventEmitter();


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
    this.getCityNames();
  }


  btnType: any = 'Save';


  partyID: any = 0;
  partyType: any = 'Customer-Disc';
  partyName: any = '';
  partyCNIC: any = '';
  passportNo: any = '';
  partyMobileno: any = '';
  partyTelephoneno: any = '';
  bankName: any = '';
  accountTitle: any = '';
  accountNo: any = '';
  ntn: any = '';
  strn: any = '';
  cityID: any = 0;
  partyAddress: any = ''
  description: any = '';
  cusDisc:any = '';



  //////////////////////////////////////////////////////
  //////////////////////getting the City Names/////////////////
  //////////////////////////////////////////////////////////////

  CitiesNames: any = []

  getCityNames() {
    this.http.get(environment.mainApi + this.global.companyLink + 'getcity').subscribe(
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

    if (this.partyType == "" || this.partyType == undefined) {
      this.msg.WarnNotify("Select The Party Type");
      return;
    }
    if (this.partyName == "" || this.partyName == undefined) {
      this.msg.WarnNotify("Enter The Party Name");
      return;
    }
    if (this.cityID == 0 || this.cityID == undefined) {
      this.msg.WarnNotify("Select The City");
      return;
    }
    if (this.partyCNIC.length > 1 && this.partyCNIC.length < 15) {
      this.msg.WarnNotify("Please Enter the Valid CNIC No.");
      return;
    }
    if (this.partyMobileno.length > 1 && this.partyMobileno.length < 12) {
      this.msg.WarnNotify("Please Enter the Valid Mobile NO.");
      return;
    }

    if (this.partyTelephoneno.length > 1 && this.partyTelephoneno.length < 11) {
      this.msg.WarnNotify("Please Enter the Valid Telephone NO.");
      return;
    }

    if(this.cusDisc == '' || this.cusDisc == 0 || this.cusDisc == 0){
      this.msg.WarnNotify('Enter Disc');
        return;
    }


    var postData = {

      PartyID: this.partyID,
      PartyType: this.partyType,
      PartyName: this.partyName,
      PartyAddress: this.partyAddress || '-',
      cusDisc:this.cusDisc ,
      PartyCNIC: this.partyCNIC || '-',
      BankName: this.bankName || '-',
      BankAccountTitle: this.accountTitle || '-',
      BankAccountNo: this.accountNo || '-',
      CityID: this.cityID,
      NTN: this.ntn || '-',
      STRN: this.strn || '-',
      PassportNo: this.passportNo || '-',
      PartyMobileNo: this.partyMobileno || '-',
      TelephoneNo: this.partyTelephoneno || '-',
      PartyDescription: this.description || '-',
      UserID: this.global.getUserID(),

    }

    if (this.btnType == 'Save') {
      this.insert('insert', '', postData)
    }

    if (this.btnType == 'Update') {

      this.global.openPinCode().subscribe(pin => {
        if (pin != '') {
          this.insert('update', pin, postData);
        }
      })
    }




  }


  insert(type: any, pinCode: any, postData: any) {
    var url = ''
    if (type == 'insert') {
      url = 'insertparty'
    }

    if (type == 'update') {
      url = 'updateparty';
      postData['PinCode'] = pinCode;
    }

    $('.loaderDark').show();

    this.http.post(environment.mainApi + this.global.companyLink + url, postData).subscribe(
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

  autoEmpty:any = false;
  reset() {

    if (!this.autoEmpty) {
      this.partyName = '';
      this.partyMobileno = '';
      this.partyCNIC = '';
      this.btnType = "Save";
    } else {
      this.cusDisc = 0;
      this.ntn = '';
      this.description = '';
      this.partyName = '';
      this.partyCNIC = '';
      this.bankName = '';
      this.accountNo = '';
      this.accountTitle = '';
      this.partyTelephoneno = '';
      this.partyMobileno = '';
      this.cityID = 0;
      this.passportNo = '';
      this.partyAddress = "";
      this.description = '';
      this.btnType = "Save";
    }
  }

}

