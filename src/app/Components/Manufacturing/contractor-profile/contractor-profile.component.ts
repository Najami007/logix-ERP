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
import { AddContractorProfileComponent } from './add-contractor-profile/add-contractor-profile.component';

@Component({
  selector: 'app-contractor-profile',
  templateUrl: './contractor-profile.component.html',
  styleUrls: ['./contractor-profile.component.scss']
})
export class ContractorProfileComponent implements OnInit {

  @ViewChild(AddContractorProfileComponent) addContractor: any;

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
          console.log(Response);
          if (Response.length > 0) {
            this.dataList = Response.filter((e: any) => e.partyType == 'Labour');

          }
        },
        error: (error: any) => {
          console.log(error);
        }
      }
    )
  }






  edit(item: any) {
    this.addContractor.partyID = item.partyID;
    this.addContractor.partyType = item.partyType;
    this.addContractor.partyName = item.partyName;
    this.addContractor.partyCNIC = item.partyCNIC;
    this.addContractor.passportNo = item.passportNo;
    this.addContractor.partyMobileno = item.partyMobileNo;
    this.addContractor.partyTelephoneno = item.telephoneNo;
    this.addContractor.bankName = item.bankName;
    this.addContractor.accountTitle = item.bankAccountTitle;
    this.addContractor.accountNo = item.bankAccountNo;
    this.addContractor.ntn = item.ntn;
    this.addContractor.strn = item.strn;
    this.addContractor.cityID = item.cityID;  
    this.addContractor.partyAddress = item.partyAddress;
    this.addContractor.description = item.partyDescription;
    this.addContractor.btnType = 'Update';


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
