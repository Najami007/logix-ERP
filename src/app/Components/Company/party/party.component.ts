import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';
import { PincodeComponent } from '../../User/pincode/pincode.component';
import { AddcityComponent } from '../settings/city/addcity/addcity.component';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { AddpartyComponent } from './addparty/addparty.component';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.scss']
})
export class PartyComponent implements OnInit {


  @ViewChild(AddpartyComponent) addParty: any;

  DigitalInvoicesFeature = this.global.DigitalInvoicesFeature;
  loadingBar = 'start';

  page: number = 1;
  count: number = 0;

  tableSize: number = 10;
  tableSizes: any = [];

  onTableDataChange(event: any) {

    this.page = event;
    this.getParty();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getParty();
  }


  cnicMask = this.globalData.cnicMask;
  mobileMask = this.globalData.mobileMask;
  telephoneMask = this.globalData.phoneMask;

  crudList: any = { c: true, r: true, u: true, d: true };

  constructor(private globalData: GlobalDataModule,

    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    private dialogue: MatDialog,
    private route: Router,
    public global: GlobalDataModule
  ) {
    this.globalData.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })

  }
  ngOnInit(): void {
    this.globalData.setHeaderTitle('Add Party');
    this.getParty();
    //  this.tableSize = this.globalData.paginationDefaultTalbeSize;
    this.tableSizes = this.globalData.paginationTableSizes;
  }




  //////////////////////////////////////////////


  searchtxt: any;
  curPartyId: any;
  validate = true;
  partyData: any = [];
  srPartyType = 'Customer';


  getParty() {
    if (this.srPartyType == 'Customer') {
      this.http.get(environment.mainApi + this.globalData.companyLink + 'getcustomer').subscribe(
        {
          next: value => {
            this.partyData = value;
            this.loadingBar = 'Stop';
          },
          error: error => {
            this.msg.WarnNotify('Error Occured While Loading Data');
          }
        }
      )
    } else if (this.srPartyType == 'Supplier') {
      this.http.get(environment.mainApi + this.globalData.companyLink + 'getsupplier').subscribe(
        {
          next: value => {
            this.partyData = value;
            this.loadingBar = 'Stop';


          },
          error: error => {
            this.msg.WarnNotify('Error Occured While Loading Data')

          }


        }
      )
    }
  }



  editParty(item: any) {
    this.addParty.curPartyId = item.partyID;
    this.addParty.ntn = item.ntn;
    this.addParty.strn = item.strn;
    this.addParty.partyType = item.partyType;
    this.addParty.partyName = item.partyName;
    this.addParty.partyNameUrdu = item.partyNameUrdu;
    this.addParty.partyCNIC = item.partyCNIC;
    this.addParty.passportNo = item.passportNo;
    this.addParty.partyMobileno = item.partyMobileNo;
    this.addParty.partyTelephoneno = item.telephoneNo;
    this.addParty.partyAddress = item.partyAddress;
    this.addParty.partyAddressUrdu = item.partyAddressUrdu;
    this.addParty.bankName = item.bankName;
    this.addParty.accountNo = item.bankAccountNo;
    this.addParty.accountTitle = item.bankAccountTitle;
    this.addParty.City = item.cityID.toString();
    this.addParty.routeID = item.routeID;
    this.addParty.description = item.partyDescription;
    this.addParty.businessName = item.businessName;

    this.addParty.registrationType = item.registrationType;
    this.addParty.province = item.province;
    this.addParty.partyNatureID = item.partyNatureID;
    this.addParty.btnType = "Update";
    this.addParty.focusPartyName();
    this.addParty.hideFields();
    // this.addParty.fields.partyType.show = false;




  }

  ////////////////to Delete The Party/////////////////////////
  DeleteParty(row: any) {

    this.globalData.openPinCode().subscribe(pin => {
      if (pin != '') {
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

            //////on confirm button pressed the api will run

            this.http.post(environment.mainApi + this.globalData.companyLink + 'deleteparty', {
              PartyID: row.partyID,
              UserID: this.globalData.getUserID(),
              PinCode: pin,
            }).subscribe(
              (Response: any) => {
                if (Response.msg == 'Data Deleted Successfully') {
                  this.msg.SuccessNotify(Response.msg);
                  this.getParty();
                  this.addParty.focusPartyName();

                } else {
                  this.msg.WarnNotify(Response.msg);
                }
              }
            )

          }
        });
      }
    })




  }
}

