import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AddcityComponent } from '../../Company/settings/city/addcity/addcity.component';
import { environment } from 'src/environments/environment.development';
import { AddProfileComponent } from './add-profile/add-profile.component';


@Component({
  selector: 'app-add-disc-profile',
  templateUrl: './add-disc-profile.component.html',
  styleUrls: ['./add-disc-profile.component.scss']
})
export class AddDiscProfileComponent implements OnInit {

  @ViewChild(AddProfileComponent) addProfile: any;

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
    this.globaldata.setHeaderTitle('Contractor Profile');
    this.getSavedData();



  }

  txtSearch: any;



  dataList: any = [];




  getSavedData() {
    this.http.get(environment.mainApi + this.globaldata.companyLink + 'getParty').subscribe(
      {
        next: (Response: any) => {
  
          if (Response.length > 0) {
            this.dataList = Response.filter((e: any) => e.partyType == 'Customer-Disc');
            console.log(this.dataList);
          }
        },
        error: (error: any) => {
          console.log(error);
        }
      }
    )
  }






  edit(item: any) {
    this.addProfile.partyID = item.partyID;
    this.addProfile.partyType = item.partyType;
    this.addProfile.partyName = item.partyName;
    this.addProfile.partyCNIC = item.partyCNIC;
    this.addProfile.cusDisc = item.cusDisc;
    this.addProfile.passportNo = item.passportNo;
    this.addProfile.partyMobileno = item.partyMobileNo;
    this.addProfile.partyTelephoneno = item.telephoneNo;
    this.addProfile.bankName = item.bankName;
    this.addProfile.accountTitle = item.bankAccountTitle;
    this.addProfile.accountNo = item.bankAccountNo;
    this.addProfile.ntn = item.ntn;
    this.addProfile.strn = item.strn;
    this.addProfile.cityID = item.cityID;  
    this.addProfile.partyAddress = item.partyAddress;
    this.addProfile.description = item.partyDescription;
    this.addProfile.btnType = 'Update';


  }

  delete(item: any) {

    var postData: any = {

      partyID: item.partyID,
      PinCode: "",
      UserID: this.globaldata.getUserID()

    }

    this.globaldata.openPinCode().subscribe(pin => {
      if (pin != '') {
        postData.PinCode = pin;
        this.app.startLoaderDark();

        this.http.post(environment.mainApi + this.globaldata.companyLink + 'deleteparty', postData).subscribe(
          {
            next: (Response: any) => {
              if (Response.msg == 'Data Deleted Successfully') {
                this.msg.SuccessNotify(Response.msg);
                this.getSavedData();

              } else {
                this.msg.WarnNotify(Response.msg);
              }
              this.app.stopLoaderDark();
            },
            error: error => {
              console.log(error);
              this.app.stopLoaderDark();
            }
          }
        )
      }
    })




  }


  




}

