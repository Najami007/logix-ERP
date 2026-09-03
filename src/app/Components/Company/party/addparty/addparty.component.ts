import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { AddcityComponent } from '../../settings/city/addcity/addcity.component';
import { environment } from 'src/environments/environment.development';

import * as $ from 'jquery';

@Component({
  selector: 'app-addparty',
  templateUrl: './addparty.component.html',
  styleUrls: ['./addparty.component.scss']
})
export class AddpartyComponent implements OnInit {


  crudList: any = { c: true, r: true, u: true, d: true };


  DigitalInvoicesFeature = this.global.DigitalInvoicesFeature;
  RouteFeature = this.global.RouteFeature;
  urduBillFeature = this.global.urduBill;


  @Output() updateEmitter = new EventEmitter();


  cnicMask = this.globalData.cnicMask;
  mobileMask = this.globalData.mobileMask;
  telephoneMask = this.globalData.phoneMask;


  constructor(private globalData: GlobalDataModule,
    private http: HttpClient,
    private msg: NotificationService,
    public global: GlobalDataModule,
    public app: AppComponent
  ) {

  }
  ngOnInit(): void {
    this.getCityNames();
    this.getRoutes();
    this.hideFields();
    this.getPartyNatureList()


    setTimeout(() => {
      $('#partyType').trigger('focus')
    }, 500);

  }




  partyNatureID = 0;
  autoEmpty = false;
  routeID = 0;
  searchtxt: any;
  btnType = "Save";
  curPartyId: any = 0;
  partyType: any;
  partyName: any = '';
  partyNameUrdu: any = '';
  partyCNIC: any = '';
  passportNo: any = '';
  partyPhoneno: any = '';
  partyMobileno: any = '';
  bankName: any = '';
  accountTitle: any = '';
  accountNo: any = '';
  partyTelephoneno: any = '';
  City: any;
  partyAddress: any = '';
  partyAddressUrdu: any = ''
  description: any = '';

  ntn: any = '';
  strn: any = '';
  validate = true;


  businessName: any = '';
  province: any = '';
  registrationType: any = '';
  registerationTypeList: any = [{ title: 'Registered' }, { title: 'Unregistered' },];
  provinceList: any = [{ title: 'Punjab' }, { title: 'Sindh' }, { title: 'KPK' }, { title: 'Balochistan' }, { title: 'Gilgit Baltistan' },]

  partyData: any = [];


  srPartyType = 'Customer';



  CitiesNames: any = []

  getCityNames() {
    this.http.get(environment.mainApi + this.globalData.companyLink + 'getcity').subscribe(
      {
        next: value => {
          this.CitiesNames = value;
          if (this.CitiesNames.length > 0) {
            this.City = this.CitiesNames[0].cityID;
          }
        },
        error: error => {
          console.log(error);
        }
      }
    )
  }

  routeList: any = [];
  getRoutes() {
    this.http.get(environment.mainApi + this.global.inventoryLink + 'getroute').subscribe(
      (Response) => {
        this.routeList = Response;
      },
      (Error) => {
        this.msg.WarnNotify('Error Occured')
      }
    )
  }


  
  partyNatureList: any = [];
  getPartyNatureList() {
    this.http.get(environment.mainApi + this.global.companyLink + 'GetPartyNature').subscribe(
      (Response) => {
        this.partyNatureList = Response;
      },
      (Error) => {
        console.log(Error);
        this.msg.WarnNotify('Error Occured')
      }
    )
  }




  @ViewChild('city') mycity: any;

  addCity() {
    // setTimeout(() => {
    //   this.mycity.close()

    // }, 100);
    // this.dialogue.open(AddcityComponent, {
    //   width: "40%",

    // }).afterClosed().subscribe(val => {
    //   if (val == 'Update') {
    //     this.getCityNames();
    //   }
    // })
  }



