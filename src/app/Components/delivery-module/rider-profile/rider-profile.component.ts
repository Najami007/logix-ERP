import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AddRiderProfileComponent } from './add-rider-profile/add-rider-profile.component';
import { MatDialog } from '@angular/material/dialog';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-rider-profile',
  templateUrl: './rider-profile.component.html',
  styleUrls: ['./rider-profile.component.scss']
})
export class RiderProfileComponent  {
  @ViewChild(AddRiderProfileComponent) addProfile: any;

  crudList: any = { c: true, r: true, u: true, d: true };

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
    this.globaldata.setHeaderTitle('Rider Profile');
    this.getSavedData();

      this.tableSizes = this.globaldata.paginationTableSizes;

  }


  
  page: number = 1;
  count: number = 0;

  tableSize: number = 10;
  tableSizes: any = [];

  onTableDataChange(event: any) {

    this.page = event;
    this.getSavedData();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getSavedData();
  }


  txtSearch: any;
  dataList: any = [];




  getSavedData() {
    this.http.get(environment.mainApi + this.globaldata.mobileLink + 'GetMobUser').subscribe(
      {
        next: (Response: any) => {
          if (Response.length > 0) {
            this.dataList = Response.filter((e: any) => e.userType == 'Rider');
          }
        },
        error: (error: any) => {
          console.log(error);
        }
      }
    )
  }


  
 






  edit(item: any) {
    this.addProfile.FirstName = item.firstName;
    this.addProfile.LastName = item.lastName;
    this.addProfile.MobUserID = item.mobUserID;
    this.addProfile.Email = item.email;
    this.addProfile.MobileNo = item.mobileNo;
    this.addProfile.userAddress = item.userAddress;
    this.addProfile.partyImg = item.imagesPath;
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


  printData(){
    this.globaldata.printData('#printDiv')
  }



}
  