  saveParty() {
    if (this.partyType == "" || this.partyType == undefined) {
      this.msg.WarnNotify("Select The Party Type");
      return;
    }
    if (this.partyName == "" || this.partyName == undefined) {
      this.msg.WarnNotify("Enter The Party Name");
      return;

    }
    if (this.City == "" || this.City == undefined) {
      this.msg.WarnNotify("Select The City");
      return;
    }
    if (this.partyCNIC.length > 1 && this.partyCNIC.length < 13) {
      this.msg.WarnNotify("Please Enter the Valid CNIC No.");
      return;
    }
    if (this.partyMobileno.length > 1 && this.partyMobileno.length < 11) {
      this.msg.WarnNotify("Please Enter the Valid Mobile NO.");
      return;
    }

    if (this.partyTelephoneno.length > 1 && this.partyTelephoneno.length < 10) {
      this.msg.WarnNotify("Please Enter the Valid Telephone NO.");
      return;
    }

    if (this.RouteFeature && this.partyType == 'Customer' && this.routeID == 0) {
      this.msg.WarnNotify('Select Route');
      return;
    }

    var postData = {

      PartyID: this.curPartyId,
      PartyType: this.partyType,
      PartyName: this.partyName,
      PartyNameUrdu: this.partyNameUrdu || '-',
      PartyAddress: this.partyAddress || '-',
      PartyAddressUrdu: this.partyAddressUrdu || '-',

      PartyCNIC: this.partyCNIC || '-',
      BankName: this.bankName || '-',
      BankAccountTitle: this.accountTitle || '-',
      BankAccountNo: this.accountNo || '-',
      CityID: this.City,
      routeID: this.routeID,
      NTN: this.ntn || '-',
      STRN: this.strn || '-',
      PassportNo: this.passportNo || '-',
      PartyMobileNo: this.partyMobileno || '-',
      TelephoneNo: this.partyTelephoneno || '-',
      PartyDescription: this.description || '-',
      BusinessName: this.businessName || '-',
      RegistrationType: this.registrationType || 'Registered',
      Province: this.province || 'Punjab',
      UserID: this.globalData.getUserID(),
      PartyNatureID : this.partyNatureID ,

    }

    if (this.btnType == "Save") {
      this.app.startLoaderDark();

      this.http.post(environment.mainApi + this.globalData.companyLink + 'insertparty', postData).subscribe(
        (Response: any) => {
          if (Response.msg == 'Data Saved Successfully') {
            this.msg.SuccessNotify(Response.msg);
            this.updateEmitter.emit();
            this.reset();
            this.focusPartyName();
          } else {
            this.msg.WarnNotify(Response.msg);
          }
          this.app.stopLoaderDark();
        },
        (error: any) => {
          console.log(error);
          this.app.stopLoaderDark();
        }
      )
    } else if (this.btnType == 'Update') {


      this.globalData.openPinCode().subscribe(pin => {
        if (pin != '') {
          postData['PinCode'] = pin;
          this.app.startLoaderDark();

          this.http.post(environment.mainApi + this.globalData.companyLink + 'updateparty', postData).subscribe(
            (Response: any) => {


              if (Response.msg == 'Data Updated Successfully') {
                this.msg.SuccessNotify(Response.msg);
                this.updateEmitter.emit();
                this.reset();
                this.focusPartyName();
              } else {

                this.msg.WarnNotify(Response.msg);
              }
              this.app.stopLoaderDark();

            },
            (error: any) => {
              console.log(error);
              this.app.stopLoaderDark();


            }

          )
        }
      })
    }




  }



  reset() {

    if (!this.autoEmpty) {
      this.partyName = '';
      this.partyNameUrdu = '';
      this.businessName = '';
      this.partyMobileno = '';
      this.partyCNIC = '';
      this.btnType = "Save";
      this.hideFields();

    } else {
      this.ntn = '';
      this.description = '';
      this.partyType = '';
      this.partyName = '';

      this.partyCNIC = '';
      this.bankName = '';
      this.accountNo = '';
      this.accountTitle = '';
      this.partyTelephoneno = '';
      this.partyMobileno = '';
      this.City = '';
      this.passportNo = '';
      this.partyAddress = "";
      this.partyAddressUrdu = '';
      this.description = '';
      this.province = '';
      this.registrationType = '';
      this.btnType = "Save";
      this.routeID = 0;
      this.hideFields();

    }
    // this.dialogRef.close('Update');
  }




  focusPartyName() {

    $('#partyName').trigger('focus');
    setTimeout(() => {
      $('#partyName').trigger('select');
    }, 200);
  }








  fields = {
    partyType: { show: true, size: 'col-md-3' },
    partyName: { show: true, size: 'col-md-6' },
    partyNameUrdu: { show: true, size: 'col-md-6' },
    businessName: { show: true, size: 'col-md-3' },
    registrationType: { show: true, size: 'col-md-3' },
    partyNature:{ show: true, size: 'col-md-3' },
    province: { show: true, size: 'col-md-3' },
    cnic: { show: true, size: 'col-md-3' },
    passport: { show: true, size: 'col-md-3' },
    mobileNo: { show: true, size: 'col-md-3' },
    telephoneNo: { show: true, size: 'col-md-3' },
    bankName: { show: true, size: 'col-md-3' },
    accountTitle: { show: true, size: 'col-md-3' },
    accountNo: { show: true, size: 'col-md-3' },
    ntn: { show: true, size: 'col-md-3' },
    strn: { show: true, size: 'col-md-3' },
    city: { show: true, size: 'col-md-3' },
    route: { show: true, size: 'col-md-3' },
    address: { show: true, size: 'col-md-6' },
    addressUrdu: { show: true, size: 'col-md-6' },
    description: { show: true, size: 'col-md-12' },

  };





  hideFields() {

    if (this.DigitalInvoicesFeature) {

      [

        'passport',
        'bankName',
        'accountTitle',
        'accountNo',
        'strn',
        'route',
      ].forEach(field => {
        this.fields[field].show = false;
      });


    }

    if (!this.urduBillFeature) {
      this.fields.partyNameUrdu.show = false;
    }

    if (!this.RouteFeature) {
      this.fields.route.show = false;
    }

    this.btnType === 'Update'
      ? this.fields.partyType.show = false
      : this.fields.partyType.show = true;



  }



}
